import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { FileText, UploadCloud, Trash2, CheckCircle2, AlertCircle, FileCheck } from 'lucide-react';

export const SeekerResumePage: React.FC = () => {
  const { currentUser, updateResume, removeResume, addToast } = useApp();
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      addToast('Please upload a valid PDF or DOCX resume document.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('Resume file exceeds maximum allowed limit of 5 MB.', 'error');
      return;
    }

    updateResume(file.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
        addToast('Please upload a PDF or DOCX file.', 'error');
        return;
      }
      updateResume(file.name);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageMeta
        title="Resume & CV"
        description="Upload and manage your verified PDF/DOCX resume for candidate referrals on Referly."
      />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Resume & CV Management</h1>
        <p className="text-xs text-slate-500 mt-1">
          Your primary resume is automatically attached when you request employee referrals or apply to open positions.
        </p>
      </div>

      {/* Active Resume Card */}
      {currentUser?.resumeName ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Primary Active Resume
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Referrals
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">{currentUser.resumeName}</h3>
                <p className="text-[11px] text-slate-400">PDF • 418 KB • Last updated today</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                Replace File
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={removeResume}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove resume"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <span className="font-bold block">No primary resume uploaded</span>
            Upload a resume so referrers can evaluate your candidacy before submitting internal referrals.
          </div>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`bg-white rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
          dragActive
            ? 'border-indigo-600 bg-indigo-50/40 ring-4 ring-indigo-50'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">
          Upload or drag and drop your updated resume
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Supported file formats: PDF, DOCX (Max size 5 MB)
        </p>

        <div className="mt-5">
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors">
            <FileCheck className="w-4 h-4" />
            <span>Select File from Device</span>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Referral Etiquette Advice */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Resume Optimization Tips for Referrals
        </h4>
        <ul className="space-y-2 text-xs text-slate-600">
          <li>• Keep resume strictly under 2 pages with quantitative metrics (e.g. improved latency by 40%).</li>
          <li>• Verify that your GitHub, LinkedIn, and personal portfolio links are active and clickable.</li>
          <li>• Match keywords from the specific job description to make it easy for referrers to advocate for you.</li>
        </ul>
      </div>
    </div>
  );
};
