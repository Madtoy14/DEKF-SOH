import { AlertCircle, AlertTriangle } from 'lucide-react';

export const AlertPanel = () => {
    return (
        <div className="glass-panel p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-white">Panel Alert & Rekomendasi Maintenance</h2>

            <div className="flex flex-col gap-4">
                {/* Alert 1 */}
                <div className="flex items-start gap-4 bg-red-500/10 border-l-4 border-red-500 rounded-r-lg p-4">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                        <h4 className="text-red-400 font-bold mb-1">ALERT KRITIS – Tegangan 11.30V</h4>
                        <p className="text-slate-300 text-sm mb-2">Tegangan terminal di bawah batas kritis.</p>
                        <p className="text-slate-400 text-xs italic">Rekomendasi: Segera periksa koneksi baterai dan sistem pengisian</p>
                        <span className="text-slate-500 text-[10px] mt-2 block">17 mins ago</span>
                    </div>
                </div>

                {/* Alert 2 */}
                <div className="flex items-start gap-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg p-4">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                        <h4 className="text-amber-400 font-bold mb-1">PERINGATAN – SOC &lt; 50%</h4>
                        <p className="text-slate-300 text-sm mb-2">Kapasitas mulai menurun.</p>
                        <p className="text-slate-400 text-xs italic">Rekomendasi: Periksa sistem pengisian</p>
                        <span className="text-slate-500 text-[10px] mt-2 block">1 hour ago</span>
                    </div>
                </div>

                {/* Alert 3 */}
                <div className="flex items-start gap-4 bg-red-500/10 border-l-4 border-red-500 rounded-r-lg p-4">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                        <h4 className="text-red-400 font-bold mb-1">ALERT KRITIS – SOH 71%</h4>
                        <p className="text-slate-300 text-sm mb-2">Kapasitas menurun signifikan.</p>
                        <p className="text-slate-400 text-xs italic">Rekomendasi: Jadwalkan penggantian baterai</p>
                        <span className="text-slate-500 text-[10px] mt-2 block">1 day ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
