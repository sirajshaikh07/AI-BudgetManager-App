/* ── Mock data for UI preview ─────────────────────────── */

export const mockUser = {
    name: 'Siraj Shaikh',
    email: 'siraj@budgetpro.app',
    plan: 'Pro',
    avatar: null,
};

export interface Account {
    id: string;
    name: string;
    type: 'cash' | 'bank' | 'upi' | 'credit_card';
    balance: number;
    icon: string;
}

export const mockAccounts: Account[] = [
    { id: '1', name: 'Cash Wallet', type: 'cash', balance: 4520, icon: '💵' },
    { id: '2', name: 'HDFC Savings', type: 'bank', balance: 52340, icon: '🏦' },
    { id: '3', name: 'Google Pay', type: 'upi', balance: 1200, icon: '📱' },
    { id: '4', name: 'ICICI Credit', type: 'credit_card', balance: -8500, icon: '💳' },
];

export interface Transaction {
    id: string;
    title: string;
    category: string;
    amount: number;
    type: 'income' | 'expense' | 'transfer';
    date: string;
    icon: string;
}

export const mockTransactions: Transaction[] = [
    { id: '1', title: 'Salary', category: 'Income', amount: 65000, type: 'income', date: '2026-03-01', icon: '💰' },
    { id: '2', title: 'Swiggy Order', category: 'Food', amount: 450, type: 'expense', date: '2026-03-02', icon: '🍔' },
    { id: '3', title: 'Netflix', category: 'Entertainment', amount: 649, type: 'expense', date: '2026-03-02', icon: '🎬' },
    { id: '4', title: 'Uber Ride', category: 'Transport', amount: 320, type: 'expense', date: '2026-03-01', icon: '🚕' },
    { id: '5', title: 'Freelance', category: 'Income', amount: 12000, type: 'income', date: '2026-02-28', icon: '💻' },
    { id: '6', title: 'Electricity Bill', category: 'Bills', amount: 1850, type: 'expense', date: '2026-02-28', icon: '⚡' },
    { id: '7', title: 'Amazon Shopping', category: 'Shopping', amount: 2999, type: 'expense', date: '2026-02-27', icon: '🛒' },
    { id: '8', title: 'Gym Membership', category: 'Health', amount: 1500, type: 'expense', date: '2026-02-27', icon: '🏋️' },
];

export interface Budget {
    id: string;
    category: string;
    limit: number;
    spent: number;
    icon: string;
}

export const mockBudgets: Budget[] = [
    { id: '1', category: 'Food', limit: 8000, spent: 4500, icon: '🍔' },
    { id: '2', category: 'Transport', limit: 3000, spent: 2800, icon: '🚕' },
    { id: '3', category: 'Shopping', limit: 5000, spent: 2999, icon: '🛒' },
    { id: '4', category: 'Bills', limit: 10000, spent: 1850, icon: '⚡' },
    { id: '5', category: 'Entertainment', limit: 2000, spent: 649, icon: '🎬' },
];

export const mockCategories = [
    { id: '1', name: 'Food', icon: '🍔' },
    { id: '2', name: 'Transport', icon: '🚕' },
    { id: '3', name: 'Shopping', icon: '🛒' },
    { id: '4', name: 'Bills', icon: '⚡' },
    { id: '5', name: 'Entertainment', icon: '🎬' },
    { id: '6', name: 'Health', icon: '🏋️' },
    { id: '7', name: 'Education', icon: '📚' },
    { id: '8', name: 'Income', icon: '💰' },
];
