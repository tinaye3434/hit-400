import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Member } from '@/types';
import { Head } from '@inertiajs/react';
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
export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Member" />
            <div className="container mx-auto py-3">

            </div>
        </AppLayout>
    );

}
