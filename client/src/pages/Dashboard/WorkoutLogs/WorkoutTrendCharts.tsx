import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { WorkoutLog } from '../../../services/workout-logs';

type Props = {
    workoutLogs: WorkoutLog[];
};

type DaySummary = {
    date: string; // ISO date label e.g. "20 Apr"
    totalVolume: number;
    maxOneRepMax: number;
};

function aggregateByDay(logs: WorkoutLog[]): DaySummary[] {
    const map = new Map<string, { totalVolume: number; maxOneRepMax: number }>();

    for (const log of logs) {
        const isoDate = new Date(log.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
        });
        const existing = map.get(isoDate) ?? { totalVolume: 0, maxOneRepMax: 0 };
        map.set(isoDate, {
            totalVolume: existing.totalVolume + log.volume,
            maxOneRepMax: Math.max(existing.maxOneRepMax, log.oneRepMax),
        });
    }

    // Sort ascending by first occurrence date
    const sorted = Array.from(map.entries()).sort((a, b) => {
        const aTime = logs.find(
            l => new Date(l.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) === a[0]
        )?.created_at ?? '';
        const bTime = logs.find(
            l => new Date(l.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) === b[0]
        )?.created_at ?? '';
        return new Date(aTime).getTime() - new Date(bTime).getTime();
    });

    return sorted.map(([date, summary]) => ({ date, ...summary }));
}

const BASE_OPTIONS: ApexOptions = {
    chart: {
        fontFamily: 'Outfit, sans-serif',
        type: 'line',
        toolbar: { show: false },
        zoom: { enabled: false },
    },
    stroke: {
        curve: 'smooth',
        width: 2,
    },
    markers: {
        size: 3,
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: { size: 5 },
    },
    grid: {
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    xaxis: {
        type: 'category',
        axisBorder: { show: false },
        axisTicks: { show: false },
    },
    yaxis: {
        labels: {
            style: { fontSize: '12px', colors: ['#6B7280'] },
        },
    },
    tooltip: { enabled: true },
    legend: { show: false },
};

export default function WorkoutTrendCharts({ workoutLogs }: Props) {
    if (workoutLogs.length < 2) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-1">Workout Trends</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Log workouts on at least 2 different days to see trend charts.
                </p>
            </div>
        );
    }

    const days = aggregateByDay(workoutLogs);
    const categories = days.map(d => d.date);

    const volumeOptions: ApexOptions = {
        ...BASE_OPTIONS,
        colors: ['#465FFF'],
        xaxis: { ...BASE_OPTIONS.xaxis, categories },
        yaxis: {
            ...BASE_OPTIONS.yaxis,
            labels: {
                style: { fontSize: '12px', colors: ['#6B7280'] },
                formatter: (v: number) => `${Math.round(v)} kg`,
            },
        },
        tooltip: {
            y: { formatter: (v: number) => `${Math.round(v)} kg` },
        },
    };

    const oneRmOptions: ApexOptions = {
        ...BASE_OPTIONS,
        colors: ['#F05252'],
        xaxis: { ...BASE_OPTIONS.xaxis, categories },
        yaxis: {
            ...BASE_OPTIONS.yaxis,
            labels: {
                style: { fontSize: '12px', colors: ['#6B7280'] },
                formatter: (v: number) => `${Math.round(v)} kg`,
            },
        },
        tooltip: {
            y: { formatter: (v: number) => `${Math.round(v)} kg` },
        },
    };

    return (
        <div className="col-span-12 grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
            {/* Volume trend */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                    Volume Trend
                </h3>
                <p className="mb-3 text-xs text-gray-400 dark:text-gray-500">
                    Total volume (sets × reps × weight) per training day
                </p>
                <Chart
                    options={volumeOptions}
                    series={[{ name: 'Volume', data: days.map(d => d.totalVolume) }]}
                    type="line"
                    height={220}
                />
            </div>

            {/* 1RM trend */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                    1RM Trend
                </h3>
                <p className="mb-3 text-xs text-gray-400 dark:text-gray-500">
                    Highest estimated 1-rep max across all exercises per day
                </p>
                <Chart
                    options={oneRmOptions}
                    series={[{ name: '1RM', data: days.map(d => d.maxOneRepMax) }]}
                    type="line"
                    height={220}
                />
            </div>
        </div>
    );
}
