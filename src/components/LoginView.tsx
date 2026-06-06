import React, { useState } from 'react';
import { ShieldCheck, User, Lock, HeartPulse, Sparkles } from 'lucide-react';
import { UserSession } from '../types';

interface LoginViewProps {
  onLoginSuccess: (session: UserSession) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'caregiver' | 'vol_health'>('caregiver');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('กรุณากรอกข้อมูลอีเมลและรหัสผ่านให้ครบถ้วน');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      // Simulate successful validation
      onLoginSuccess({
        email: email,
        password: password,
        role: role,
        name: role === 'caregiver' ? 'คุณสมชาย มีความสุข (ญาติผู้ดูแล)' : 'คุณสายใจ แก้วดี (อสม. ประจำหมู่บ้าน)',
        villageCode: role === 'vol_health' ? 'VILL-M3-M5' : undefined
      } as any);
      setIsLoading(false);
    }, 850);
  };

  const handleQuickDemo = (demoRole: 'caregiver' | 'vol_health') => {
    setIsLoading(true);
    setTimeout(() => {
      if (demoRole === 'caregiver') {
        onLoginSuccess({
          email: 'somchai@caregiver.com',
          role: 'caregiver',
          name: 'คุณสมชาย มีความสุข (ญาติผู้ดูแล)'
        });
      } else {
        onLoginSuccess({
          email: 'saijai.h@osormor.go.th',
          role: 'vol_health',
          name: 'คุณสายใจ แก้วดี (อสม. ประจำหมู่บ้าน)',
          villageCode: 'VILL-M3-M5'
        });
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div id="login-container" className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans">
      
      {/* Brand Sidebar (Visible on large screens) */}
      <div id="login-brand-sidebar" className="md:w-1/2 bg-gradient-to-tr from-teal-600 via-emerald-600 to-cyan-700 text-white flex flex-col justify-between p-8 md:p-16 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl"></div>
        
        {/* Logo and Brand Header */}
        <div className="flex items-center space-x-3 z-10">
          <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
            <HeartPulse className="w-8 h-8 text-emerald-100 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">CareBand</h1>
            <p className="text-xs text-teal-100 tracking-wider">Elder Safety & Fall Detection IoT</p>
          </div>
        </div>

        {/* Feature Highlights Promo */}
        <div className="my-auto py-12 md:py-0 z-10 max-w-lg">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-3 py-1 mb-6 text-sm text-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>เทคโนโลยีดูแลผู้ทรงวัยด้วย AI และ IoT</span>
          </div>
          
          <h2 className="text-3.5xl font-bold leading-tight mb-6 font-sans">
            ระบบติดตามสุขภาพและตรวจจับการหกล้มอัจฉริยะ แบบเรียลไทม์
          </h2>
          
          <p className="text-teal-50/90 text-md leading-relaxed mb-8">
            นวัตกรรมสายรัดข้อมืออัจฉริยะเชื่อมต่อคลาวด์ ส่งตรงสัญญาณความละเอียดสูง คอยปกป้องแจ้งเตือนสัญญาณชีพผิดปกติและอุบัติเหตุหกล้ม พร้อมเชื่อมทีมญาติและ เจ้าหน้าที่ อสม. และหน่วยกู้ภัยได้ทันท่วงทีตลอด 24 ชั่วโมง
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <span className="block text-2xl font-extrabold text-emerald-300">ติตตาม 24 ชม.</span>
              <span className="text-xs text-teal-100">ชีพจร อัตราก้าว แบตเตอรี่ ตำแหน่งพิกัด</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <span className="block text-2xl font-extrabold text-rose-300">AI Fall Alert</span>
              <span className="text-xs text-teal-100">ตรวจวิเคราะห์การล้มด้วยระบบ 3-Axis Gyro</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-teal-200/60 text-xs z-10 flex flex-col sm:flex-row sm:justify-between">
          <span>© 2026 CareBand Platform. สงวนลิขสิทธิ์</span>
          <span className="mt-1 sm:mt-0">ระบบสนับสนุนสาธารณสุขทางไกล (รพ.สต.)</span>
        </div>
      </div>

      {/* Login Screen Form Panel */}
      <div id="login-form-panel" className="md:w-1/2 flex items-center justify-center p-6 md:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">เข้าสู่ระบบเพื่อใช้งาน</h3>
            <p className="text-slate-500 mt-2 text-sm">
              เลือกบทบาทและกรอกข้อมูลผู้ใช้งานสำหรับญาติ หรือ อสม. เพื่อเชื่อมกล่องข้อมูล
            </p>
          </div>

          {/* Role selector tab */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              id="role-caregiver-btn"
              type="button"
              onClick={() => { setRole('caregiver'); setError(''); }}
              className={`flex-1 flex items-center justify-center py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === 'caregiver'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              ญาติผู้ดูแล / ผู้ดูแลหลัก
            </button>
            <button
              id="role-vol-health-btn"
              type="button"
              onClick={() => { setRole('vol_health'); setError(''); }}
              className={`flex-1 flex items-center justify-center py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === 'vol_health'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              อสม. ประจำหมู่บ้าน
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {error && (
              <div id="login-error-msg" className="p-3 bg-red-50 text-red-600 rounded-lg text-xs border border-red-100 font-medium flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-2 flex-shrink-0"></span>
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2">
                อีเมลผู้ใช้งาน (Email Address)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="login-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none transition-colors text-sm text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest">
                  รหัสผ่าน (Password)
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('ระบบเดโม: คลิกปุ่มทดสอบระบบด่วนเพื่อทดลองใช้งาน'); }} className="text-xs font-medium text-teal-600 hover:underline">
                  ลืมรหัสผ่าน?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="login-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none transition-colors text-sm text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 bg-slate-900 border border-slate-800 text-white rounded-xl font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                isLoading ? 'bg-slate-700 cursor-not-allowed opacity-80' : 'hover:bg-teal-700 hover:border-teal-800'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>กำลังตรวจสอบข้อมูล...</span>
                </>
              ) : (
                <span>เข้าสู่ระบบด้วยบัญชี {role === 'caregiver' ? 'ญาติ' : 'อสม.'}</span>
              )}
            </button>
          </form>

          {/* Quick Demo Assist Division */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-150"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-400 font-semibold uppercase tracking-wider">หรือ ทดสอบระบบทดลอง</span>
            <div className="flex-grow border-t border-slate-150"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              id="demo-caregiver-btn"
              type="button"
              onClick={() => handleQuickDemo('caregiver')}
              disabled={isLoading}
              className="py-3 px-4 bg-teal-50/70 hover:bg-teal-50 border border-teal-100 hover:border-teal-200 text-teal-800 text-xs font-semibold rounded-xl text-center transition-all cursor-pointer shadow-xs flex flex-col items-center gap-1.5"
            >
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-teal-700" />
              </div>
              <span>ทดลองเป็น: ญาติสมชาย</span>
            </button>

            <button
              id="demo-osormor-btn"
              type="button"
              onClick={() => handleQuickDemo('vol_health')}
              disabled={isLoading}
              className="py-3 px-4 bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-100 hover:border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl text-center transition-all cursor-pointer shadow-xs flex flex-col items-center gap-1.5"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <span>ทดลองเป็น: อสม. สายใจ</span>
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-400">
              * ข้อมูลส่วนบุคคล สุขภาพ และอุบัติเหตุเป็นข้อมูลที่จำลองขึ้นเพื่อประกอบการสาธิตเท่านั้น
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
