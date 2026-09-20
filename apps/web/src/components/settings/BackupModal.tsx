'use client';

import React, { useState } from 'react';
import { X, Database, Download, ShieldCheck, Check, Cloud } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { api } from '@/lib/api';

export function BackupModal() {
  const { isBackupModalOpen, setModalState } = useUIStore();
  const [frequency, setFrequency] = useState('DAILY');
  const [isEncrypted, setIsEncrypted] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [backupResult, setBackupResult] = useState<any>(null);

  if (!isBackupModalOpen) return null;

  const handleCreateBackup = async () => {
    setDownloading(true);
    try {
      const res = await api.exportBackup();
      if (res.success && res.backup) {
        setBackupResult(res.backup);
      }
    } catch (err) {
      console.error('Backup generation failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="w-full max-w-md bg-[#FAF8F2] border border-[#E2D8C7] rounded-3xl shadow-2xl p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2D8C7] mb-4">
          <div className="flex items-center gap-2 text-[#1E3A8A] font-bold text-sm">
            <Database className="w-5 h-5" />
            <span>Chat Backup & Migration</span>
          </div>
          <button
            onClick={() => setModalState('isBackupModalOpen', false)}
            className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#ECE3D4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2D8C7] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#1E3A8A]" />
              <div>
                <p className="text-xs font-bold text-[#0F172A]">End-to-End Encrypted Backup</p>
                <p className="text-[10px] text-[#64748B]">Protected with PBKDF2 cryptographic key derivation</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isEncrypted}
              onChange={(e) => setIsEncrypted(e.target.checked)}
              className="w-4 h-4 accent-[#1E3A8A] rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Auto-Backup Schedule</label>
            <div className="grid grid-cols-3 gap-2">
              {['DAILY', 'WEEKLY', 'MONTHLY'].map((freq) => (
                <button
                  key={freq}
                  onClick={() => setFrequency(freq)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    frequency === freq
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                      : 'bg-[#FFFFFF] text-[#64748B] border-[#E2D8C7] hover:bg-[#FAF8F2]'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {backupResult && (
            <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E3A8A] space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Check className="w-4 h-4" /> Backup Archive Ready ({Math.round(backupResult.fileSize / 1024)} KB)
              </div>
              <a
                href={backupResult.downloadUrl}
                download="letstalk_encrypted_backup.json"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A8A] text-white font-bold rounded-lg text-xs hover:bg-[#2563EB] transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download Archive JSON
              </a>
            </div>
          )}

          <button
            onClick={handleCreateBackup}
            disabled={downloading}
            className="w-full py-3 bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-md shadow-[#1E3A8A]/20 flex items-center justify-center gap-2 transition-all"
          >
            <Cloud className="w-4 h-4" />
            <span>{downloading ? 'Encrypting & Generating Archive...' : 'Back Up Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
