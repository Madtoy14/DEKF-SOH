import { Zap, ArrowDown, Hourglass, Thermometer } from 'lucide-react';
import { Header } from './components/Header';
import { StatusBanner } from './components/StatusBanner';
import { MetricCard } from './components/MetricCard';
import { AlertPanel } from './components/AlertPanel';
import { RealtimeChart } from './components/RealtimeChart';
import { DataLogTable } from './components/DataLogTable';
import { useBatteryData } from './hooks/useBatteryData';

function App() {
  const { data, logs, chartData, isOnline, lastUpdateDate } = useBatteryData();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 selection:bg-cyan-500/30">
      <div className="max-w-[1400px] mx-auto space-y-8">
        <Header isOnline={isOnline} lastUpdateDate={lastUpdateDate} />

        <StatusBanner tegangan={data.tegangan} />

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
              data.estimasiString.standby ? (
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
    </div>
  );
}

export default App;
