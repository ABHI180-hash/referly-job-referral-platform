import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { FileSpreadsheet, Download, Calendar, Filter } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { addToast } = useApp();
  const [dateRange, setDateRange] = useState('30d');

  const reportRows = [
    { metric: 'New Candidate Signups', volume: '1,420', change: '+18.4%', trend: 'Upward' },
    { metric: 'Referral Endorsements Submitted', volume: '3,410', change: '+16.2%', trend: 'Upward' },
    { metric: 'Interviews Scheduled via Referrals', volume: '920', change: '+22.0%', trend: 'Upward' },
    { metric: 'Offers Accepted', volume: '480', change: '+11.5%', trend: 'Stable' },
    { metric: 'Pro Tier Conversions', volume: '390', change: '+14.1%', trend: 'Upward' },
  ];

  const handleExportCSV = () => {
    const headers = 'Metric,Volume,Change,Trend\n';
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers +
      reportRows.map((r) => `"${r.metric}","${r.volume}","${r.change}","${r.trend}"`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `referly_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Report CSV exported successfully!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageMeta
        title="Admin Export Reports"
        description="Download platform performance, conversion rate metrics, and candidate reports."
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Platform Analytics Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregate key performance indicators and export reports for executive reviews.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-700"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter (90d)</option>
            <option value="ytd">Year to Date</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
            <tr>
              <th className="py-3.5 px-5">Performance Metric</th>
              <th className="py-3.5 px-5">Aggregate Volume</th>
              <th className="py-3.5 px-5">Period Change</th>
              <th className="py-3.5 px-5 text-right">Trajectory</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reportRows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5 font-bold text-slate-900">{row.metric}</td>
                <td className="py-3.5 px-5 font-semibold text-slate-800">{row.volume}</td>
                <td className="py-3.5 px-5 text-emerald-600 font-medium">{row.change}</td>
                <td className="py-3.5 px-5 text-right text-slate-600">{row.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
