import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Sliders, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

export const RemoteTuningCard = () => {
    const [qNominal, setQNominal] = useState<number | ''>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const fetchData = async () => {
        setIsFetching(true);
        try {
            const { data, error } = await supabase
                .from('config_baterai')
                .select('q_nominal')
                .eq('id', 1)
                .single();

            if (error) throw error;
            if (data) {
                setQNominal(data.q_nominal);
            }
        } catch (err: any) {
            console.error("Error fetching config_baterai:", err);
            showToast('Gagal mengambil data dari cloud', 'error');
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleResetBMS = async () => {
        if (qNominal === '') {
            showToast('Kapasitas tidak boleh kosong', 'error');
            return;
        }
        
        if (!window.confirm("PERINGATAN: Ini akan mereset memori Auto-Discovery kurva baterai (NVS) pada ESP32. Lanjutkan?")) return;

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('config_baterai')
                .update({ 
                    q_nominal: Number(qNominal),
                    reset_nvs: true
                })
                .eq('id', 1);

            if (error) throw error;
            showToast('Perintah Reset BMS dan Kapasitas berhasil dikirim!', 'success');
        } catch (err: any) {
            console.error("Error updating config_baterai:", err);
            showToast('Gagal mengirim perintah', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-panel p-5 md:p-6 mb-8 relative overflow-hidden group border border-red-500/20">
            {/* Elegant Toast Notification */}
            {toast && (
                <div className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl z-20 animate-in slide-in-from-top-2 fade-in duration-300 ${toast.type === 'success' ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300' : 'bg-red-500/20 border border-red-500/50 text-red-300'}`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <Sliders className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-100">Remote Tuning & BMS Reset</h2>
                    <p className="text-sm text-slate-400 mt-1">Atur ulang Kapasitas Nominal (Ah) dan paksa ESP32 untuk mereset memori kurva parameter (NVS).</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end gap-6 relative z-10">
                {/* Input Q Nominal */}
                <div className="space-y-2 flex-1">
                    <label className="block text-sm font-medium text-slate-300">
                        Q Nominal (Kapasitas Ah)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.1"
                            value={qNominal}
                            onChange={(e) => setQNominal(e.target.value === '' ? '' : Number(e.target.value))}
                            disabled={isFetching || isLoading}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all disabled:opacity-50"
                            placeholder="Contoh: 27.0"
                        />
                    </div>
                </div>

                <div className="w-full md:w-auto">
                    <button
                        onClick={handleResetBMS}
                        disabled={isLoading || isFetching}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-xl shadow-lg shadow-red-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <AlertTriangle className="w-5 h-5" />
                        )}
                        Reset BMS Memory
                    </button>
                </div>
            </div>
        </div>
    );
};
