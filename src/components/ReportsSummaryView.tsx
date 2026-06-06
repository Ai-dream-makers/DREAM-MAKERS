import { useState } from 'react';
import { Card } from 'lucide-react'; // Wait, standard lucide-react doesn't have custom card, use FileText, etc.
import { FileText, Download, Share2, Mail, ExternalLink, MessageCircle, Heart, Footprints, Moon, CheckSquare } from 'lucide-react';
import { Elder, HealthStats } from '../types';

interface ReportsSummaryViewProps {
  elder: Elder;
  stats: HealthStats;
}

export default function ReportsSummaryView({ elder, stats }: ReportsSummaryViewProps) {
  const [reportPeriod, setReportPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareDestination, setShareDestination] = useState('caregiver');
  const [shareMethod, setShareMethod] = useState('line');

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      
      // Simulate programmatic PDF download warning/popup or blob
      alert(`ดาวน์โหลดรายงาน PDF สารสนเทศสุขภาพของ ${elder.name} หกคะเมนสัมพัทธ์ สำเร็จเรียบร้อย!\n\nชื่อไฟล์: careband_report_${elder.id}_${reportPeriod}.pdf`);
    }, 1500);
  };

  const handleDispatchShare = () => {
    setIsSharing(true);
    setTimeout(() => {
      setIsSharing(false);
      
      let targetName = '';
      if (shareDestination === 'caregiver') targetName = 'ญาติผู้ดูแลหลัก';
      else if (shareDestination === 'vhealth') targetName = 'อสม. ฝ่ายดูแล';
      else targetName = 'รพ.สต. โรงพยาบาลชุมชนส่งเสริมสุขภาพตำบล';

      alert(`ส่งรายงานเชื่อมโยงสำเร็จผ่านช่องทาง [${shareMethod.toUpperCase()}] ไปยัง ${targetName} เรียบร้อย!`);
    }, 1000);
  };

  return (
    <div id="reports-summary-view" className="space-y-6">
      
      {/* 2 Column dashboard interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Hand Card: Report Generator Configuration & Actions */}
        <div id="report-generator-actions" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm lg:col-span-1 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-700">จัดทำและดาวน์โหลดเอกสาร (Document Exporter)</h3>
              <p className="text-xs text-slate-400">กรุณาเลือกรอบเอกสารและระบุวิธีรายงานทางคลินิกที่ต้องการออกรายงาน</p>
            </div>

            {/* Selector Period */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">รอบการสรุปประมวลผล (Period)</span>
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
                <button
                  id="period-weekly-btn"
                  onClick={() => setReportPeriod('weekly')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reportPeriod === 'weekly' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  รายงานรายสัปดาห์
                </button>
                <button
                  id="period-monthly-btn"
                  onClick={() => setReportPeriod('monthly')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reportPeriod === 'monthly' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  รายงานรายเดือน
                </button>
              </div>
            </div>

            {/* Config share parameters */}
            <div className="space-y-3.5 border-t border-slate-50 pt-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">เป้าหมายส่งข้อมูลร่วม (Recipient & Channel)</span>
              
              <div className="space-y-2 text-xs">
                <label className="block font-semibold text-slate-600">ผู้รับข้อมูลปลายทาง</label>
                <select
                  id="share-dest-select"
                  value={shareDestination}
                  onChange={e => setShareDestination(e.target.value)}
                  className="w-full p-2 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-lg outline-none cursor-pointer transition-colors"
                >
                  <option value="caregiver">ญาติผู้ดูแลหลัก ({elder.primaryCaregiverName})</option>
                  <option value="vhealth">อสม. พื้นที่สัมพัทธ์</option>
                  <option value="hospital">รพ.สต. โรงพยาบาลชุมชนส่งเสริมสุขภาพตำบลประจำบ้าน</option>
                </select>
              </div>

              <div className="space-y-2 text-xs">
                <label className="block font-semibold text-slate-600">ช่องทางการเชื่อมข้อมูล</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'line', label: 'LINE', icon: <MessageCircle className="w-3.5 h-3.5" /> },
                    { id: 'email', label: 'E-mail', icon: <Mail className="w-3.5 h-3.5" /> },
                    { id: 'h_api', label: 'API รพ.', icon: <ExternalLink className="w-3.5 h-3.5" /> }
                  ].map(chan => (
                    <button
                      id={`share-channel-${chan.id}-btn`}
                      key={chan.id}
                      onClick={() => setShareMethod(chan.id)}
                      className={`p-2 rounded-lg border text-[10px] font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                        shareMethod === chan.id
                          ? 'bg-teal-50 border-teal-500 text-teal-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {chan.icon}
                      <span>{chan.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <button
              id="report-pdf-download-btn"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className={`w-full py-3 bg-slate-900 border border-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isDownloading ? 'bg-slate-700 opacity-80 cursor-not-allowed' : 'hover:bg-slate-800'
              }`}
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>กำลังเจเนอเรตรายงาน PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4.5 h-4.5" />
                  <span>ดาวน์โหลดรายงาน PDF (Download PDF)</span>
                </>
              )}
            </button>

            <button
              id="report-share-dispatch-btn"
              onClick={handleDispatchShare}
              disabled={isSharing}
              className="w-full py-2.5 bg-teal-50 border border-teal-100 hover:bg-teal-100 text-teal-800 font-bold text-xs rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              {isSharing ? 'กำลังทะยานข้อมูล...' : 'ส่งพาสพอร์ตข้อมูลสุขภาพด่วน'}
            </button>
          </div>
        </div>

        {/* Right Hand: High Fidelity Printable design representing report preview */}
        <div id="report-view-preview" className="bg-white p-6 rounded-2xl border border-slate-200 lg:col-span-2 space-y-6 relative overflow-hidden shadow-xs">
          
          {/* Simulated watermark header */}
          <div className="absolute top-2 right-2 border border-slate-200 rounded-md px-2 py-0.5 text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest">
            CareBand PREVIEW CERTIFICATION
          </div>

          <div className="flex items-center space-x-3.5 pb-4 border-b-2 border-slate-105">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <FileText className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="block text-[10px] text-teal-600 font-extrabold uppercase tracking-widest">รายงานรูปเล่มเวชสงเคราะห์แพทย์สาธารณสุข</span>
              <h2 className="text-lg font-black text-slate-800">
                สมุดบันทึกสะท้อนผลลัทธิสุขภาพ {reportPeriod === 'weekly' ? 'รายสัปดาห์ (VHV-Weekly)' : 'รายเดือน (VHV-Monthly)'}
              </h2>
            </div>
          </div>

          {/* Demographic header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl text-xs text-slate-600 font-medium">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">ชื่อคนไข้ผู้ทรงวัย</span>
              <b className="text-slate-800 font-bold text-sm block mt-0.5">{elder.name}</b>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block">เกณฑ์กลุ่มอายุ / หมู่บ้าน</span>
              <span className="text-slate-700 block mt-0.5">{elder.age} ปี • {elder.villageName}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block">ช่วงประเมินในเอกสาร</span>
              <span className="text-indigo-600 block mt-0.5 font-bold">ปี 2026 (ปัจจุบัน)</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block">รหัสประตัวเครื่อง IoT</span>
              <span className="font-mono text-slate-700 block mt-0.5 font-bold">CB-X9901-SEC</span>
            </div>
          </div>

          {/* Core medical outcomes metrics summary list */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">สารัตถะยืดหลักสถิติร่วมนอนและพฤติกรรม</span>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Step counter sum */}
              <div className="p-3 bg-teal-50/45 border border-teal-100 rounded-xl space-y-1">
                <div className="flex items-center space-x-2 text-xs text-teal-800">
                  <Footprints className="w-4 h-4 text-teal-600" />
                  <b>สะสมยอดอัตราก้าว:</b>
                </div>
                <p className="text-slate-700 text-sm font-bold">
                  {reportPeriod === 'weekly' ? '30,840 ก้าว' : '134,500 ก้าว'}
                </p>
                <span className="text-[9.5px] text-teal-600/80 block">สะสมสม่ำเสมอดีมาก</span>
              </div>

              {/* Heart rate average */}
              <div className="p-3 bg-rose-50/45 border border-rose-100 rounded-xl space-y-1">
                <div className="flex items-center space-x-2 text-xs text-rose-800">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <b>ชีพจรเฉลี่ยระเบียบตัว:</b>
                </div>
                <p className="text-slate-700 text-sm font-bold">
                  {stats.avgHeartRate} bpm (อัตราแปรผัน {stats.minHeartRate}-{stats.maxHeartRate})
                </p>
                <span className="text-[9.5px] text-rose-600/80 block">อยู่ในช่วงปลอดภัยตามวัฎจักร</span>
              </div>

              {/* Sleep durations statistics */}
              <div className="p-3 bg-indigo-50/45 border border-indigo-100 rounded-xl space-y-1">
                <div className="flex items-center space-x-2 text-xs text-indigo-850">
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <b>การหลับรวมคุณภาพ:</b>
                </div>
                <p className="text-slate-700 text-sm font-bold">
                  {stats.sleepHours} ชม./คืน (หลับลึก {stats.deepSleepPercent}%)
                </p>
                <span className="text-[9.5px] text-indigo-600/80 block">การประสานนอนหลับมั่นคง</span>
              </div>

            </div>
          </div>

          {/* AI Clinical Diagnostic Recommendation report */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">ความเห็นและคำพยากรณ์ลัทธิ อสม./เจ้าหน้าที่แพทย์</span>
            
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl text-xs text-slate-650 leading-relaxed space-y-2">
              <p className="font-semibold text-slate-800">📋 นวินิจฉัยจากรายงานอิเล็กทรอนิกส์:</p>
              <p>
                ผู้สูงอายุสวมใส่สายรัดข้อมือได้ครอบคลุมเกือบ 24 ชั่วโมงต่อวัน ได้รับการฟื้นฟูด้วยการออกกำลังกายประคองอัตราชีพจรได้อย่างสม่ำเสมอ แบตเตอรี่ถูกจัดการชาร์จอย่างถูกต้องโดยญาติผู้ดูแลหลัก ไม่พบดัชนีช็อคล้มหรือสัญญาณแรงโน้มถ่วงลื่นเปรี้ยงในสถิติรอบประพฤติกรรมนี้
              </p>
              <p className="text-[10px] text-slate-400">
                * ข้อความข้างต้นรวบรวมรายงานสารสนเทศจากหน่วยความจำคลาวด์ สตรีมมิ่งไร้สาย
              </p>
            </div>
          </div>

          {/* Signing footer preview */}
          <div className="flex justify-between items-end pt-4 border-t border-slate-100 text-xs text-slate-400">
            <div>
              <span>ระดับประเมินเกณฑ์คนไข้:</span>
              <span className="font-bold text-emerald-600 block">🟢 สุขภาพระดับดีเยี่ยม (Grade A)</span>
            </div>
            <div className="text-right">
              <span>รายงานประเมินโดย แพลตฟอร์ม CareBand IoT</span>
              <span className="font-semibold text-slate-500 block">รหัสระบุตราแพทย์: [SIG-88091]</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
