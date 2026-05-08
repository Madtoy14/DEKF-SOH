import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { ChartDataPoint } from '../hooks/useBatteryData';

interface RealtimeChartProps {
    data: ChartDataPoint[];
}

export const RealtimeChart = ({ data }: RealtimeChartProps) => {
    const options: ApexOptions = {
        chart: {
            type: 'area',
            animations: {
                enabled: true,
                dynamicAnimation: { speed: 1000 }
            },
            toolbar: { show: false },
            zoom: { enabled: false },
            background: 'transparent',
            dropShadow: {
                enabled: true,
                top: 0,
                left: 0,
                blur: 10,
                color: '#000000',
                opacity: 0.2
            }
        },
        colors: ['#06b6d4', '#10b981'], // Neon Cyan and Emerald
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.0,
                stops: [0, 90, 100]
            }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        grid: {
            borderColor: 'rgba(255,255,255,0.03)',
            strokeDashArray: 0,
            xaxis: {
                lines: { show: false }
            },
            yaxis: {
                lines: { show: true }
            }
        },
        dataLabels: { enabled: false },
        theme: { mode: 'dark' },
        xaxis: {
            categories: data.map(d => d.time),
            labels: {
                style: { colors: '#94a3b8' },
                rotate: -45,
                hideOverlappingLabels: true,
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: [
            {
                title: { text: 'Tegangan (V)', style: { color: '#06b6d4', fontWeight: 600 } },
                min: 10,
                max: 15,
                labels: { style: { colors: '#94a3b8' }, formatter: (v) => v.toFixed(1) }
            },
            {
                opposite: true,
                title: { text: 'SOC (%)', style: { color: '#10b981', fontWeight: 600 } },
                min: 0,
                max: 100,
                labels: { style: { colors: '#94a3b8' } }
            }
        ],
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            labels: { colors: '#f8fafc', useSeriesColors: false },
            fontWeight: 600
        },
        tooltip: {
            theme: 'dark',
            y: { formatter: (val) => val.toFixed(2) }
        }
    };

    const series = [
        {
            name: 'Tegangan',
            data: data.map(d => d.tegangan)
        },
        {
            name: 'SOC',
            data: data.map(d => d.soc_dekf)
        }
    ];

    return (
        <div className="glass-panel p-6 md:p-8 mb-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white tracking-wide">
                Tren Real-time: Tegangan vs SOC 
                <span className="block sm:inline-block text-cyan-400 text-xs sm:text-sm font-medium sm:ml-2 uppercase tracking-widest mt-1 sm:mt-0">(1 Jam Terakhir)</span>
            </h2>
            <div className="h-[350px]">
                <Chart options={options} series={series} type="area" height="100%" />
            </div>
        </div>
    );
};
