import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from "react";
import BlockchainLedger from '@/components/BlockchainLedger';
import ledgerABI from '@/abis/LedgerABI.json';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Ledger',
        href: '/members',
    },
];
export default function Index() {

  return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />
            <BlockchainLedger
        contractAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3"
        abi={ledgerABI}
        pageSize={8}
        showMember={true}
        showDescription={false}
      />
        </AppLayout>
    );
}
