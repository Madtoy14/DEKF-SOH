import { Activity } from 'lucide-react';

export const Header = () => {
    return (
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-slate-900/60 backdrop-blur-xl border-b border-slate-700/50 p-6 md:p-8 rounded-[2rem] shadow-[0_4px_30px_rgba(0,0,0,0.5)] mb-8 relative overflow-hidden gap-6 xl:gap-0">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-transparent"></div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 relative z-10 w-full">
                <div className="flex items-center gap-4 shrink-0">
                    {/* Tempatkan Logo BMKG di Kiri */}
                    <img
                        src="/logoBMKG.png"
                        alt="Logo BMKG"
                        className="w-12 sm:w-14 md:w-16 h-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] object-contain"
                    />

                    {/* Tempatkan Logo STMKG di Kanan BMKG */}
                    <img
                        src="/logoSTMKG.png"
                        alt="Logo STMKG"
                        className="w-14 sm:w-16 md:w-18 h-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] object-contain"
                    />
                </div>

                <div className="mt-2 sm:mt-0 sm:ml-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent tracking-tight drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] leading-tight">
                        Sistem Monitoring Baterai AWS - BMKG
                    </h1>
                    <p className="text-cyan-100/60 text-xs sm:text-sm mt-1 sm:mt-2 font-semibold tracking-wide">
                        Stasiun: AWS Geofisika Tangerang | Lokasi: Lat: -6.17, Long: 106.64
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-start xl:items-end relative z-10 w-full xl:w-auto">
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                    <span className="text-emerald-400 font-bold text-sm tracking-widest uppercase">Status: Online</span>
                </div>
                <p className="text-slate-400 text-xs mt-3 font-semibold flex items-center gap-1.5 tracking-wide">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    Last sync: 1s ago
                </p>
            </div>
        </header>
    );
};
