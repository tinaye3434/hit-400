import BlockchainLedger from '@/components/BlockchainLedger';

function LedgerPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cooperative Ledger</h1>
      <BlockchainLedger />
    </div>
  );
}