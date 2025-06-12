// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CooperativeLedger {
    address public immutable admin;

    enum TxType { Contribution, Withdrawal }

    struct LedgerEntry {
        bytes32 memberId;
        uint128 amount;
        TxType txType;
        uint32 timestamp;
        string description; 
    }

    LedgerEntry[] public ledger;

    struct Member {
        uint128 totalContributions;
        uint128 totalWithdrawals;
        bool exists;
    }

    mapping(bytes32 => Member) public members;

    event EntryRecorded(
        bytes32 indexed memberId,
        uint128 amount,
        TxType indexed txType,
        uint32 timestamp,
        string description
    );

    error OnlyAdmin();
    error InsufficientContribution();
    error MemberNotExists();
    error IndexOutOfBounds();
    error AmountTooLarge();

    modifier onlyAdmin() {
        if (msg.sender != admin) revert OnlyAdmin();
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function recordContribution(
        bytes32 memberId,
        uint128 amount,
        string calldata description
    ) external {
        // if (amount == 0) revert InsufficientContribution();

        uint32 timestamp = uint32(block.timestamp);

        if (!members[memberId].exists) {
            members[memberId].exists = true;
        }

        members[memberId].totalContributions += amount;

        ledger.push(LedgerEntry({
            memberId: memberId,
            amount: amount,
            txType: TxType.Contribution,
            timestamp: timestamp,
            description: description
        }));

        emit EntryRecorded(memberId, amount, TxType.Contribution, timestamp, description);
    }

    function recordWithdrawal(
        bytes32 memberId,
        uint128 amount,
        string calldata description
    ) external {
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

    function getEntries(uint256 start, uint256 count) external view returns (LedgerEntry[] memory) {
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
        bool exists
    ) {
        Member memory member = members[memberId];
        totalContributions = member.totalContributions;
        totalWithdrawals = member.totalWithdrawals;
        netBalance = totalContributions > totalWithdrawals ?
            totalContributions - totalWithdrawals : 0;
        exists = member.exists;
    }
}