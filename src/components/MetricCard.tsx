import type { ReactNode } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface MetricCardProps {
    id?: string;
    title: string;
    value?: string | number;
    subtext?: string;
    icon?: ReactNode;
    label?: { text: string; type: 'danger' | 'warning' | 'info' };
    progress?: number;
    progressColor?: string;
}

export const MetricCard = ({
    id,
    title,
    value,
    subtext,
    icon,
    label,
    progress,
    progressColor = '#06b6d4' // default cyan for cyber theme
}: MetricCardProps) => {
    return (
        <div id={id} className="glass-panel p-6 md:p-8 flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-sm md:text-base font-bold tracking-widest text-slate-400 uppercase">{title}</h3>
                {icon && (
                    <div className="p-3 bg-slate-800/80 text-cyan-400 border border-cyan-500/30 rounded-xl group-hover:bg-cyan-500/20 group-hover:text-cyan-300 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300">
                        {icon}
                    </div>
                )}
            </div>

            {label && (
                <div className={`text-xs font-bold px-3 py-1.5 rounded-md inline-block mb-4 self-start border
          ${label.type === 'danger' ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]' :
                        label.type === 'warning' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]' :
                            'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'}
        `}>
                    {label.text}
                </div>
            )}

            {progress !== undefined ? (
                <div className="flex flex-col items-center justify-center flex-1">
                    <div className="w-32 h-32 relative drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                        <CircularProgressbar
                            value={progress}
                            text={`${progress}%`}
                            styles={buildStyles({
                                textColor: '#f8fafc', // white
                                pathColor: progressColor,
                                trailColor: 'rgba(255,255,255,0.05)',
                                pathTransitionDuration: 0.5,
                                textSize: '1.5rem',
                            })}
                        />
                    </div>
                    {subtext && <p className="text-sm text-cyan-200/70 mt-6 font-medium tracking-wide bg-slate-800/50 px-4 py-1.5 rounded-lg border border-slate-700/50">{subtext}</p>}
                </div>
            ) : (
                <div className="mt-auto">
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{value}</span>
                    </div>
                    {subtext && <p className="text-sm text-cyan-200/70 mt-4 font-medium tracking-wide bg-slate-800/50 px-4 py-1.5 rounded-lg border border-slate-700/50 inline-block">{subtext}</p>}
                </div>
            )}
        </div>
    );
};
