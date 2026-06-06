import { useState } from 'react';
import { User, ShieldAlert, Heart, Calendar, Phone, Plus, Trash2, Edit2, Check, CheckSquare } from 'lucide-react';
import { Elder } from '../types';

interface ElderInfoViewProps {
  elder: Elder;
  onUpdateElderContacts: (elderId: string, updatedContacts: any[]) => void;
}

export default function ElderInfoView({ elder, onUpdateElderContacts }: ElderInfoViewProps) {
  const [contacts, setContacts] = useState(elder.emergencyContacts);
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', relationship: '', phone: '', isPrimary: false });

  // Handle adding emergency contact
  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      alert('กรุณากรอกชื่อและเบอร์โทรติดต่อ');
      return;
    }
    const updated = [...contacts, { ...newContact, isPrimary: contacts.length === 0 ? true : newContact.isPrimary }];
    
    // If new contact is primary, make others non-primary
    if (newContact.isPrimary) {
      updated.forEach((c, idx) => {
        if (idx !== updated.length - 1) c.isPrimary = false;
      });
    }

    setContacts(updated);
    onUpdateElderContacts(elder.id, updated);
    setNewContact({ name: '', relationship: '', phone: '', isPrimary: false });
    setIsAdding(false);
  };

  // Handle deleting contact
  const handleDeleteContact = (index: number) => {
    if (confirm('คุณแน่ใจว่าต้องการลบรายชื่อติดต่อนี้?')) {
      const updated = contacts.filter((_, idx) => idx !== index);
      // Guarantee at least one primary if exist
      if (updated.length > 0 && !updated.some(c => c.isPrimary)) {
        updated[0].isPrimary = true;
      }
      setContacts(updated);
      onUpdateElderContacts(elder.id, updated);
    }
  };

  const handleSetPrimary = (index: number) => {
    const updated = contacts.map((c, idx) => ({
      ...c,
      isPrimary: idx === index
    }));
    setContacts(updated);
    onUpdateElderContacts(elder.id, updated);
  };

  return (
    <div id="elder-info-view" className="space-y-6">
      
      {/* 2-Column top overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Hand Card: General Bio with identification metrics */}
        <div id="elder-bio-card" className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm lg:col-span-1 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={elder.photo}
                  alt={elder.name}
                  referrerPolicy="no-referrer"
                  className="w-28 h-28 rounded-full object-cover border-4 border-slate-50 shadow-md"
                />
                <span className="absolute bottom-1 right-2 bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm">
                  ACTIVE
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mt-4 leading-normal">{elder.name}</h2>
              <p className="text-sm font-semibold text-teal-600 mt-1">{elder.villageName}</p>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-3.5">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>รหัสลงทะเบียน</span>
                <span className="text-slate-700 font-mono">REG-ELD-{elder.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>อายุ</span>
                <span className="text-slate-700">{elder.age} ปี</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>เพศ</span>
                <span className="text-slate-700">{elder.gender}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>กลุ่มหมู่เลือด</span>
                <span className="text-slate-700 px-2 py-0.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-md font-bold">{elder.bloodType}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>น้ำหนัก / ส่วนสูง</span>
                <span className="text-slate-700">{elder.weight} กก. / {elder.height} ซม.</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 text-slate-400 text-[11px] text-center italic">
            ข้อมูลอ้างอิงตรงกับทะเบียนบ้านประชากร รพ.สต. ท้องถิ่น
          </div>
        </div>

        {/* Right Hand: Chronic diseases, Allergies & Medication intake checkbook (อสม. favorite) */}
        <div id="elder-medical-card" className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm lg:col-span-2 space-y-6">
          
          <div className="flex items-center space-x-3.5 border-b border-slate-100 pb-3">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">อาการเจ็บป่วย & ข้อมูลโรคประจำตัว</h3>
              <p className="text-xs text-slate-400">ประวัติความเสี่ยงทางการแพทย์และข้อควรระวังสำคัญ</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chronic Conditions Box */}
            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-2">โรคประจำตัว (Chronic Diseases)</span>
              <ul className="space-y-1">
                {elder.chronicDiseases.map((disease, i) => (
                  <li key={i} className="text-xs text-slate-700 font-semibold">• {disease}</li>
                ))}
              </ul>
            </div>

            {/* Allergies Box */}
            <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl">
              <span className="text-xs font-bold text-red-800 uppercase tracking-wider block mb-2">ประวัติการแพ้ยา/อาหาร (Allergies)</span>
              <ul className="space-y-1">
                {elder.allergies.map((allergy, i) => (
                  <li key={i} className="text-xs text-rose-700 font-semibold">• {allergy}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Medication Calendar Schedule */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">ตารางการจ่ายยาประจำตัวและการกินยา (Daily Medications)</span>
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5" />
                อสม. ช่วยเช็คตารางยาแล้ว
              </span>
            </div>

            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-100">
                    <th className="p-3">ชื่อตัวยา</th>
                    <th className="p-3">ขนาดโดส</th>
                    <th className="p-3">เวลาและเงื่อนไข</th>
                    <th className="p-3 text-right">สถานะจ่าย</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {elder.medications.map((med, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-bold text-slate-800">{med.name}</td>
                      <td className="p-3 text-slate-400">{med.dosage}</td>
                      <td className="p-3 text-teal-700">{med.schedule}</td>
                      <td className="p-3 text-right">
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-100 text-[10px] uppercase font-bold">
                          เช็คแล้ว
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* Emergency Contact List Manager (Requirement: ข้อมูลติดต่อฉุกเฉิน) */}
      <div id="contact-manager-card" className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">รายชื่อติดต่อฉุกเฉินอย่างเป็นทางการ (Emergency Contacts)</h3>
              <p className="text-xs text-slate-400">ระบบจะส่งสัญญาณเตือนภัยหกล้มและข้อความ SMS ด่วนไปยังเบอร์เหล่านี้ตามลำดับความสำคัญ</p>
            </div>
          </div>

          <button
            id="add-contact-toggle-btn"
            onClick={() => setIsAdding(!isAdding)}
            className="self-start sm:self-center py-2 px-4 bg-slate-900 border border-slate-800 hover:bg-teal-700 hover:border-teal-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isAdding ? 'ปิดฟอร์ม' : 'เพิ่มเบอร์ฉุกเฉิน'}
          </button>
        </div>

        {/* Dynamic add view form toggle */}
        {isAdding && (
          <div id="add-contact-form" className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">ชื่อ-นามสกุล ผู้ติดต่อ</label>
              <input
                id="new-contact-name-input"
                type="text"
                value={newContact.name}
                onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="เช่น นายมานะ ยินดี"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">ความสัมพันธ์</label>
              <input
                id="new-contact-rel-input"
                type="text"
                value={newContact.relationship}
                onChange={e => setNewContact({ ...newContact, relationship: e.target.value })}
                placeholder="เช่น บุตรสาว, เพื่อนบ้าน"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">หมายเลขโทรศัพท์</label>
              <input
                id="new-contact-phone-input"
                type="text"
                value={newContact.phone}
                onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                placeholder="เช่น 089-xxxxxxx"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-teal-500"
              />
            </div>
            <div className="flex gap-2.5">
              <div className="flex items-center space-x-1 mb-2">
                <input
                  id="new-contact-primary-check"
                  type="checkbox"
                  checked={newContact.isPrimary}
                  onChange={e => setNewContact({ ...newContact, isPrimary: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-600">ผู้ดูแลหลัก</span>
              </div>
              <button
                id="save-new-contact-btn"
                type="button"
                onClick={handleAddContact}
                className="flex-1 py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-700 transition-colors cursor-pointer"
              >
                บันทึกรายชื่อ
              </button>
            </div>
          </div>
        )}

        {/* List of Contacts */}
        <div id="contacts-card-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((c, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                c.isPrimary
                  ? 'border-teal-500 bg-teal-50/20 shadow-xs'
                  : 'border-slate-150 bg-slate-50/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-slate-800">{c.name}</h4>
                    {c.isPrimary && (
                      <span className="bg-teal-500 text-white text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full">
                        ผู้ดูแลหลัก
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">ความสัมพันธ์: {c.relationship}</p>
                  <p className="text-xs text-slate-600 mt-2 font-mono font-bold flex items-center">
                    📞 {c.phone}
                  </p>
                </div>

                <div className="flex space-x-1">
                  {!c.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(index)}
                      title="ตั้งเป็นผู้ดูแลหลัก"
                      className="p-1 px-2 border border-slate-205 bg-white text-slate-600 hover:text-teal-600 hover:border-teal-200 rounded-lg text-[9px] font-semibold flex items-center transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteContact(index)}
                    title="ลบรายชื่อผู้ติดต่อ"
                    className="p-1.5 border border-red-100 bg-white hover:text-red-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 mt-4 pt-3 flex justify-between text-[11px] text-slate-400">
                <span>ช่องทางส่งโทรสาย</span>
                <span className="font-bold text-slate-500">โทรออกตรง / รับ SMS SOS</span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
