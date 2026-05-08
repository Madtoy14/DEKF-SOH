import { AlertTriangle } from 'lucide-react';

interface StatusBannerProps {
    tegangan: number;
}

export const StatusBanner = ({ tegangan }: StatusBannerProps) => {
    if (tegangan >= 11.5) return null; // Only show when critical

    return (
        <div className="w-full bg-red-950/40 border border-red-500/50 rounded-[2rem] p-5 sm:p-6 mb-8 flex items-center justify-between shadow-[0_0_30px_rgba(239,68,68,0.2)] backdrop-blur-md animate-pulse">
            <div className="flex items-start sm:items-center gap-3 sm:gap-5">
                <div className="bg-red-500/20 p-3 sm:p-4 rounded-2xl border border-red-500/30 shrink-0">
                    <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                </div>
                <div>
                    <h3 className="text-red-400 font-black text-base sm:text-xl tracking-wide drop-shadow-[0_0_5px_rgba(239,68,68,0.5)] leading-tight">KRITIS: Baterai perlu penggantian segera</h3>
                    <p className="text-red-200/70 text-xs sm:text-sm font-medium mt-1 sm:mt-1.5 tracking-wide leading-relaxed">Tegangan terminal turun di bawah batas aman pengoperasian.</p>
                </div>
            </div>
            <div className="hidden md:flex flex-col items-end shrink-0 ml-4">
                <span className="text-xs text-red-400 font-bold uppercase tracking-widest">Threshold Alert</span>
                <span className="text-red-500 font-black font-mono text-2xl drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] mt-1">{'<'} 11.50V</span>
            </div>
        </div>
    );
};
