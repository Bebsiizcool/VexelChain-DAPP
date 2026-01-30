'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero3D from '@/components/Hero3D';

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
      </div>

      <main className="relative z-10 flex flex-col md:flex-row gap-12 items-center text-center md:text-left max-w-6xl px-6 w-full">

        <div className="flex-1 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-500 mb-4 drop-shadow-2xl">
              EXPERIENCE <br />
              <span className="text-cyan-400">THE FUTURE</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Connect to the next generation of decentralized finance. Safe, fast, and built for tomorrow.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex gap-4 mt-8 justify-center md:justify-start"
          >
            <div className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-black shadow-[0_0_20px_rgba(0,242,234,0.5)] hover:shadow-[0_0_40px_rgba(0,242,234,0.7)] hover:scale-105 transition-all cursor-pointer">
              Connect Wallet
            </div>
            <div className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 font-medium transition-colors cursor-pointer">
              Learn More
            </div>
          </motion.div>
        </div>

        <div className="flex-1 flex justify-center perspective-1000">
          <Hero3D />
        </div>

      </main>

      {/* Footer Stats */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-0 w-full glass-panel border-t border-white/10 py-8"
      >
        <div className="max-w-6xl mx-auto flex justify-around text-center">
          {[
            { label: "Total Volume", value: "$4.2B+" },
            { label: "Active Users", value: "890K+" },
            { label: "Secure Assets", value: "100%" },
          ].map((stat, i) => (
            <div key={i}>
              <h4 className="text-2xl font-bold text-white">{stat.value}</h4>
              <p className="text-sm text-cyan-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
