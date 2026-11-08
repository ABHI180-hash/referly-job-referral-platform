import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe2,
  Plus,
  Trash2,
  Play,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Star,
  Activity,
  Calendar,
  Lock,
} from 'lucide-react';
import { useLaunchPilot } from '../../context/LaunchPilotContext';
import { PageMeta } from '../../components/common/PageMeta';
import { AddWebsiteModal } from '../../components/launchpilot/AddWebsiteModal';
import { IWebsite } from '../../types/launchpilot';

export const MyWebsitesPage: React.FC = () => {
  const {
    websites,
    activeWebsite,
    setActiveWebsite,
    triggerScan,
    deleteWebsite,
    updateWebsite,
    isScanning,
  } = useLaunchPilot();

  const navigate = useNavigate();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const filtered = websites.filter(
    (w) =>
      w.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      w.domain.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleRunScan = async (site: IWebsite) => {
    setActiveWebsite(site);
    await triggerScan(site.url, site._id);
    navigate('/launchpilot');
  };

  return (
    <div className="space-y-6">
      <PageMeta
        title="My Websites | LaunchPilot"
        description="Manage your fleet of web applications, monitor launch readiness across environments, and run multi-site scans."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              FLEET REGISTRY
            </span>
            <span className="text-xs font-mono text-slate-400">
              Total Targets: <strong className="text-white">{websites.length}</strong>
            </span>
          </div>
          <h1 className="text-2xl font-black text-white font-heading tracking-tight mt-1">
            Tracked Target Websites
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor launch telemetry across production, staging, and preview deployments.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 self-start flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register Website</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs">
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filter websites by name or domain..."
          className="w-full sm:w-80 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400"
        />

        <span className="text-slate-400 text-[11px] hidden sm:inline">
          Showing {filtered.length} of {websites.length} domains
        </span>
      </div>

      {/* Websites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((site) => {
          const isGo = site.launchStatus === 'GO';
          const isNoGo = site.launchStatus === 'NO-GO';
          const isActive = activeWebsite?._id === site._id;

          return (
            <div
              key={site._id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-b from-[#0F1626] to-[#0A0E18] border-cyan-500/50 shadow-xl shadow-cyan-500/10'
                  : 'bg-[#0B0F19]/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header: Star, Title, Environment */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300 font-semibold">
                      {site.environment}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {site.category}
                    </span>
                  </div>

                  <button
                    onClick={() => updateWebsite(site._id, { isStarred: !site.isStarred })}
                    className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                      site.isStarred ? 'text-amber-400' : 'text-slate-600'
                    }`}
                    title="Star favorite"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-heading truncate">
                    {site.name}
                  </h3>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span className="truncate">{site.domain}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>

              {/* Middle Metrics: Readiness Gauge Bar & Launch Decision */}
              <div className="my-5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Launch Readiness:</span>
                  <span
                    className={`font-black text-sm ${
                      isGo ? 'text-emerald-400' : isNoGo ? 'text-rose-400' : 'text-amber-400'
                    }`}
                  >
                    {site.readinessScore}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isGo
                        ? 'bg-emerald-500'
                        : isNoGo
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${site.readinessScore}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                  <span>DECISION: <strong className={isGo ? 'text-emerald-400' : isNoGo ? 'text-rose-400' : 'text-amber-400'}>{site.launchStatus}</strong></span>
                  <span>Scans: {site.totalScans}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setActiveWebsite(site);
                    navigate('/launchpilot');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-semibold transition-colors"
                >
                  View Pad
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleRunScan(site)}
                    disabled={isScanning}
                    className="p-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 transition-colors"
                    title="Run quick scan"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Remove "${site.name}" from LaunchPilot registry?`)) {
                        deleteWebsite(site._id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete website"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddWebsiteModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
};
