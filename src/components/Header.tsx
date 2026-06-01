import { Activity, WifiOff, Zap, TrendingDown, Pause, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SettingsModal } from './SettingsModal';

interface HeaderProps {
    isOnline?: boolean;
    lastUpdateDate?: Date | null;
    batteryStatus?: string;
}

export const Header = ({ isOnline = false, lastUpdateDate = null, batteryStatus = '-' }: HeaderProps) => {
    const [timeAgo, setTimeAgo] = useState<string>('Waiting for data...');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!lastUpdateDate) {
                setTimeAgo('Waiting for data...');
                return;
            }
            const diffSeconds = Math.floor((new Date().getTime() - lastUpdateDate.getTime()) / 1000);
            if (diffSeconds < 60) {
                setTimeAgo(`${diffSeconds}s ago`);
            } else if (diffSeconds < 3600) {
                setTimeAgo(`${Math.floor(diffSeconds / 60)}m ago`);
            } else {
                setTimeAgo(`${Math.floor(diffSeconds / 3600)}h ago`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [lastUpdateDate]);

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
                        AWS BMKG Pusat | Lokasi: -6.15, Long: 106.84
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-start xl:items-end relative z-10 w-full xl:w-auto gap-3">
                {/* Top row of right section: Settings & Online/Offline */}
                <div className="flex items-center gap-3 self-end xl:self-auto">
                    {/* Tombol Settings */}
                    <button 
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-2.5 bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 rounded-full text-slate-400 hover:text-cyan-400 transition-all shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                        title="Setting Kapasitas Baterai"
                    >
                        <Settings className="w-4 h-4" />
                    </button>

                    {/* Badge Online/Offline */}
                    <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full border transition-colors duration-300 ${isOnline ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]'}`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-red-400 shadow-[0_0_10px_rgba(239,68,68,0.8)]'}`}></div>
                        <span className={`font-bold text-sm tracking-widest uppercase ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isOnline ? 'Online' : 'Offline'}
                        </span>
                    </div>
                </div>

                {/* Badge Status Baterai */}
                {(() => {
                    const s = batteryStatus?.trim().toLowerCase();
                    const isCharging = s === 'charging';
                    const isDischarging = s === 'discharging';
                    const statusLabel = isCharging ? 'Charging' : isDischarging ? 'Discharging' : 'Resting';
                    const icon = isCharging
                        ? <Zap className="w-3.5 h-3.5" />
                        : isDischarging
                        ? <TrendingDown className="w-3.5 h-3.5" />
                        : <Pause className="w-3.5 h-3.5" />;
                    const style = isCharging
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : isDischarging
                        ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                        : 'bg-slate-700/40 border-slate-600/40 text-slate-400';
                    const dotStyle = isCharging
                        ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                        : isDischarging
                        ? 'bg-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.8)]'
                        : 'bg-slate-500';
                    return (
                        <div className={`flex items-center gap-2.5 px-4 py-2 rounded-full border transition-colors duration-500 ${style}`}>
                            <div className={`w-2 h-2 rounded-full ${dotStyle}`} />
                            {icon}
                            <span className="font-bold text-xs tracking-widest uppercase">{statusLabel}</span>
                        </div>
                    );
                })()}

                <p className={`text-xs font-semibold flex items-center gap-1.5 tracking-wide ${isOnline ? 'text-slate-400' : 'text-red-300/70'}`}>
                    {isOnline ? <Activity className="w-3.5 h-3.5 text-cyan-400" /> : <WifiOff className="w-3.5 h-3.5 text-red-400" />}
                    Last sync: {timeAgo}
                </p>
            </div>
            
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </header>
    );
};
