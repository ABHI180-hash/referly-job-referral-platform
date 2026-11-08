import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { IWebsite, IScanResult, ICheckItem, ILaunchNotification } from '../types/launchpilot';
import { launchPilotApi } from '../services/launchPilotApi';

interface LaunchPilotContextType {
  websites: IWebsite[];
  activeWebsite: IWebsite | null;
  setActiveWebsite: (website: IWebsite) => void;
  currentScan: IScanResult | null;
  scanHistory: IScanResult[];
  isScanning: boolean;
  scanProgress: number;
  currentScanningCheck: string;
  triggerScan: (targetUrl?: string, websiteId?: string) => Promise<void>;
  manualVerifyCheck: (checkId: number, note: string, status?: 'passed' | 'warning') => Promise<void>;
  addWebsite: (payload: { name: string; url: string; category?: string; environment?: string }) => Promise<IWebsite>;
  updateWebsite: (id: string, payload: Partial<IWebsite>) => Promise<void>;
  deleteWebsite: (id: string) => Promise<void>;
  isLaunchArmed: boolean;
  isLaunching: boolean;
  hasLaunched: boolean;
  launchRocket: () => void;
  resetLaunch: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  notifications: ILaunchNotification[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  refreshData: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const LaunchPilotContext = createContext<LaunchPilotContextType | undefined>(undefined);

// Web Audio API Synth Sound Generator for futuristic telemetry
const playTelemetryTone = (type: 'beep' | 'ignition' | 'success' | 'alert', enabled: boolean) => {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'alert') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'success') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.3); // C6
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'ignition') {
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.2);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    }
  } catch {
    // Ignore audio context errors silently
  }
};

export const LaunchPilotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [websites, setWebsites] = useState<IWebsite[]>([]);
  const [activeWebsite, setActiveWebsite] = useState<IWebsite | null>(null);
  const [currentScan, setCurrentScan] = useState<IScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<IScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanningCheck, setCurrentScanningCheck] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState<ILaunchNotification[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load initial fleet data
  const refreshData = useCallback(async () => {
    try {
      const sites = await launchPilotApi.getWebsites();
      setWebsites(sites);

      let targetSite = activeWebsite;
      if (!targetSite && sites.length > 0) {
        targetSite = sites.find((s) => s.isStarred) || sites[0];
        setActiveWebsite(targetSite);
      }

      if (targetSite) {
        const latest = await launchPilotApi.getLatestScan(targetSite._id);
        setCurrentScan(latest);
        const history = await launchPilotApi.getScanHistory(targetSite._id);
        setScanHistory(history);
      }

      const notifs = await launchPilotApi.getNotifications();
      setNotifications(notifs);
    } catch (err: any) {
      console.warn('[LaunchPilot] Telemetry sync error:', err.message);
    }
  }, [activeWebsite]);

  useEffect(() => {
    refreshData();
  }, []);

  // When active website changes, fetch its latest scan
  const handleSelectWebsite = async (website: IWebsite) => {
    setActiveWebsite(website);
    setHasLaunched(false);
    setIsLaunching(false);
    try {
      const latest = await launchPilotApi.getLatestScan(website._id);
      setCurrentScan(latest);
      const history = await launchPilotApi.getScanHistory(website._id);
      setScanHistory(history);
    } catch {
      // Ignored
    }
  };

  // Run Scan with Simulated Real-Time Progress Steps
  const triggerScan = async (targetUrl?: string, websiteId?: string) => {
    const urlToScan = targetUrl || activeWebsite?.url;
    const siteId = websiteId || activeWebsite?._id;

    if (!urlToScan) {
      setError('Please provide a valid website URL to scan.');
      return;
    }

    setIsScanning(true);
    setScanProgress(5);
    setCurrentScanningCheck('Initiating secure sandbox & DNS resolution...');
    playTelemetryTone('beep', soundEnabled);

    const checkNames = [
      'DNS & Server Availability',
      'Mobile Viewport Configuration',
      'Internal & External Link Crawl',
      'Contact Form & Lead Capture',
      'Page Speed & TTFB Latency',
      'Image Optimization & Alt Labels',
      'TLS / SSL Certificate Validity',
      'HTML5 Standards & Browser Compat',
      'Spelling & Placeholder Checks',
      'WhatsApp Click-to-Chat Triggers',
      'Corporate Domain Email (MX)',
      'Google Analytics 4 / GTM Scripts',
      'Google Indexing & Meta Robots',
      'OpenGraph & Social Preview Tags',
      'Backup & Host Protection Posture',
      'Payment Gateway Integration SDK',
    ];

    let progressStep = 5;
    const interval = setInterval(() => {
      progressStep = Math.min(progressStep + 6, 92);
      const index = Math.min(Math.floor((progressStep / 92) * checkNames.length), checkNames.length - 1);
      setScanProgress(progressStep);
      setCurrentScanningCheck(checkNames[index]);
      if (progressStep % 18 === 0) {
        playTelemetryTone('beep', soundEnabled);
      }
    }, 180);

    try {
      const response = await launchPilotApi.triggerScan({
        url: urlToScan,
        websiteId: siteId,
      });

      clearInterval(interval);
      setScanProgress(100);
      setCurrentScanningCheck('Scan complete. Launch telemetry synchronized.');

      setCurrentScan(response.scanResult);
      setActiveWebsite(response.website);

      // Update websites list
      setWebsites((prev) =>
        prev.map((w) => (w._id === response.website._id ? response.website : w))
      );

      // Refresh history & notifications
      const history = await launchPilotApi.getScanHistory(response.website._id);
      setScanHistory(history);
      const notifs = await launchPilotApi.getNotifications();
      setNotifications(notifs);

      if (response.scanResult.launchStatus === 'GO') {
        playTelemetryTone('success', soundEnabled);
      } else {
        playTelemetryTone('alert', soundEnabled);
      }
    } catch (err: any) {
      clearInterval(interval);
      setError(err.response?.data?.message || err.message || 'Failed to complete scan.');
      playTelemetryTone('alert', soundEnabled);
    } finally {
      setTimeout(() => {
        setIsScanning(false);
        setScanProgress(0);
        setCurrentScanningCheck('');
      }, 700);
    }
  };

  // Manual Check Verification
  const manualVerifyCheck = async (checkId: number, note: string, status: 'passed' | 'warning' = 'passed') => {
    if (!currentScan) return;
    try {
      const updatedScan = await launchPilotApi.manualVerifyCheck(currentScan._id, checkId, note, status);
      setCurrentScan(updatedScan);
      playTelemetryTone('success', soundEnabled);

      // Update active website
      if (activeWebsite) {
        const updatedSite = {
          ...activeWebsite,
          readinessScore: updatedScan.readinessScore,
          launchStatus: updatedScan.launchStatus,
        };
        setActiveWebsite(updatedSite);
        setWebsites((prev) =>
          prev.map((w) => (w._id === updatedSite._id ? updatedSite : w))
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify check.');
    }
  };

  // Add Website
  const addWebsite = async (payload: { name: string; url: string; category?: string; environment?: string }) => {
    const site = await launchPilotApi.createWebsite(payload);
    setWebsites((prev) => [site, ...prev]);
    setActiveWebsite(site);
    playTelemetryTone('success', soundEnabled);
    // Automatically trigger initial scan for newly added site
    triggerScan(site.url, site._id);
    return site;
  };

  // Update Website
  const updateWebsite = async (id: string, payload: Partial<IWebsite>) => {
    const updated = await launchPilotApi.updateWebsite(id, payload);
    setWebsites((prev) => prev.map((w) => (w._id === id ? updated : w)));
    if (activeWebsite?._id === id) {
      setActiveWebsite(updated);
    }
  };

  // Delete Website
  const deleteWebsite = async (id: string) => {
    await launchPilotApi.deleteWebsite(id);
    setWebsites((prev) => prev.filter((w) => w._id !== id));
    if (activeWebsite?._id === id) {
      const remaining = websites.filter((w) => w._id !== id);
      setActiveWebsite(remaining.length > 0 ? remaining[0] : null);
      setCurrentScan(null);
    }
  };

  // Launch Decision Status: Armed only when GO
  const isLaunchArmed =
    Boolean(currentScan && currentScan.launchStatus === 'GO' && currentScan.readinessScore >= 75 && !isScanning);

  // Trigger Rocket Launch Sequence
  const launchRocket = () => {
    if (!isLaunchArmed || isLaunching) return;

    setIsLaunching(true);
    playTelemetryTone('ignition', soundEnabled);

    // After 2.5s countdown and liftoff, trigger confetti celebration
    setTimeout(() => {
      setIsLaunching(false);
      setHasLaunched(true);
      playTelemetryTone('success', soundEnabled);

      // Confetti burst
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#00FF9D', '#00E5FF', '#3B82F6', '#FFFFFF'],
      });
    }, 2800);
  };

  const resetLaunch = () => {
    setHasLaunched(false);
    setIsLaunching(false);
  };

  // Notifications
  const markNotificationRead = async (id: string) => {
    await launchPilotApi.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = async () => {
    await launchPilotApi.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <LaunchPilotContext.Provider
      value={{
        websites,
        activeWebsite,
        setActiveWebsite: handleSelectWebsite,
        currentScan,
        scanHistory,
        isScanning,
        scanProgress,
        currentScanningCheck,
        triggerScan,
        manualVerifyCheck,
        addWebsite,
        updateWebsite,
        deleteWebsite,
        isLaunchArmed,
        isLaunching,
        hasLaunched,
        launchRocket,
        resetLaunch,
        soundEnabled,
        setSoundEnabled,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        refreshData,
        error,
        clearError: () => setError(null),
      }}
    >
      {children}
    </LaunchPilotContext.Provider>
  );
};

export const useLaunchPilot = (): LaunchPilotContextType => {
  const context = useContext(LaunchPilotContext);
  if (!context) {
    throw new Error('useLaunchPilot must be used within a LaunchPilotProvider');
  }
  return context;
};
