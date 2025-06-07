// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CooperativeLedger {
    address public immutable admin;

    enum TxType { Contribution, Withdrawal }

    struct LedgerEntry {
        bytes32 memberId;      // Use bytes32 instead of string for gas efficiency
        uint128 amount;        // Use uint128 instead of uint256 (sufficient for most amounts)
        TxType txType;         // 1 byte
        uint32 timestamp;      // Use uint32 for timestamp (valid until 2106)
        bytes32 description;   // Use bytes32 instead of string
    }

    LedgerEntry[] public ledger;

    // Packed struct to minimize storage slots
    struct Member {
        uint128 totalContributions;
        uint128 totalWithdrawals;
        bool exists;
    }

    mapping(bytes32 => Member) public members;
    mapping(bytes32 => bool) public authorizedMembers;

    event EntryRecorded(
        bytes32 indexed memberId,
        uint128 amount,
        TxType indexed txType,
        uint32 timestamp,
        bytes32 description
    );

    event MemberAuthorized(bytes32 indexed memberId);
    event MemberRevoked(bytes32 indexed memberId);

    error OnlyAdmin();
    error OnlyAuthorizedMember();
    error InsufficientContribution();
    error InsufficientFunds();
    error MemberNotExists();
    error IndexOutOfBounds();
    error AmountTooLarge();

    modifier onlyAdmin() {
        if (msg.sender != admin) revert OnlyAdmin();
        _;
    }

    modifier onlyAuthorizedMember(bytes32 memberId) {
        if (!authorizedMembers[memberId]) revert OnlyAuthorizedMember();
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function authorizeMember(bytes32 memberId) external onlyAdmin {
        authorizedMembers[memberId] = true;
        if (!members[memberId].exists) {
            members[memberId].exists = true;
        }
        emit MemberAuthorized(memberId);
    }

    function revokeMember(bytes32 memberId) external onlyAdmin {
        authorizedMembers[memberId] = false;
        emit MemberRevoked(memberId);
    }

    function contribute(
        bytes32 memberId,
        bytes32 description
    ) external payable onlyAuthorizedMember(memberId) {
        if (msg.value == 0) revert InsufficientContribution();
        if (msg.value > type(uint128).max) revert AmountTooLarge();

        uint128 amount = uint128(msg.value);
        uint32 timestamp = uint32(block.timestamp);

        // Update member stats
        members[memberId].totalContributions += amount;

        // Add to ledger
        ledger.push(LedgerEntry({
            memberId: memberId,
            amount: amount,
            txType: TxType.Contribution,
            timestamp: timestamp,
            description: description
        }));

        emit EntryRecorded(memberId, amount, TxType.Contribution, timestamp, description);
    }

    function withdraw(
        bytes32 memberId,
        uint128 amount,
        bytes32 description,
        address payable recipient
    ) external onlyAdmin {
        if (address(this).balance < amount) revert InsufficientFunds();
        if (!members[memberId].exists) revert MemberNotExists();

        uint32 timestamp = uint32(block.timestamp);

        // Update member stats
        members[memberId].totalWithdrawals += amount;

        // Add to ledger before transfer for reentrancy protection
        ledger.push(LedgerEntry({
            memberId: memberId,
            amount: amount,
            txType: TxType.Withdrawal,
            timestamp: timestamp,
            description: description
        }));

        // Transfer funds
        recipient.transfer(amount);

        emit EntryRecorded(memberId, amount, TxType.Withdrawal, timestamp, description);
    }

    // Batch operations for gas efficiency
    function batchWithdraw(
        bytes32[] calldata memberIds,
        uint128[] calldata amounts,
        bytes32[] calldata descriptions,
        address payable[] calldata recipients
    ) external onlyAdmin {
        uint256 length = memberIds.length;
        require(
            length == amounts.length &&
            length == descriptions.length &&
            length == recipients.length,
            "Array length mismatch"
        );

        uint256 totalAmount;
        for (uint256 i = 0; i < length;) {
            totalAmount += amounts[i];
            unchecked { ++i; }
        }

        if (address(this).balance < totalAmount) revert InsufficientFunds();

        for (uint256 i = 0; i < length;) {
            _withdraw(memberIds[i], amounts[i], descriptions[i], recipients[i]);
            unchecked { ++i; }
        }
    }

    function _withdraw(
        bytes32 memberId,
        uint128 amount,
        bytes32 description,
        address payable recipient
    ) private {
        if (!members[memberId].exists) revert MemberNotExists();

        uint32 timestamp = uint32(block.timestamp);

        members[memberId].totalWithdrawals += amount;

        ledger.push(LedgerEntry({
            memberId: memberId,
            amount: amount,
            txType: TxType.Withdrawal,
            timestamp: timestamp,
            description: description
        }));

        recipient.transfer(amount);

        emit EntryRecorded(memberId, amount, TxType.Withdrawal, timestamp, description);
    }

    // View functions
    function getEntryCount() external view returns (uint256) {
        return ledger.length;
    }

    function getEntry(uint256 index) external view returns (LedgerEntry memory) {
        if (index >= ledger.length) revert IndexOutOfBounds();
        return ledger[index];
    }

    function getEntries(
        uint256 start,
        uint256 count
    ) external view returns (LedgerEntry[] memory) {
        if (start >= ledger.length) revert IndexOutOfBounds();

        uint256 end = start + count;
        if (end > ledger.length) {
            end = ledger.length;
        }

        LedgerEntry[] memory entries = new LedgerEntry[](end - start);
        for (uint256 i = start; i < end;) {
            entries[i - start] = ledger[i];
            unchecked { ++i; }
        }

        return entries;
    }

    function getMemberStats(bytes32 memberId) external view returns (
        uint128 totalContributions,
        uint128 totalWithdrawals,
        uint128 netBalance,
        bool exists,
        bool authorized
    ) {
        Member memory member = members[memberId];
        totalContributions = member.totalContributions;
        totalWithdrawals = member.totalWithdrawals;
        netBalance = totalContributions > totalWithdrawals ?
            totalContributions - totalWithdrawals : 0;
        exists = member.exists;
        authorized = authorizedMembers[memberId];
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Emergency functions
    function emergencyWithdraw() external onlyAdmin {
        payable(admin).transfer(address(this).balance);
    }
}
