const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("⏳ Deploying CooperativeLedger...");

    const Ledger = await hre.ethers.getContractFactory("CooperativeLedger");
    const ledger = await Ledger.deploy();

    // Wait for deployment to complete (Ethers v6: .waitForDeployment instead of .deployed())
    await ledger.waitForDeployment();

    const ledgerAddress = await ledger.getAddress();
    console.log("✅ Ledger deployed to:", ledgerAddress);

    const outputDir = path.resolve(__dirname, "../resources/js/abis");

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(outputDir, "LedgerAddress.json"),
        JSON.stringify({ address: ledgerAddress }, null, 2)
    );

    fs.writeFileSync(
        path.join(outputDir, "LedgerABI.json"),
        JSON.stringify(Ledger.interface.format("json"), null, 2)
    );

    console.log("📦 ABI and address written to:", outputDir);
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
});
