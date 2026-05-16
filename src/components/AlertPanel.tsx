import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

interface AlertPanelProps {
    tegangan: number;
    soc: number;
    soh: number;
}

export const AlertPanel = ({ tegangan, soc, soh }: AlertPanelProps) => {
    const alerts = [];

    if (tegangan < 11.5) {
        alerts.push(
            <div key="tegangan" className="flex items-start gap-4 bg-red-500/10 border-l-4 border-red-500 rounded-r-lg p-4">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                    <h4 className="text-red-400 font-bold mb-1">ALERT KRITIS – Tegangan {tegangan.toFixed(2)}V</h4>
                    <p className="text-slate-300 text-sm mb-2">Tegangan terminal di bawah batas kritis.</p>
                    <p className="text-slate-400 text-xs italic">Rekomendasi: Segera periksa koneksi baterai dan sistem pengisian</p>
                    <span className="text-slate-500 text-[10px] mt-2 block">Saat ini</span>
                </div>
            </div>
        );
    }

    if (soc < 50) {
        alerts.push(
            <div key="soc" className="flex items-start gap-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg p-4">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                    <h4 className="text-amber-400 font-bold mb-1">PERINGATAN – SOC {soc.toFixed(1)}%</h4>
                    <p className="text-slate-300 text-sm mb-2">Kapasitas mulai menurun.</p>
                    <p className="text-slate-400 text-xs italic">Rekomendasi: Periksa sistem pengisian</p>
                    <span className="text-slate-500 text-[10px] mt-2 block">Saat ini</span>
                </div>
            </div>
        );
    }

    if (soh < 80) {
        alerts.push(
            <div key="soh" className="flex items-start gap-4 bg-red-500/10 border-l-4 border-red-500 rounded-r-lg p-4">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                    <h4 className="text-red-400 font-bold mb-1">ALERT KRITIS – SOH {soh.toFixed(1)}%</h4>
                    <p className="text-slate-300 text-sm mb-2">Kapasitas menurun signifikan.</p>
                    <p className="text-slate-400 text-xs italic">Rekomendasi: Jadwalkan penggantian baterai</p>
                    <span className="text-slate-500 text-[10px] mt-2 block">Saat ini</span>
                </div>
            </div>
        );
    }

    if (alerts.length === 0) {
        alerts.push(
            <div key="ok" className="flex items-start gap-4 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-r-lg p-4">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                    <h4 className="text-emerald-400 font-bold mb-1">STATUS NORMAL</h4>
                    <p className="text-slate-300 text-sm mb-2">Semua parameter baterai dalam batas aman.</p>
                    <p className="text-slate-400 text-xs italic">Rekomendasi: Lanjutkan pemantauan rutin</p>
                    <span className="text-slate-500 text-[10px] mt-2 block">Saat ini</span>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-white">Panel Alert & Rekomendasi Maintenance</h2>
            <div className="flex flex-col gap-4">
                {alerts}
            </div>
        </div>
    );
};
