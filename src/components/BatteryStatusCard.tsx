import { Zap, TrendingDown, Pause } from 'lucide-react';

interface BatteryStatusCardProps {
    id?: string;
    status: string;
}

type StatusConfig = {
    label: string;
    icon: React.ReactNode;
    textColor: string;
    bgColor: string;
    borderColor: string;
    glowColor: string;
    iconBg: string;
    badgeBg: string;
    badgeBorder: string;
    pulseClass: string;
};

const getStatusConfig = (status: string): StatusConfig => {
    const s = status?.trim().toLowerCase();

    if (s === 'charging') {
        return {
            label: 'Charging',
            icon: <Zap className="w-6 h-6" />,
            textColor: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/40',
            glowColor: 'shadow-[0_0_30px_rgba(16,185,129,0.25)]',
            iconBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 group-hover:bg-emerald-500/30 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]',
            badgeBg: 'bg-emerald-500/20',
            badgeBorder: 'border-emerald-500/50',
            pulseClass: 'animate-pulse',
        };
    }

    if (s === 'discharging') {
        return {
            label: 'Discharging',
            icon: <TrendingDown className="w-6 h-6" />,
            textColor: 'text-orange-400',
            bgColor: 'bg-orange-500/10',
            borderColor: 'border-orange-500/40',
            glowColor: 'shadow-[0_0_30px_rgba(249,115,22,0.2)]',
            iconBg: 'bg-orange-500/20 border-orange-500/40 text-orange-300 group-hover:bg-orange-500/30 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]',
            badgeBg: 'bg-orange-500/20',
            badgeBorder: 'border-orange-500/50',
            pulseClass: '',
        };
    }

    // Resting / default
    return {
        label: s === 'resting' ? 'Resting' : (status || '-'),
        icon: <Pause className="w-6 h-6" />,
        textColor: 'text-slate-400',
        bgColor: 'bg-slate-700/30',
        borderColor: 'border-slate-600/40',
        glowColor: 'shadow-[0_0_15px_rgba(148,163,184,0.1)]',
        iconBg: 'bg-slate-700/50 border-slate-600/40 text-slate-400 group-hover:bg-slate-600/50 group-hover:shadow-[0_0_15px_rgba(148,163,184,0.3)]',
        badgeBg: 'bg-slate-700/50',
        badgeBorder: 'border-slate-600/50',
        pulseClass: '',
    };
};

export const BatteryStatusCard = ({ id, status }: BatteryStatusCardProps) => {
    const cfg = getStatusConfig(status);

    return (
        <div
            id={id}
            className={`glass-panel p-6 md:p-8 flex flex-col justify-between group border ${cfg.borderColor} ${cfg.glowColor} transition-all duration-500`}
        >
            {/* Header row */}
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-sm md:text-base font-bold tracking-widest text-slate-400 uppercase">
                    Status Baterai
                </h3>
                <div className={`p-3 border rounded-xl transition-all duration-300 ${cfg.iconBg}`}>
                    {cfg.icon}
                </div>
            </div>

            {/* Main content */}
            <div className="mt-auto flex flex-col gap-4">
                {/* Big status text */}
                <div className={`text-4xl sm:text-5xl font-black tracking-tight drop-shadow-lg ${cfg.textColor} ${cfg.pulseClass}`}>
                    {cfg.label}
                </div>

                {/* Colored badge description */}
                <span
                    className={`inline-flex items-center gap-2 self-start text-xs font-bold px-3 py-1.5 rounded-lg border ${cfg.badgeBg} ${cfg.badgeBorder} ${cfg.textColor}`}
                >
                    <span className={`w-2 h-2 rounded-full ${cfg.textColor.replace('text-', 'bg-')} ${cfg.pulseClass}`} />
                    {status?.trim().toLowerCase() === 'charging'
                        ? 'Baterai sedang diisi daya'
                        : status?.trim().toLowerCase() === 'discharging'
                        ? 'Baterai sedang digunakan'
                        : 'Baterai dalam kondisi standby'}
                </span>
            </div>
        </div>
    );
};
