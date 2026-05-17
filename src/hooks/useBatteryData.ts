import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface BatteryData {
  tegangan: number;
  arus: number;
  soc_dekf: number;
  r0_estimasi: number;
  status: string;
  suhu: number | null;
  estimasiString: { jam: number; menit: number; standby: boolean; charging: boolean };
  soh: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  tegangan: number;
  arus: number;
  soc_dekf: number;
  r0_estimasi: number;
  status: string;
  alertLevel: 'NORMAL' | 'MAINTENANCE' | 'CRITICAL';
}

export interface ChartDataPoint {
  time: string;
  tegangan: number;
  soc_dekf: number;
}

const calculateEstimasi = (soc: number, arus: number, status: string) => {
  const s = status?.trim().toLowerCase();
  // Charging: arus negatif dari firmware — tampilkan label khusus, bukan jam
  if (s === 'charging') return { jam: 0, menit: 0, standby: false, charging: true };
  // Resting atau arus mendekati nol
  if (Math.abs(arus) < 0.05) return { jam: 0, menit: 0, standby: true, charging: false };
  // Discharging: hitung sisa waktu pakai nilai absolut arus
  const absArus = Math.abs(arus);
  const kapasitasTersisa = 42.0 * (soc / 100);
  const estimasiJam = kapasitasTersisa / absArus;
  const jam = Math.floor(estimasiJam);
  const menit = Math.floor((estimasiJam - jam) * 60);
  return { jam, menit, standby: false, charging: false };
};

const calculateSOH = (r0: number) => {
  if (!r0) return 100;
  const soh = ((0.050 - r0) / (0.050 - 0.015)) * 100;
  return Math.min(Math.max(Math.round(soh), 0), 100);
};

export const useBatteryData = () => {
  const [data, setData] = useState<BatteryData>({
    tegangan: 0,
    arus: 0,
    soc_dekf: 0,
    r0_estimasi: 0,
    status: '-',
    suhu: null,
    estimasiString: { jam: 0, menit: 0, standby: true, charging: false },
    soh: 100,
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  const [lastUpdateDate, setLastUpdateDate] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);

  const checkOnlineStatus = (latestDate: Date | null) => {
    if (!latestDate) {
       setIsOnline(false);
       return;
    }
    const now = new Date();
    const diffSeconds = (now.getTime() - latestDate.getTime()) / 1000;
    setIsOnline(diffSeconds < 60); // 60 seconds threshold for online status
  };

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
            tegangan: item.tegangan || 0,
            soc_dekf: Math.round(item.soc_dekf || 0) // Format to integer
          };
      });
      setChartData(newChartData);

      const newLogs: LogEntry[] = fetchResult.slice(0, 5).map((item: any) => ({
         id: item.id || item.created_at,
         timestamp: new Date(item.created_at).toLocaleTimeString([], { hour12: false }),
         tegangan: item.tegangan || 0,
         arus: item.arus || 0,
         soc_dekf: Math.round(item.soc_dekf || 0), // Format to integer
         r0_estimasi: item.r0_estimasi || 0,
         status: item.status || '-',
         alertLevel: (item.tegangan || 0) < 11.5 ? 'CRITICAL' : 'NORMAL'
      }));
      setLogs(newLogs);

      const latest = fetchResult[0];
      const arusVal = latest.arus || 0;
      const socVal = latest.soc_dekf || 0;
      const r0Val = latest.r0_estimasi || 0;
      // Prioritize soh from DB, fallback to local calculation
      const sohVal = (latest.soh !== null && latest.soh !== undefined)
        ? Math.min(Math.max(Math.round(latest.soh), 0), 100)
        : calculateSOH(r0Val);
      
      setData({
        tegangan: latest.tegangan || 0,
        arus: arusVal,
        soc_dekf: Math.round(socVal), // Format to integer
        r0_estimasi: r0Val,
        status: latest.status || '-',
        suhu: latest.suhu !== undefined && latest.suhu !== null ? latest.suhu : null,
        estimasiString: calculateEstimasi(socVal, arusVal, latest.status || '-'),
        soh: sohVal
      });

      const latestDate = new Date(latest.created_at);
      setLastUpdateDate(latestDate);
      checkOnlineStatus(latestDate);
    }
  };

  useEffect(() => {
    // Check status every second
    const statusInterval = setInterval(() => {
      setLastUpdateDate(prev => {
        checkOnlineStatus(prev);
        return prev;
      });
    }, 1000);

    return () => clearInterval(statusInterval);
  }, []);

  useEffect(() => {
    fetchLatestData();

    // Auto refresh data every 10 seconds as fallback
    const dataInterval = setInterval(() => {
      fetchLatestData();
    }, 10000);

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'log_baterai' },
        (payload: any) => {
          const newEntry = payload.new;
          const time = new Date(newEntry.created_at).toLocaleTimeString([], { hour12: false });
          
          const arusVal = newEntry.arus || 0;
          const socVal = newEntry.soc_dekf || 0;
          const r0Val = newEntry.r0_estimasi || 0;
          // Prioritize soh from DB, fallback to local calculation
          const sohVal = (newEntry.soh !== null && newEntry.soh !== undefined)
            ? Math.min(Math.max(Math.round(newEntry.soh), 0), 100)
            : calculateSOH(r0Val);

          setData({
            tegangan: newEntry.tegangan || 0,
            arus: arusVal,
            soc_dekf: Math.round(socVal), // Format to integer
            r0_estimasi: r0Val,
            status: newEntry.status || '-',
            suhu: newEntry.suhu !== undefined && newEntry.suhu !== null ? newEntry.suhu : null,
            estimasiString: calculateEstimasi(socVal, arusVal, newEntry.status || '-'),
            soh: sohVal
          });

          setChartData(prev => {
            const updated = [...prev, { time, tegangan: newEntry.tegangan || 0, soc_dekf: Math.round(socVal) }];
            if (updated.length > 20) return updated.slice(updated.length - 20);
            return updated;
          });

          setLogs(prev => {
            const newLog: LogEntry = {
               id: newEntry.id || newEntry.created_at,
               timestamp: time,
               tegangan: newEntry.tegangan || 0,
               arus: newEntry.arus || 0,
               soc_dekf: Math.round(socVal), // Format to integer
               r0_estimasi: newEntry.r0_estimasi || 0,
               status: newEntry.status || '-',
               alertLevel: (newEntry.tegangan || 0) < 11.5 ? 'CRITICAL' : 'NORMAL'
            };
            const updatedLogs = [newLog, ...prev];
            return updatedLogs.slice(0, 5);
          });

          const latestDate = new Date(newEntry.created_at);
          setLastUpdateDate(latestDate);
          checkOnlineStatus(latestDate);
        }
      )
      .subscribe();

    return () => {
      clearInterval(dataInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  return { data, logs, chartData, isOnline, lastUpdateDate };
};
