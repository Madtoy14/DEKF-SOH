import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { LogEntry } from '../hooks/useBatteryData';

interface DataLogTableProps {
    logs: LogEntry[];
}

export const DataLogTable = ({ logs }: DataLogTableProps) => {
    const exportToExcel = () => {
        if (!logs || logs.length === 0) return;

        const dataToExport = logs.slice(0, 5).map(log => ({
            'Timestamp': log.timestamp,
            'Tegangan (V)': log.tegangan.toFixed(2),
            'Arus (A)': log.arus.toFixed(2),
            'SOC (%)': log.soc_dekf,
            'Resistansi (Ω)': log.r0_estimasi ? log.r0_estimasi.toFixed(4) : 0,
            'Status': log.status,
            'Alert Level': log.alertLevel
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Log Data");

        const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
        XLSX.writeFile(workbook, `Log_Baterai_BMKG_${dateStr}.xlsx`);
    };

    return (
        <div className="glass-panel p-6 md:p-8 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                    Log Data & Status Alert Terbaru 
                    <span className="block sm:inline-block text-cyan-400 text-xs sm:text-sm font-medium sm:ml-2 uppercase tracking-widest mt-1 sm:mt-0">(5 Data Terakhir)</span>
                </h2>
                <button 
                    onClick={exportToExcel}
                    className="flex items-center gap-2 bg-slate-800 border border-cyan-500/50 hover:bg-cyan-500/20 text-cyan-300 px-6 py-2.5 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:-translate-y-0.5"
                >
                    <Download className="w-4 h-4" />
                    Export Data (.XLSX)
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-slate-700/50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                            <th className="pb-4 px-4">Timestamp</th>
                            <th className="pb-4 px-4">Tegangan (V)</th>
                            <th className="pb-4 px-4">Arus (A)</th>
                            <th className="pb-4 px-4">SOC (%)</th>
                            <th className="pb-4 px-4">Resistansi (Ω)</th>
                            <th className="pb-4 px-4">Status</th>
                            <th className="pb-4 px-4">Alert Level</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-medium">
                        {logs.slice(0, 5).map((log) => (
                            <tr key={log.id} className="border-b border-slate-700/30 hover:bg-slate-800/50 transition-colors group">
                                <td className="py-4 px-4 text-cyan-200/70 font-mono text-xs group-hover:text-cyan-300 transition-colors">{log.timestamp}</td>
                                <td className="py-4 px-4 font-bold text-white group-hover:text-cyan-100 transition-colors">{log.tegangan.toFixed(2)}</td>
                                <td className="py-4 px-4 text-slate-300">{log.arus.toFixed(2)}</td>
                                <td className="py-4 px-4 text-slate-300">{log.soc_dekf}</td>
                                <td className="py-4 px-4 text-slate-300">{log.r0_estimasi ? log.r0_estimasi.toFixed(4) : 0}</td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1.5 rounded-md text-xs font-bold shadow-[0_0_10px_rgba(0,0,0,0.3)] border ${log.status === 'Discharging' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'}`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1.5 rounded-md text-xs font-bold shadow-[0_0_10px_rgba(0,0,0,0.3)] border ${log.alertLevel === 'NORMAL' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                                        {log.alertLevel}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
