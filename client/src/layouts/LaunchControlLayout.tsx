import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LaunchPilotProvider } from '../context/LaunchPilotContext';
import { LaunchControlSidebar } from '../components/launchpilot/LaunchControlSidebar';
import { LaunchControlNavbar } from '../components/launchpilot/LaunchControlNavbar';
import { AddWebsiteModal } from '../components/launchpilot/AddWebsiteModal';
import { LaunchCertificateModal } from '../components/launchpilot/LaunchCertificateModal';

const LaunchControlLayoutContent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addWebsiteModalOpen, setAddWebsiteModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Futuristic Left Sidebar */}
      <LaunchControlSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area (Offset by Sidebar on Desktop) */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Futuristic Top Navbar */}
        <LaunchControlNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenAddModal={() => setAddWebsiteModalOpen(true)}
        />

        {/* Page Views Mounted by React Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 min-w-0">
          <Outlet context={{ openCertificate: () => setCertificateModalOpen(true) }} />
        </main>
      </div>

      {/* Add Website Modal */}
      <AddWebsiteModal
        isOpen={addWebsiteModalOpen}
        onClose={() => setAddWebsiteModalOpen(false)}
      />

      {/* Launch Certificate Modal */}
      <LaunchCertificateModal
        isOpen={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
      />
    </div>
  );
};

export const LaunchControlLayout: React.FC = () => {
  return (
    <LaunchPilotProvider>
      <LaunchControlLayoutContent />
    </LaunchPilotProvider>
  );
};
