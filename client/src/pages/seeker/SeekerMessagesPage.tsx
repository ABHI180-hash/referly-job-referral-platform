import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { ChatAttachment } from '@/types';
import {
  Search,
  Send,
  CheckCircle2,
  MessageSquare,
  Paperclip,
  Plus,
  FileText,
  Image as ImageIcon,
  FolderArchive,
  Download,
  X,
  FileUp,
  Sparkles,
  ExternalLink,
  Check,
} from 'lucide-react';

export const SeekerMessagesPage: React.FC = () => {
  const { conversations, sendMessage, currentUser, addToast } = useApp();
  const [activeConvId, setActiveConvId] = useState<string>(
    conversations[0]?.id || 'conv_001'
  );
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Attachments State
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [uploadCategoryFilter, setUploadCategoryFilter] = useState<string>('*');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation =
    conversations.find((c) => c.id === activeConvId) || conversations[0];

  const filteredConversations = conversations.filter(
    (c) =>
      c.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactCompany.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close ChatGPT-style menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [menuOpen]);

  // Scroll to bottom on conversation change or new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  // Trigger file explorer with specific accept filter
  const handleTriggerUpload = (category: 'all' | 'resume' | 'image' | 'code') => {
    setMenuOpen(false);
    if (!fileInputRef.current) return;

    if (category === 'resume') {
      fileInputRef.current.accept = '.pdf,.doc,.docx';
    } else if (category === 'image') {
      fileInputRef.current.accept = 'image/*';
    } else if (category === 'code') {
      fileInputRef.current.accept = '.zip,.tar,.json,.ts,.tsx,.js,.py,.pdf';
    } else {
      fileInputRef.current.accept = '*';
    }

    fileInputRef.current.click();
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Handle native file selection from File Explorer
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: ChatAttachment[] = [];

    Array.from(files).forEach((file) => {
      let category: 'resume' | 'document' | 'image' | 'code' = 'document';
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext || '')) {
        category = 'image';
      } else if (file.name.toLowerCase().includes('resume') || file.name.toLowerCase().includes('cv') || ext === 'pdf') {
        category = 'resume';
      } else if (['zip', 'tar', 'gz', 'json', 'ts', 'tsx', 'js', 'py'].includes(ext || '')) {
        category = 'code';
      }

      const fileUrl = URL.createObjectURL(file);

      newAttachments.push({
        id: 'att_' + Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type || ext || 'file',
        url: fileUrl,
        category,
      });
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
    addToast(`${newAttachments.length} document(s) uploaded successfully!`, 'success');

    // Reset input value so same file can be re-selected if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Attach saved user resume from platform profile
  const handleAttachSavedResume = () => {
    setMenuOpen(false);
    const savedResumeName = currentUser?.resumeName || 'Arjun_Mehta_Senior_Frontend_2026.pdf';

    // Prevent duplicate
    if (attachments.some((a) => a.name === savedResumeName)) {
      addToast('Resume is already attached in composer.', 'info');
      return;
    }

    const resumeAttachment: ChatAttachment = {
      id: 'att_resume_' + Date.now(),
      name: savedResumeName,
      size: '1.8 MB',
      type: 'application/pdf',
      url: currentUser?.resumeUrl || '#',
      category: 'resume',
    };

    setAttachments((prev) => [...prev, resumeAttachment]);
    addToast(`Attached verified profile resume: ${savedResumeName}`, 'success');
  };

  // Remove attachment from composer
  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Send message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && attachments.length === 0) || !activeConversation) return;

    sendMessage(activeConversation.id, inputText, attachments);
    setInputText('');
    setAttachments([]);
    addToast('Message & documents delivered in chat!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <PageMeta
        title="Direct Messages & Document Sharing"
        description="Communicate directly with verified referrers, share resumes, and attach portfolios."
      />

      {/* Hidden native File Explorer input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        className="hidden"
      />

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Direct In-App Messages</h1>
        <p className="text-xs text-slate-500 mt-1">
          Coordinate directly with your referrers and hiring leads. Attach resumes, photos, and project documents.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px] h-[calc(100vh-210px)]">
        {/* Left: Conversation List (4 Cols) */}
        <div className="md:col-span-4 border-r border-slate-200/80 flex flex-col bg-slate-50/40">
          {/* Search Contacts */}
          <div className="p-3.5 border-b border-slate-200/80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConversation?.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                    isSelected ? 'bg-indigo-50/70 border-l-3 border-indigo-600' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={conv.contactAvatar}
                      alt={conv.contactName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {conv.contactName}
                      </span>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">
                        {conv.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-600 truncate">
                      {conv.contactRole} • {conv.contactCompany}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-1">{conv.lastMessage}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Window (8 Cols) */}
        <div className="md:col-span-8 flex flex-col bg-white">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={activeConversation.contactAvatar}
                      alt={activeConversation.contactName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    {activeConversation.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      {activeConversation.contactName}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {activeConversation.contactRole} at{' '}
                      <strong className="text-slate-700">
                        {activeConversation.contactCompany}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Employee
                  </span>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
                {activeConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 space-y-2 shadow-xs ${
                        msg.isOwn
                          ? 'bg-indigo-600 text-white rounded-br-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      {/* Message Text */}
                      {msg.text && (
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      )}

                      {/* Message Attachments Rendering */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="space-y-2 pt-1">
                          {msg.attachments.map((att) => (
                            <div
                              key={att.id}
                              className={`rounded-xl p-3 flex items-center justify-between gap-3 ${
                                msg.isOwn
                                  ? 'bg-indigo-700/80 border border-indigo-500/50 text-white'
                                  : 'bg-slate-50 border border-slate-200/90 text-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {att.category === 'image' ? (
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0 border border-white/20">
                                    <img
                                      src={att.url}
                                      alt={att.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                      att.category === 'resume'
                                        ? 'bg-rose-500/20 text-rose-300'
                                        : 'bg-blue-500/20 text-blue-300'
                                    }`}
                                  >
                                    <FileText className="w-5 h-5 text-current" />
                                  </div>
                                )}

                                <div className="truncate">
                                  <span className="text-xs font-semibold block truncate">
                                    {att.name}
                                  </span>
                                  <div className="flex items-center gap-1.5 text-[10px] opacity-80">
                                    <span>{att.size}</span>
                                    <span>•</span>
                                    <span className="inline-flex items-center gap-0.5 text-emerald-300 font-bold">
                                      <CheckCircle2 className="w-2.5 h-2.5" /> Uploaded Document
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <a
                                href={att.url}
                                download={att.name}
                                target="_blank"
                                rel="noreferrer"
                                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                                  msg.isOwn
                                    ? 'bg-white/10 hover:bg-white/20 text-white'
                                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                                }`}
                                title="Download / Open Document"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          ))}
                        </div>
                      )}

                      <span
                        className={`text-[10px] block text-right ${
                          msg.isOwn ? 'text-indigo-200' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer Area */}
              <div className="p-3.5 border-t border-slate-200/80 bg-white space-y-2.5 relative">
                {/* ATTACHMENTS PREVIEW TRAY (Above Input Field) */}
                {attachments.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                        <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                        Attached Documents ({attachments.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setAttachments([])}
                        className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        Clear all
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center gap-2.5 p-2 rounded-xl border border-emerald-300 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-2xs transition-all max-w-sm"
                        >
                          {/* Thumbnail / Icon */}
                          {att.category === 'image' ? (
                            <img
                              src={att.url}
                              alt={att.name}
                              className="w-8 h-8 rounded-lg object-cover border border-emerald-300 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                          )}

                          {/* Details */}
                          <div className="min-w-0 pr-1">
                            <span className="text-xs font-semibold text-slate-900 truncate block max-w-[140px]">
                              {att.name}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-500">{att.size}</span>
                              {/* Prominent Green Uploaded Indicator */}
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-600 text-white shadow-2xs">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>Uploaded</span>
                              </span>
                            </div>
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove attachment"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CHATGPT-STYLE ATTACHMENT POPUP MENU */}
                {menuOpen && (
                  <div
                    ref={menuRef}
                    className="absolute bottom-16 left-3.5 z-40 w-72 bg-[#1E1F22] text-slate-200 rounded-2xl shadow-2xl border border-slate-700 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-1.5 border-b border-slate-800">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Attach Files & Career Assets
                      </span>
                    </div>

                    {/* 1. Add photos & files (Upload from computer) */}
                    <button
                      type="button"
                      onClick={() => handleTriggerUpload('all')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors text-xs font-medium text-slate-200 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-indigo-600 transition-colors">
                        <Paperclip className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold block text-white text-xs">
                          Add photos & files
                        </span>
                        <span className="text-[10px] text-slate-400 block -mt-0.5">
                          Upload from computer
                        </span>
                      </div>
                    </button>

                    {/* 2. Upload Resume / CV */}
                    <button
                      type="button"
                      onClick={() => handleTriggerUpload('resume')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors text-xs font-medium text-slate-200 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-rose-400 group-hover:text-white group-hover:bg-rose-600 transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold block text-white text-xs">
                          Upload Resume / CV
                        </span>
                        <span className="text-[10px] text-slate-400 block -mt-0.5">
                          Attach PDF, DOCX (up to 10MB)
                        </span>
                      </div>
                    </button>

                    {/* 3. Attach Portfolio & Code Samples */}
                    <button
                      type="button"
                      onClick={() => handleTriggerUpload('code')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors text-xs font-medium text-slate-200 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition-colors">
                        <FolderArchive className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold block text-white text-xs">
                          Portfolio & Code Samples
                        </span>
                        <span className="text-[10px] text-slate-400 block -mt-0.5">
                          ZIP, architecture diagrams, code
                        </span>
                      </div>
                    </button>

                    {/* 4. Share Screenshot / Photo */}
                    <button
                      type="button"
                      onClick={() => handleTriggerUpload('image')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors text-xs font-medium text-slate-200 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 group-hover:text-white group-hover:bg-amber-600 transition-colors">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold block text-white text-xs">
                          Photos & Screenshots
                        </span>
                        <span className="text-[10px] text-slate-400 block -mt-0.5">
                          PNG, JPG, WebP images
                        </span>
                      </div>
                    </button>

                    {/* 5. One-Click: Saved Referly Resume */}
                    <button
                      type="button"
                      onClick={handleAttachSavedResume}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors text-xs font-medium text-slate-200 border-t border-slate-800/80 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold block text-emerald-300 text-xs">
                          Quick Attach Profile Resume
                        </span>
                        <span className="text-[10px] text-slate-400 block -mt-0.5">
                          {currentUser?.resumeName || 'Arjun_Mehta_2026.pdf'}
                        </span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Form Input Line */}
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  {/* ChatGPT-Style Plus Button */}
                  <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      menuOpen
                        ? 'bg-slate-900 text-white rotate-45'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                    title="Add photos, files & resume"
                  >
                    <Plus className="w-4 h-4 transition-transform duration-150" />
                  </button>

                  {/* Main Text Input */}
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${activeConversation.contactName}...`}
                    className="flex-1 text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!inputText.trim() && attachments.length === 0}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <MessageSquare className="w-8 h-8 mb-2" />
              <p className="text-xs">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
