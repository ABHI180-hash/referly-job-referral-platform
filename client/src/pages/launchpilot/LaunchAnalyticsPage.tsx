import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Search,
} from 'lucide-react';
import { useLaunchPilot } from '../../context/LaunchPilotContext';
import { PageMeta } from '../../components/common/PageMeta';
import { launchPilotApi } from '../../services/launchPilotApi';

export const LaunchAnalyticsPage: React.FC = () => {
  const { activeWebsite, websites } = useLaunchPilot();

  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await launchPilotApi.getAnalytics(activeWebsite?._id);
        setAnalyticsData(data);
      } catch (err) {
        console.warn('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [activeWebsite]);

  const overview = analyticsData?.overview || {
    totalWebsites: websites.length,
    avgReadiness: 82,
    goCount: 2,
    noGoCount: 1,
    conditionalCount: 1,
  };

  const categoryMetrics = analyticsData?.categoryMetrics || [
    { category: 'PERFORMANCE', score: 92, passRate: 85 },
    { category: 'SECURITY', score: 88, passRate: 80 },
    { category: 'SEO', score: 85, passRate: 75 },
    { category: 'COMPLIANCE', score: 90, passRate: 90 },
    { category: 'INTEGRATIONS', score: 70, passRate: 65 },
    { category: 'CONTENT', score: 95, passRate: 100 },
  ];

  const timelineTrends = analyticsData?.timelineTrends?.length > 0
    ? analyticsData.timelineTrends
    : [
        { date: 'Scan 1', readinessScore: 62, durationMs: 420, passed: 9, failed: 4, warnings: 2 },
        { date: 'Scan 2', readinessScore: 71, durationMs: 380, passed: 11, failed: 2, warnings: 2 },
        { date: 'Scan 3', readinessScore: 84, durationMs: 310, passed: 13, failed: 1, warnings: 1 },
        { date: 'Scan 4', readinessScore: 92, durationMs: 240, passed: 14, failed: 0, warnings: 1 },
      ];

  const pieData = [
    { name: 'Passed', value: analyticsData?.latestScanSummary?.passedCount || 12, color: '#00FF9D' },
    { name: 'Warnings', value: analyticsData?.latestScanSummary?.warningCount || 2, color: '#FFB800' },
    { name: 'Failed', value: analyticsData?.latestScanSummary?.failedCount || 1, color: '#FF3366' },
  ];

  return (
    <div className="space-y-6">
      <PageMeta
        title="Launch Analytics & Telemetry | LaunchPilot"
        description="Comprehensive analytics dashboard displaying launch readiness score, passed vs failed distribution, and latency trends over time."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              TELEMETRY INTELLIGENCE
            </span>
            <span className="text-xs font-mono text-slate-400">
              Active Focus: <strong className="text-white">{activeWebsite?.domain || 'All Fleet'}</strong>
            </span>
          </div>
          <h1 className="text-2xl font-black text-white font-heading tracking-tight mt-1">
            Launch Readiness Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Historical diagnostic trends, velocity metrics, and gate compliance across your web fleet.
          </p>
        </div>
      </div>

      {/* Top 4 Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-lg space-y-2 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>FLEET AVG READINESS</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white font-heading">
            {overview.avgReadiness}%
          </div>
          <span className="text-[11px] text-emerald-400">
            ▲ +14% improvement over last 5 scans
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-lg space-y-2 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>GO LAUNCH CLEARED</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-heading">
            {overview.goCount} / {overview.totalWebsites}
          </div>
          <span className="text-[11px] text-slate-400">
            Websites ready for public launch
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-lg space-y-2 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>NO-GO RESTRICTIONS</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-rose-400 font-heading">
            {overview.noGoCount}
          </div>
          <span className="text-[11px] text-rose-400">
            Mandatory gates pending remediation
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-lg space-y-2 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>AVERAGE TTFB LATENCY</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-cyan-300 font-heading">
            {activeWebsite?.responseTimeMs || 240}ms
          </div>
          <span className="text-[11px] text-emerald-400">
            ✓ Under 3,000ms SLA target
          </span>
        </div>
      </div>

      {/* Middle Row: Historical Readiness Velocity & Passed/Failed Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Historical Readiness Score Trend Line (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs">
            <div>
              <span className="text-[10px] uppercase text-cyan-400 font-bold tracking-widest block">
                CHRONOLOGICAL PROGRESSION
              </span>
              <h3 className="text-base font-bold text-white font-heading">
                Readiness Score Velocity (0–100%)
              </h3>
            </div>
            <span className="text-slate-400">Target Threshold: 75%</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineTrends}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} stroke="#64748B" tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090D18', borderColor: '#334155', borderRadius: 8, fontSize: 12, color: '#fff' }}
                />
                <Area type="monotone" dataKey="readinessScore" name="Readiness Score" stroke="#00E5FF" strokeWidth={3} fillOpacity={1} fill="url(#scoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Passed vs Failed vs Warnings Pie (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-800 font-mono text-xs">
            <span className="text-[10px] uppercase text-cyan-400 font-bold tracking-widest block">
              GATE INTEGRITY
            </span>
            <h3 className="text-base font-bold text-white font-heading">
              15-Check Distribution
            </h3>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#090D18', borderColor: '#334155', borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-slate-800">
            <div className="p-2 rounded bg-slate-900/60">
              <span className="text-[10px] text-slate-500 block">PASSED</span>
              <span className="text-emerald-400 font-bold">{pieData[0].value}</span>
            </div>
            <div className="p-2 rounded bg-slate-900/60">
              <span className="text-[10px] text-slate-500 block">WARNINGS</span>
              <span className="text-amber-400 font-bold">{pieData[1].value}</span>
            </div>
            <div className="p-2 rounded bg-slate-900/60">
              <span className="text-[10px] text-slate-500 block">FAILED</span>
              <span className="text-rose-400 font-bold">{pieData[2].value}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Category Readiness Breakdown (Security, SEO, Performance, etc.) */}
      <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs">
          <div>
            <span className="text-[10px] uppercase text-cyan-400 font-bold tracking-widest block">
              PILLAR DISSECTION
            </span>
            <h3 className="text-base font-bold text-white font-heading">
              Launch Category Performance (%)
            </h3>
          </div>
          <span className="text-slate-400">Pillar Target: 80%+</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="category" stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis domain={[0, 100]} stroke="#64748B" tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#090D18', borderColor: '#334155', borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="score" name="Category Score %" fill="#00FF9D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
