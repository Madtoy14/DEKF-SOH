import { useState, useEffect } from 'react';

// @ts-ignore
const supabaseUrl = 'https://cyaitxilxvvjvreaqain.supabase.co';
const supabaseKey = 'sb_publishable_ETjdBVJ7xsSMhLjyK14hgw_zlzneyVF';
// @ts-ignore
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

export interface BatteryData {
  voltage: number;
  current: number;
  soc: number;
  r0_estimasi: number;
  status: string;
  suhu: number | null;
  estimasiString: string;
  soh: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  voltage: number;
  current: number;
  soc: number;
  r0_estimasi: number;
  status: string;
  alertLevel: 'NORMAL' | 'MAINTENANCE' | 'CRITICAL';
}

export interface ChartDataPoint {
  time: string;
  voltage: number;
  soc: number;
}

const calculateEstimasi = (soc: number, arus: number) => {
  if (arus <= 0) return "Standby";
  const kapasitasTersisa = 42.0 * (soc / 100);
  const estimasiJam = kapasitasTersisa / arus;
  const jam = Math.floor(estimasiJam);
  const menit = Math.floor((estimasiJam - jam) * 60);
  return `${jam} Jam ${menit} Menit`;
};

const calculateSOH = (r0: number) => {
  if (!r0) return 100;
  const soh = ((0.050 - r0) / (0.050 - 0.015)) * 100;
  return Math.min(Math.max(Math.round(soh), 0), 100);
};

export const useBatteryData = () => {
  const [data, setData] = useState<BatteryData>({
    voltage: 0,
    current: 0,
    soc: 0,
    r0_estimasi: 0,
    status: '-',
    suhu: null,
    estimasiString: 'Standby',
    soh: 100,
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  const fetchLatestData = async () => {
    const { data: fetchResult, error } = await supabase
      .from('log_baterai')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    if (fetchResult && fetchResult.length > 0) {
      const reversedData = [...fetchResult].reverse();
      
      const newChartData = reversedData.map((item: any) => {
          const time = new Date(item.created_at).toLocaleTimeString([], { hour12: false });
          return {
            time,
            voltage: item.tegangan || 0,
            soc: item.soc_dekf || 0
          };
      });
      setChartData(newChartData);

      const newLogs = fetchResult.slice(0, 5).map((item: any) => ({
         id: item.id || item.created_at,
         timestamp: new Date(item.created_at).toLocaleTimeString([], { hour12: false }),
         voltage: item.tegangan || 0,
         current: item.arus || 0,
         soc: item.soc_dekf || 0,
         r0_estimasi: item.r0_estimasi || 0,
         status: item.status || '-',
         alertLevel: (item.tegangan || 0) < 11.5 ? 'CRITICAL' : 'NORMAL'
      }));
      setLogs(newLogs);

      const latest = fetchResult[0];
      const arus = latest.arus || 0;
      const soc = latest.soc_dekf || 0;
      const r0 = latest.r0_estimasi || 0;
      
      setData({
        voltage: latest.tegangan || 0,
        current: arus,
        soc: soc,
        r0_estimasi: r0,
        status: latest.status || '-',
        suhu: latest.suhu !== undefined && latest.suhu !== null ? latest.suhu : null,
        estimasiString: calculateEstimasi(soc, arus),
        soh: calculateSOH(r0)
      });
    }
  };

  useEffect(() => {
    fetchLatestData();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'log_baterai' },
        (payload: any) => {
          const newEntry = payload.new;
          const time = new Date(newEntry.created_at).toLocaleTimeString([], { hour12: false });
          
          const arus = newEntry.arus || 0;
          const soc = newEntry.soc_dekf || 0;
          const r0 = newEntry.r0_estimasi || 0;

          setData({
            voltage: newEntry.tegangan || 0,
            current: arus,
            soc: soc,
            r0_estimasi: r0,
            status: newEntry.status || '-',
            suhu: newEntry.suhu !== undefined && newEntry.suhu !== null ? newEntry.suhu : null,
            estimasiString: calculateEstimasi(soc, arus),
            soh: calculateSOH(r0)
          });

          setChartData(prev => {
            const updated = [...prev, { time, voltage: newEntry.tegangan || 0, soc: newEntry.soc_dekf || 0 }];
            if (updated.length > 20) return updated.slice(updated.length - 20);
            return updated;
          });

          setLogs(prev => {
            const newLog: LogEntry = {
               id: newEntry.id || newEntry.created_at,
               timestamp: time,
               voltage: newEntry.tegangan || 0,
               current: newEntry.arus || 0,
               soc: newEntry.soc_dekf || 0,
               r0_estimasi: newEntry.r0_estimasi || 0,
               status: newEntry.status || '-',
               alertLevel: (newEntry.tegangan || 0) < 11.5 ? 'CRITICAL' : 'NORMAL'
            };
            const updatedLogs = [newLog, ...prev];
            return updatedLogs.slice(0, 5);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { data, logs, chartData };
};
