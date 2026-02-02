import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { connectWallet, isConnected } = useWallet();

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-end pb-20 relative overflow-hidden bg-black">
            {/* Layer 1: Deep Sky Background (Static) */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/final_sky_bg.png"
                    alt="Space Background"
                    className="w-full h-full object-cover opacity-100"
                />
            </div>

            {/* Layer 1.5: Shooting Stars */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="shooting-star"
                        style={{
                            top: `${Math.random() * 100 - 20}%`,
                            left: `${Math.random() * 150 - 25}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    />
                ))}
            </div>

            {/* Layer 2: Rotating Red Moon (Behind Landscape) */}
            <div
                className="absolute top-[15%] md:top-[-25%] left-1/2 -translate-x-1/2 w-[160vw] h-[160vw] md:w-[1600px] md:h-[1600px] z-10 pointer-events-none"
                style={{
                    WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 85%)',
                    maskImage: 'linear-gradient(to bottom, black 10%, transparent 85%)'
                }}
            >
                <div className="w-full h-full animate-fade-in-up delay-100">
                    <img
                        src="/final_red_moon_glow.png"
                        alt="Red Moon"
                        className="w-full h-full object-contain opacity-80 animate-spin-slow"
                        style={{ animationDuration: '20s' }}
                    />
                </div>
            </div>

            {/* Layer 3: Martian Landscape (Mid-Ground) */}
            <div className="absolute bottom-0 left-0 w-full h-[40vh] md:h-[80vh] z-20 pointer-events-none animate-fade-in-up delay-200">
                <img
                    src="/final_landscape_glow.png"
                    alt="Martian Terrain"
                    className="w-full h-full object-cover object-bottom"
                />
            </div>

            {/* Layer 3.5: Headline Text (Behind Astronaut) */}
            <div className="absolute top-[15%] md:top-[12%] left-0 w-full z-30 flex flex-col items-center justify-center text-center pointer-events-none -translate-y-[45px]">
                <h1 className="text-5xl md:text-9xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl uppercase animate-fade-in-up-slow delay-400">
                    THE FUTURE IS <br />
                    <span className="tracking-tighter [text-shadow:0_0_2px_white] block mt-2" style={{ wordSpacing: '220px' }}>VEXEL CHAIN</span>
                </h1>
            </div>

            {/* Layer 4: Astronaut (Fixed Foreground) */}
            <div className="absolute bottom-0 md:bottom-[-10%] left-1/2 -translate-x-1/2 w-[160vw] md:w-[1000px] lg:w-[1400px] xl:w-[1600px] z-40 pointer-events-none">
                <div className="w-full h-auto animate-fade-in-up-slow delay-400">
                    <img
                        src="/final_astronaut_glow.png"
                        alt="BluePeak Pilot"
                        className="w-full h-auto max-h-[100vh] object-contain animate-breathe-glow"
                    />
                </div>
            </div>

            {/* Layer 5: Content Overlay (Top Section) - Left Aligned */}
            <div className="absolute top-[50%] md:top-[55%] left-0 w-full z-50 px-6 md:px-12 lg:px-24 flex flex-col items-start text-left pointer-events-none animate-fade-in-up delay-700">
                <div className="pointer-events-auto w-full max-w-[500px] md:h-[260px] flex flex-col justify-center items-center text-center bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                    <div className="mb-4">
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-2 drop-shadow-xl font-sans tracking-tight">
                            JOIN THE FUTURE OF <br />
                            BLOCKCHAINS
                        </h2>
                        <p className="text-sm md:text-base text-slate-300 font-medium tracking-wide">
                            Trade smarter and safer with VexelChain
                        </p>
                    </div>

                    <div className="flex flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 text-base"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={() => navigate('/portfolio')}
                            className="px-8 py-3 bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 text-base"
                        >
                            Explore Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/80"></div>
        </div>
    );
};
