import { useState } from 'react';
import { AlertCircle, ToggleLeft, ShieldAlert, Cpu, Heart, CheckCircle2, Battery, RefreshCw, Filter, Search } from 'lucide-react';
import { AlertLog, Elder } from '../types';

interface AlertHistoryViewProps {
  logs: AlertLog[];
  onResolvePendingLog: (logId: string, resolver: string, note: string) => void;
  eldersList: Elder[];
}

export default function AlertHistoryView({ logs, onResolvePendingLog, eldersList }: AlertHistoryViewProps) {
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Resolution Modal states
  const [resolvingLogId, setResolvingLogId] = useState<string | null>(null);
  const [resolverName, setResolverName] = useState('');
  const [resolutionComment, setResolutionComment] = useState('');

  // Handle resolving a pending log from history tab
  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingLogId || !resolverName || !resolutionComment) {
      alert('กรุณากรอกชื่อผู้ระงับและรายละเอียด');
      return;
    }
    onResolvePendingLog(resolvingLogId, resolverName, resolutionComment);
    setResolvingLogId(null);
    setResolverName('');
    setResolutionComment('');
    alert('แก้ไขสถานะแจ้งเตือนเรียบร้อย');
  };

  // Filters logic
  const filteredLogs = logs.filter(log => {
    const typeMatch = activeTypeFilter === 'all' || log.type === activeTypeFilter;
    const statusMatch = 
      activeStatusFilter === 'all' || 
      (activeStatusFilter === 'pending' && log.status === 'pending') ||
      (activeStatusFilter === 'resolved' && log.status === 'resolved');
    const searchMatch = 
      log.elderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && statusMatch && searchMatch;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'fall':
        return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case 'high_hr':
      case 'low_hr':
        return <Heart className="w-5 h-5 text-amber-500 animate-pulse" />;
      case 'low_battery':
        return <Battery className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100/80 text-red-800 border-red-200';
      case 'alert':
        return 'bg-amber-100/80 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100/80 text-blue-850 border-blue-200';
    }
  };

  const getSeverityName = (severity: string) => {
    if (severity === 'critical') return 'วิกฤตสูงสุด';
    if (severity === 'alert') return 'เฝ้าระวัง';
    return 'เตือนทั่วไป';
  };

  return (
    <div id="alert-history-view" className="space-y-6">
      
      {/* Filtering header controller */}
      <div id="logs-filter-card" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-50 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Filter className="w-4.5 h-4.5 text-slate-400" />
              กล่องกรองรายงานข้อมูลเหตุการณ์ (Event Audit Filtration)
            </h3>
            <p className="text-xs text-slate-400">เลือกล็อคตัวแปรเพื่อค้นหารีพอร์ตการแจ้งภัยและช่วยเหลือในชุมชน</p>
          </div>

          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="logs-search-input"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="พิมพ์ชื่อผู้สูงอายุหรือประเภทภัย..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none text-xs transition-colors"
            />
          </div>
        </div>

        {/* Tab filters layout */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
          
          <div className="flex flex-wrap gap-1">
            {/* Event Category pills */}
            {[
              { id: 'all', label: 'ทั้งหมด' },
              { id: 'fall', label: '🚨 หกล้ม' },
              { id: 'high_hr', label: '❤️ ชีพจรผิดปกติ' },
              { id: 'low_battery', label: '🔋 แบตเตอรี่ต่ำ' }
            ].map(tab => (
              <button
                id={`filter-type-${tab.id}-btn`}
                key={tab.id}
                onClick={() => setActiveTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  activeTypeFilter === tab.id
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">สถานะการช่วยเหลือ:</span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg">
              {[
                { id: 'all', label: 'ทั้งหมด' },
                { id: 'pending', label: '⏳ ค้างอยู่' },
                { id: 'resolved', label: '✅ ช่วยสำเร็จ' }
              ].map(statusTab => (
                <button
                  id={`filter-status-${statusTab.id}-btn`}
                  key={statusTab.id}
                  onClick={() => setActiveStatusFilter(statusTab.id)}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    activeStatusFilter === statusTab.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {statusTab.label}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Main List Table rendering logs */}
      <div id="logs-list-card" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm">
        
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            ⚠️ ไม่พบรายการสัญณาณแจ้งภัยตามเงื่อนไขที่คุณระบุตัวกรอง
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => {
              const isPending = log.status === 'pending';
              
              return (
                <div
                  id={`log-item-${log.id}`}
                  key={log.id}
                  className={`p-4 rounded-xl border-l-4 transition-all hover:translate-x-1 duration-150 border-y border-r border-slate-150 ${
                    log.severity === 'critical'
                      ? 'border-l-rose-500 bg-rose-50/5 hover:bg-rose-50/15'
                      : log.severity === 'alert'
                      ? 'border-l-amber-500 bg-amber-50/5 hover:bg-amber-50/15'
                      : 'border-l-yellow-500 bg-yellow-50/5 hover:bg-yellow-50/15'
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    
                    {/* Left details partition */}
                    <div className="space-y-2 flex-grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-xs text-slate-800">{log.elderName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">#{log.id}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest border rounded ${getSeverityBadgeClass(log.severity)}`}>
                          {getSeverityName(log.severity)}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center font-mono">
                          {log.timestamp} น.
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                        🔊 <b>เหตุการณ์หลัก:</b> {log.details}
                      </p>

                      {/* Display resolved details if available */}
                      {log.status === 'resolved' && (
                        <div className="bg-emerald-50/65 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-800 space-y-1 mt-2">
                          <p className="font-bold">✔️ ปิดรายงานช่วยเหลือสงบเรียบร้อย</p>
                          <p className="text-[11px] leading-relaxed"><b>เจ้าหน้าที่ผู้ระงับเหตุ:</b> {log.resolvedBy} • เวลาปิด: {log.resolvedAt} น.</p>
                          <p className="text-[11px] italic leading-relaxed">💬 <b>บันทึกข้อแนะนำ:</b> {log.resolutionNote}</p>
                        </div>
                      )}
                    </div>

                    {/* Right action button partition */}
                    <div className="flex items-center min-w-[120px] shrink-0 justify-end">
                      {isPending ? (
                        <button
                          id={`resolve-log-${log.id}-btn`}
                          onClick={() => setResolvingLogId(log.id)}
                          className="py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold rounded-lg cursor-pointer shadow-sm transition-colors flex items-center gap-1"
                        >
                          ⏳ คลิกเพื่อเขียนสรุปช่วยเหลือ
                        </button>
                      ) : (
                        <span className="text-emerald-700 text-xs font-bold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          ช่วยสำเร็จเสร็จสิ้น
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Resolution log editing Modal */}
      {resolvingLogId && (
        <div id="resolve-floating-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 w-full max-w-lg shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">ส่งผลสรุปรายละเอียดการอุบัติเหตุ (Event Response Log)</h3>
              <p className="text-xs text-slate-400">กรุณากรอกรายงานสังเขปเพื่อให้ระบบบันทึกความช่วยเหลือเข้าระเบียบบ้าน</p>
            </div>

            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  ชื่อเจ้าหน้าที่ / อสม. / ญาติผู้ระงับภัย
                </label>
                <input
                  id="modal-resolver-input"
                  type="text"
                  required
                  value={resolverName}
                  onChange={e => setResolverName(e.target.value)}
                  placeholder="เช่น อสม. สายใจ แก้วดี"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-lg outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  บันทึกประเมินการช่วยเหลือและข้อเสนอแนะตัวผู้ล้ม
                </label>
                <textarea
                  id="modal-note-input"
                  rows={4}
                  required
                  value={resolutionComment}
                  onChange={e => setResolutionComment(e.target.value)}
                  placeholder="หัวเข่าถลอกเล็กน้อย ทายาและจัดสรรเตียงนอนระดับราบ ปลุกสังเกตอาการตามตารางแล้ว"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-lg outline-none text-xs leading-relaxed"
                ></textarea>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  id="modal-cancel-btn"
                  type="button"
                  onClick={() => setResolvingLogId(null)}
                  className="py-2.5 px-4 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/50 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  ปิดกล่อง
                </button>
                <button
                  id="modal-submit-btn"
                  type="submit"
                  className="py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  ปิดรายงานด่วน
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
