import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Sliders, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export const RemoteTuningCard = () => {
    const [qNominal, setQNominal] = useState<number | ''>('');
    const [sohKnown, setSohKnown] = useState<number>(1.0);
    const [eolMultiplier, setEolMultiplier] = useState<number | ''>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const fetchData = async () => {
        setIsFetching(true);
        try {
            const { data, error } = await supabase
                .from('config_baterai')
                .select('q_nominal, soh_known, eol_multiplier')
                .eq('id', 1)
                .single();

            if (error) throw error;
            if (data) {
                setQNominal(data.q_nominal);
                setSohKnown(data.soh_known ?? 1.0);
                setEolMultiplier(data.eol_multiplier);
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

    const handleSave = async () => {
        if (qNominal === '' || eolMultiplier === '') {
            showToast('Semua kolom harus diisi', 'error');
            return;
        }
        
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('config_baterai')
                .update({ 
                    q_nominal: Number(qNominal),
                    soh_known: Number(sohKnown),
                    eol_multiplier: Number(eolMultiplier)
                })
                .eq('id', 1);

            if (error) throw error;
            showToast('Konfigurasi berhasil disinkronisasi dan disimpan ke Cloud!', 'success');
        } catch (err: any) {
            console.error("Error updating config_baterai:", err);
            showToast('Gagal menyimpan konfigurasi', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-panel p-5 md:p-6 mb-8 relative overflow-hidden group">
            {/* Elegant Toast Notification */}
            {toast && (
                <div className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl z-20 animate-in slide-in-from-top-2 fade-in duration-300 ${toast.type === 'success' ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300' : 'bg-red-500/20 border border-red-500/50 text-red-300'}`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="p-3 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <Sliders className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-100">Remote Tuning - VRLA Parameters</h2>
                    <p className="text-sm text-slate-400 mt-1">Konfigurasi parameter matematis DEKF secara real-time ke Cloud.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {/* Input Q Nominal */}
                <div className="space-y-2">
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
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50"
                            placeholder="Contoh: 27.0"
                        />
                    </div>
                </div>

                {/* Input SOH Known */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-slate-300">
                            SOH_Known (Kesehatan Awal)
                        </label>
                        <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-md text-sm border border-indigo-500/20">
                            {Math.round(sohKnown * 100)}%
                        </span>
                    </div>
                    <div className="relative pt-2">
                        <input
                            type="range"
                            min="0.00"
                            max="1.00"
                            step="0.01"
                            value={sohKnown}
                            onChange={(e) => setSohKnown(Number(e.target.value))}
                            disabled={isFetching || isLoading}
                            className="w-full accent-indigo-500 disabled:opacity-50 cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>0% (Rusak)</span>
                            <span>100% (Baru)</span>
                        </div>
                    </div>
                </div>

                {/* Input EOL Multiplier */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">
                        EOL_Multiplier (Batas Mati)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            min="1.5"
                            max="3.0"
                            step="0.1"
                            value={eolMultiplier}
                            onChange={(e) => setEolMultiplier(e.target.value === '' ? '' : Number(e.target.value))}
                            disabled={isFetching || isLoading}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50"
                            placeholder="Rentang Aman: 1.5 - 3.0"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end relative z-10">
                <button
                    onClick={handleSave}
                    disabled={isLoading || isFetching}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-400 hover:to-emerald-400 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    Sync & Save to Cloud
                </button>
            </div>
        </div>
    );
};
