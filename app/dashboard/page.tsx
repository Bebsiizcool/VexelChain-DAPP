'use client';

import dynamic from 'next/dynamic';

const DashboardContent = dynamic(() => import('@/components/DashboardContent'), {
    ssr: false,
    loading: () => <div className="p-8 text-center text-slate-400">Loading dashboard...</div>
});

export default function Dashboard() {
    return <DashboardContent />;
}
