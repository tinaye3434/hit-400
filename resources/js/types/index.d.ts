import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Member {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    status: string;
    joining_date: string;
    gender: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Billing {
    id: number;
    financial_period_id: number;
    billed_amount: number;
    paid_amount: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...

}

export interface FinancialPeriod {
    id: number;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Bill {
    id: number;
    billing_id: number;
    member_id: number;
    financial_period_id: number;
    amount: number;
    status: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface PaymentMethod {
    id: number;
    name: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Withdrawal {
    id: number;
    amount: number;
    comment: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}
