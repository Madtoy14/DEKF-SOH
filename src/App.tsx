import { Zap, ArrowDown, Hourglass, Thermometer, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatusBanner } from './components/StatusBanner';
import { MetricCard } from './components/MetricCard';
import { AlertPanel } from './components/AlertPanel';
import { RealtimeChart } from './components/RealtimeChart';
import { DataLogTable } from './components/DataLogTable';
import { useBatteryData } from './hooks/useBatteryData';
import { SettingsModal } from './components/SettingsModal';
import { supabase } from './lib/supabase';

function App() {
  const { data, logs, chartData, isOnline, lastUpdateDate } = useBatteryData();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [qNominal, setQNominal] = useState<number | null>(null);

  const fetchConfig = async () => {
    const { data: configData } = await supabase.from('config_baterai').select('q_nominal').eq('id', 1).single();
    if (configData) {
      setQNominal(configData.q_nominal);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
    fetchConfig();
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 selection:bg-cyan-500/30">
      <div className="max-w-[1400px] mx-auto space-y-8">
        <Header isOnline={isOnline} lastUpdateDate={lastUpdateDate} batteryStatus={data.status} />

        <StatusBanner tegangan={data.tegangan} />

        {/* Setting Kapasitas Card */}
        <div 
            onClick={() => setIsSettingsOpen(true)}
            className="glass-panel p-5 md:p-6 mb-8 flex items-center justify-between group hover:border-cyan-500/50 hover:bg-slate-800/40 transition-all cursor-pointer relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-4 md:gap-6 relative z-10">
                <div className="p-3 md:p-4 bg-slate-800/80 text-cyan-400 border border-cyan-500/30 rounded-xl md:rounded-2xl group-hover:bg-cyan-500/20 group-hover:text-cyan-300 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300">
                    <Settings className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      Kapasitas Baterai: {qNominal !== null ? <span className="text-cyan-400">{qNominal} Ah</span> : <span className="text-slate-500 animate-pulse">Memuat...</span>}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-400 mt-1">Sesuaikan nilai kapasitas nominal (Ah) baterai VRLA untuk kalkulasi SOH dan SOC yang lebih akurat.</p>
                </div>
            </div>
            <div className="hidden sm:flex relative z-10">
                <div className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg font-semibold text-sm group-hover:bg-cyan-500 group-hover:text-slate-900 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                    Ubah Kapasitas
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mb-8">
          <MetricCard
            id="tegangan-val"
            title="Tegangan Terminal"
            value={`${data.tegangan.toFixed(2)} V`}
            icon={<Zap className="w-6 h-6" />}
            label={data.tegangan < 11.5 ? { text: 'Tegangan Rendah', type: 'danger' } : undefined}
          />
          <MetricCard
            id="arus-val"
            title="Arus Beban"
            value={`${data.arus.toFixed(2)} A`}
            icon={<ArrowDown className="w-6 h-6" />}
          />
          <MetricCard
            id="estimasi-val"
            title="Estimasi Bertahan"
            value={
              data.estimasiString.charging ? (
                <div className="flex items-center gap-2">
                  <Zap className="w-8 h-8 text-emerald-400 animate-pulse" />
                  <span className="text-3xl sm:text-4xl font-black text-emerald-400">Charging</span>
                </div>
              ) : data.estimasiString.standby ? (
                "Standby"
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white">{data.estimasiString.jam}</span>
                  <span className="text-sm text-cyan-200/70 font-bold uppercase tracking-wider">Jam</span>
                  <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white ml-2">{data.estimasiString.menit}</span>
                  <span className="text-sm text-cyan-200/70 font-bold uppercase tracking-wider">Mnt</span>
                </div>
              )
            }
            icon={<Hourglass className="w-6 h-6" />}
          />
          <MetricCard
            id="soc-val"
            title="State of Charge (SOC)"
            progress={data.soc_dekf}
            progressColor={data.soc_dekf > 50 ? '#06b6d4' : data.soc_dekf > 20 ? '#f59e0b' : '#ef4444'} // cyan, amber, red
            subtext={data.soc_dekf > 50 ? 'Kondisi: Aman' : 'Kondisi: Siaga'}
          />
          <MetricCard
            id="soh-val"
            title="State of Health (SOH)"
            progress={data.soh}
            progressColor={data.soh > 80 ? '#10b981' : data.soh > 60 ? '#f59e0b' : '#ef4444'} // emerald, amber, red
            label={data.soh < 60 ? { text: 'Maintenance Required', type: 'warning' } : undefined}
            subtext={data.soh > 80 ? 'Kondisi: Optimal' : data.soh > 60 ? 'Kondisi: Wajar' : 'Kondisi: Perlu Penggantian'}
          />
          <MetricCard
            id="suhu-val"
            title="Suhu Baterai"
            value={data.suhu !== null && data.suhu !== undefined ? `${data.suhu.toFixed(1)} °C` : '-- °C'}
            icon={<Thermometer className="w-6 h-6" />}
          />
        </div>

        <AlertPanel tegangan={data.tegangan} soc={data.soc_dekf} soh={data.soh} />

        <RealtimeChart data={chartData} />

        <DataLogTable logs={logs} />
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={handleCloseSettings} />
    </div>
  );
}

export default App;
