import React, { useState } from 'react';
import { ShieldAlert, Phone, Users, Activity, CheckCircle2, Check } from 'lucide-react';
import { Elder, AlertLog } from '../types';

interface EmergencyAlertViewProps {
  elder: Elder;
  activeAlert: AlertLog | null;
  onResolveAlert: (alertId: string, authorName: string, resolutionNote: string) => void;
  onSimulateFall: () => void;
}

export default function EmergencyAlertView({
  elder,
  activeAlert,
  onResolveAlert,
  onSimulateFall
}: EmergencyAlertViewProps) {
  const [resolver, setResolver] = useState('');
  const [note, setNote] = useState('');
  const [dialingNumber, setDialingNumber] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'notifying' | 'en_route' | 'arrived'>('idle');

  const handleDial = (label: string, number: string) => {
    setDialingNumber(`กำลังโทรออกจำลองไปยัง ${label} (${number})...`);
    setTimeout(() => {
      setDialingNumber(null);
      alert(`จำลองโครงสร้างโทรเสร็จสิ้นเรียบร้อยไปยังเป้าหมาย: ${label}`);
    }, 2000);
  };

  const handleDispatchRescue = () => {
    setDispatchStatus('notifying');
    setTimeout(() => {
      setDispatchStatus('en_route');
    }, 1500);
  };

  const handleSubmitResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAlert) return;
    if (!resolver || !note) {
      alert('กรุณากรอกชื่อผู้ระงับเหตุและบันทึกการประเมินช่วยเหลือก่อนบรรลุรายงาน');
      return;
    }
    onResolveAlert(activeAlert.id, resolver, note);
    setResolver('');
    setNote('');
    setDispatchStatus('idle');
    alert('บันทึกการระงับเหตุฉุกเฉินฉบับนี้เรียบร้อยแล้ว สถานะจะถูกย้ายเข้าสู่หมวดประวัติ');
  };

  return (
    <div id="emergency-alert-view" className="space-y-6">
      
      {!activeAlert ? (
        /* Empty state: No active hazard detected */
        <div id="no-hazard-container" className="bg-white p-8 rounded-2xl border border-slate-150 text-center max-w-xl mx-auto my-8 space-y-6 shadow-sm">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800">สถานะปกติ - ไม่พบเหตุแจ้งเตือน</h3>
            <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto">
              ขณะนี้ระบบประมวลผล คัดกรองตรวจจับการล้ม และชีพจรของ <b>{elder.name}</b> อยู่ภายใต้สภาวะเสถียร สายรัดข้อมือล็อกอินเข้าเครือข่ายเรียบร้อย
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 inline-flex items-center space-x-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-semibold text-slate-600">วิเคราะห์เซนเซอร์หลัก: สัญญาณชีพคงตัว 72 bpm</span>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              id="alert-simulate-direct-btn"
              onClick={onSimulateFall}
              className="py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              ทดลองสร้างคลื่นตกกระแทก (Simulate Emergency Fall Alert)
            </button>
            <p className="text-[10px] text-slate-400 mt-2">
              * ฟังก์ชันจำลองเพื่อตรวจสอบความสมบูรณ์ในการทำงานเมื่ออุปกรณ์มีการล้มฉุกเฉินเกิดขึ้น ณ เวลาปัจจุบัน
            </p>
          </div>
        </div>
      ) : (
        /* Active Warning alert triggered */
        <div id="active-alert-container" className="space-y-6">
          
          {/* Main Visual Warning Title Banner */}
          <div className="bg-rose-50 border-2 border-rose-500 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-8 -mt-8"></div>
            
            <div className="flex items-center space-x-5 z-10">
              <div className="p-4 bg-red-600 text-white rounded-xl shadow-xl shadow-red-600/30 animate-pulse flex-shrink-0">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center bg-red-600 text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-sans">
                  ⚠️ อันตรายสูงสุด • ตรวจพบแรงหกล้มรุนแรง
                </div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {elder.name} หกล้มเฉียบพลัน!
                </h2>
                <p className="text-xs font-semibold text-slate-600 leading-normal">
                  รหัสเหตุการณ์: <span className="font-mono">{activeAlert.id}</span> | พิกัดจุดตก: หมู่บ้านแสนสุข (ซอยแสนสุข 4) | รายละเอียดแรงกระทบกระเทือน: {activeAlert.details}
                </p>
              </div>
            </div>

            {/* Simulated Live Calling Status Badge */}
            {dialingNumber && (
              <div id="dialing-hud-banner" className="bg-teal-900 text-teal-100 text-xs px-4 py-2.5 rounded-xl border border-teal-700 shadow-md animate-pulse font-bold">
                {dialingNumber}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Direct Call controls (ปุ่มโทรหาผู้สูงอายุ ญาติ หรือหน่วยกู้ชีพ) & dispatch widgets */}
            <div id="emergency-call-card" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-5 lg:col-span-1 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-700">ควบคุมการโทร & จัดส่งทีมช่วยเหลือ</h3>
                  <p className="text-[11px] text-slate-400">ปุ่มสัมผัสลอยตัวเพื่อประสานหน่วยที่เกี่ยวข้องด่วนที่สุด</p>
                </div>

                {/* Call buttons grid */}
                <div className="space-y-2.5">
                  
                  {/* Call 1: Call Primary Caregiver */}
                  {elder.emergencyContacts.length > 0 && (
                    <button
                      id="call-relative-btn"
                      onClick={() => handleDial(elder.emergencyContacts[0].name, elder.emergencyContacts[0].phone)}
                      className="w-full py-3 px-4 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500" />
                        โทรหาญาติผู้ดูแล: {elder.emergencyContacts[0].name}
                      </span>
                      <Phone className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                  )}

                  {/* Call 2: Call Local Health Volunteer (อสม.) */}
                  {elder.emergencyContacts.length > 1 && (
                    <button
                      id="call-vhealth-btn"
                      onClick={() => handleDial(elder.emergencyContacts[1].name, elder.emergencyContacts[1].phone)}
                      className="w-full py-3 px-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-600" />
                        โทรติดต่อ อสม. ประจำบ้าน: {elder.emergencyContacts[1].name}
                      </span>
                      <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    </button>
                  )}

                  {/* Call 3: EMERGENCY RESCUE 1669 dispatch simulator */}
                  <button
                    id="call-rescue-btn"
                    onClick={() => handleDial('หน่วยกู้ชีพสาธารณสุข 1669', '1669')}
                    className="w-full py-3 px-4 bg-red-650 border border-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-between cursor-pointer shadow-red-300"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-100 animate-pulse" />
                      วิญญาณหน่วยกู้ภัยฉุกเฉิน 1669 ด่วน
                    </span>
                    <Phone className="w-3.5 h-3.5" />
                  </button>

                </div>

                {/* Dispatch Simulator State */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2.5 text-xs text-slate-600">
                  <h4 className="font-bold text-slate-850">ประเมินส่งตัวทีมพาหนะฉุกเฉิน (Ambulance Relay)</h4>
                  
                  {dispatchStatus === 'idle' && (
                    <button
                      id="dispatch-rescue-btn"
                      onClick={handleDispatchRescue}
                      className="w-full py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 text-[11px] transition-colors cursor-pointer"
                    >
                      สั่งการหน่วยกู้ชีพท้องถิ่น รพ.สต. มารับ
                    </button>
                  )}

                  {dispatchStatus === 'notifying' && (
                    <div className="p-2.5 bg-yellow-50 text-yellow-800 border border-yellow-250 rounded-lg text-center font-bold animate-pulse">
                      กำลังส่งแฟกซ์สัญญาณและพิกัดแผนที่ไปยังศูนย์กู่...
                    </div>
                  )}

                  {dispatchStatus === 'en_route' && (
                    <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg space-y-1">
                      <p className="font-bold">🚑 รถกู้ชีพ รพ.สต. กำลังเดินทางออก (EN-ROUTE)</p>
                      <p className="text-[10px] text-emerald-600">พิกัดทางอ้างอิง: คาดว่าถึงเป้าหมายภายใน 7 นาที</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 italic text-center">
                ระบบจะส่งภาพถ่ายระบุสถานะไปยังศูนย์ควบคุมท้องถิ่นพร้อมเบอร์โทร
              </div>
            </div>

            {/* Right Column: Interactive Resolution Reporting (ประสงค์เขียนสรุปผลแก้ไขระงับสัญญาณ) */}
            <div id="emergency-resolution-card" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm lg:col-span-2 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-700">ยืนยันข้อมูลความช่วยเหลือ & ปิดรายงานอุบัติเหตุ</h3>
                <p className="text-xs text-slate-400">กรุณากรอกรายงานข้อสังเกตหลังจากเข้าไปพยุงหรือตรวจสอบผู้สูงอายุในชีวิตจริงเรียบร้อยแล้ว เพื่อใช้เก็บเป็นประวัติการล้มย้อนหลัง</p>
              </div>

              <form onSubmit={handleSubmitResolution} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                    ชื่อผู้แก้ไขสถานการณ์ / ญาติ / อสม. ที่ช่วยเหลือ
                  </label>
                  <input
                    id="resolver-name-input"
                    type="text"
                    required
                    value={resolver}
                    onChange={e => setResolver(e.target.value)}
                    placeholder="ตัวอย่างเช่น อสม. สายใจ แก้วดี"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal-500 text-slate-800"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      บันทึกอาการและการช่วยเหลือ (Resolution Notes)
                    </label>
                    <span className="text-[10px] text-slate-400">พิมพ์ระบุรายละเอียดอย่างถูกต้อง</span>
                  </div>
                  <textarea
                    id="resolver-note-input"
                    rows={4}
                    required
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="เช่น สะดุดพรมในห้องน้ำล้มลง แต่หัวไม่ฟาดพื้น แขนขวาฟกช้ำเล็กน้อย อสม. ร่วมพยุงนำตัวพักและทายา ความดันเป็นปกติ หรือนำส่งรพ.สต. เรียบร้อย"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed outline-none focus:border-teal-500 text-slate-800 placeholder:text-slate-400"
                  ></textarea>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-800 leading-relaxed">
                  ⚠️ <b>ข้อควรทราบ:</b> เมื่อกดปุ่ม <b>"บันทึกช่วยเหลือและเสร็จสิ้นขั้นตอน"</b> สัญญาณภาพหกล้มสีแดงจะกลับเข้าสู่สถานะสงบเป็นปกติ คลื่นเสียงร้องเตือนจะระงับทันที และระบบจะอามรตเตือนข้อมูลสะถิติ
                </div>

                <button
                  id="submit-resolution-btn"
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all font-sans cursor-pointer shadow-md text-center flex items-center justify-center gap-1"
                >
                  <Check className="w-4.5 h-4.5" />
                  บันทึกช่วยเหลือและเสร็จสิ้นขั้นตอน (Resolve & Close Alert)
                </button>
              </form>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
