import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Member } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Members',
        href: '/members',
    },
];
export default function Index({ members } : { members: Member }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="text-right mt-5 mr-4">
                <Button>Add Member</Button>
            </div>
            <div className="container mx-auto py-3">
                <DataTable columns={columns} data={members} />
            </div>
        </AppLayout>
    );

}
