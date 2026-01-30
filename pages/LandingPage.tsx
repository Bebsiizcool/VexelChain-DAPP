import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center">
                <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span className="text-xs font-medium text-cyan-300">V2.0 is Live Now</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-400 mb-6 tracking-tight leading-tight">
                    The Future of <br />
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">DeFi Trading</span>
                </h1>

                <p className="text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
                    Experience lightning-fast swaps, real-time analytics, and seamless portfolio management.
                    Join thousands of users trading on BluePeak today.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-20">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-105 active:scale-95 text-lg"
                    >
                        Launch App
                    </button>
                    <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl backdrop-blur-sm transition-all text-lg">
                        Read Documentation
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                    {[
                        { label: 'Total Volume', value: '$12.5B+' },
                        { label: 'Active Users', value: '250K+' },
                        { label: 'Avg. Gas Cost', value: '<$0.01' }
                    ].map((stat, i) => (
                        <div key={i} className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <div className="text-3xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{stat.value}</div>
                            <div className="text-sm text-slate-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
