import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, Save, Battery } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
    const [qNominal, setQNominal] = useState<number | ''>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            setIsFetching(true);
            setError(null);
            try {
                const { data, error } = await supabase
                    .from('config_baterai')
                    .select('q_nominal')
                    .eq('id', 1)
                    .single();

                if (error) throw error;
                if (data) setQNominal(data.q_nominal);
            } catch (err: any) {
                console.error("Error fetching config_baterai:", err);
                setError(err.message || 'Gagal mengambil data kapasitas baterai.');
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [isOpen]);

    const handleSave = async () => {
        if (qNominal === '') return;
        setIsLoading(true);
        setError(null);
        try {
            const { error } = await supabase
                .from('config_baterai')
                .update({ q_nominal: Number(qNominal) })
                .eq('id', 1);

            if (error) throw error;
            onClose(); // Tutup modal setelah berhasil
        } catch (err: any) {
            console.error("Error updating config_baterai:", err);
            setError(err.message || 'Gagal menyimpan data.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-800/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                            <Battery className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-100">Setting Kapasitas</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label htmlFor="q_nominal" className="block text-sm font-medium text-slate-300">
                            Kapasitas Baterai (Ah)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                id="q_nominal"
                                step="0.1"
                                value={qNominal}
                                onChange={(e) => setQNominal(e.target.value === '' ? '' : Number(e.target.value))}
                                disabled={isFetching || isLoading}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all disabled:opacity-50"
                                placeholder="Contoh: 27.0"
                            />
                            {isFetching && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-slate-500">
                            Masukkan nilai kapasitas nominal baterai VRLA.
                        </p>
                    </div>
                </div>

                <div className="p-5 border-t border-slate-800/80 bg-slate-800/20 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading || isFetching || qNominal === ''}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 rounded-lg shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
};
