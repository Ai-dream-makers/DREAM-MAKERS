import { useState } from 'react';
import { Footprints, Heart, Moon, Zap, Award, BarChart2, Activity, Clock } from 'lucide-react';
import { HealthStats } from '../types';

interface HealthStatsViewProps {
  stats: HealthStats;
}

export default function HealthStatsView({ stats }: HealthStatsViewProps) {
  const [activeChartTab, setActiveChartTab] = useState<'steps' | 'heart' | 'sleep'>('steps');

  // SVG parameters
  const chartWidth = 500;
  const chartHeight = 180;
  const padding = 30;

  // Render Steps Bar Chart
  const renderStepsChart = () => {
    const data = stats.weeklySteps;
    const maxVal = Math.max(...data.map(d => d.count), 6000);
    const graphWidth = chartWidth - padding * 2;
    const graphHeight = chartHeight - padding * 2;
    const barWidth = graphWidth / data.length - 12;

    return (
      <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
        {/* Horizontal grid lines */}
        <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" />
        <line x1={padding} y1={padding + graphHeight / 2} x2={chartWidth - padding} y2={padding + graphHeight / 2} stroke="#f1f5f9" strokeWidth="1" />
        <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#e2e8f0" strokeWidth="1.5" />

        {/* Draw bars */}
        {data.map((day, idx) => {
          const barHeight = day.count > 0 ? (day.count / maxVal) * graphHeight : 0;
          const x = padding + idx * (graphWidth / data.length) + 6;
          const y = chartHeight - padding - barHeight;
          const isTargetMet = day.count >= stats.stepsTarget;

          return (
            <g key={idx} className="group cursor-pointer">
              {/* Highlight bar base */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight > 0 ? barHeight : 2}
                rx="4"
                fill={isTargetMet ? '#14b8a6' : '#2dd4bf'}
                opacity={day.count === 0 ? 0.2 : 0.85}
                className="hover:opacity-100 transition-all duration-150"
              />
              
              {/* Tooltip Hover value */}
              {day.count > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  fill="#0f172a"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {day.count}
                </text>
              )}

              {/* Day Labels */}
              <text
                x={x + barWidth / 2}
                y={chartHeight - 10}
                fill="#64748b"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                {day.day}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // Render Heart Rate Line Chart
  const renderHeartRateChart = () => {
    const data = stats.hourlyHeartRate;
    const rates = data.map(d => d.rate);
    const maxVal = Math.max(...rates, 110);
    const minVal = Math.min(...rates, 60) - 10;
    const graphWidth = chartWidth - padding * 2;
    const graphHeight = chartHeight - padding * 2;

    const points = data.map((pt, idx) => {
      const x = padding + (idx * (graphWidth / (data.length - 1)));
      const y = chartHeight - padding - ((pt.rate - minVal) / (maxVal - minVal)) * graphHeight;
      return { x, y, ...pt };
    });

    const pathData = points.reduce((path, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, '');

    return (
      <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
        {/* Horizontal zones */}
        <rect x={padding} y={padding} width={graphWidth} height={graphHeight} fill="#fff5f5" opacity="0.4" />
        <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#fee2e2" strokeWidth="1" />
        <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#e2e8f0" strokeWidth="1.5" />

        {/* Continuous path wave */}
        <path
          d={pathData}
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Draw interactive vertices and labels */}
        {points.map((pt, idx) => (
          <g key={idx} className="group cursor-pointer">
            <circle cx={pt.x} cy={pt.y} r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
            <circle cx={pt.x} cy={pt.y} r="8" fill="#ef4444" opacity="0" className="group-hover:opacity-15" />
            
            <text
              x={pt.x}
              y={pt.y - 8}
              fill="#ef4444"
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {pt.rate}
            </text>

            <text
              x={pt.x}
              y={chartHeight - 10}
              fill="#64748b"
              fontSize="8"
              fontWeight="semibold"
              textAnchor="middle"
            >
              {pt.hour}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  // Render Sleep hours Bar Chart
  const renderSleepChart = () => {
    const data = stats.sleepHistory;
    const maxVal = 10;
    const graphWidth = chartWidth - padding * 2;
    const graphHeight = chartHeight - padding * 2;
    const barWidth = graphWidth / data.length - 24;

    return (
      <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
        <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" />
        <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#e2e8f0" strokeWidth="1.5" />

        {data.map((item, idx) => {
          const barHeight = (item.hours / maxVal) * graphHeight;
          const x = padding + idx * (graphWidth / data.length) + 12;
          const y = chartHeight - padding - barHeight;

          return (
            <g key={idx} className="group cursor-pointer">
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="3"
                fill="#6366f1"
                opacity="0.8"
                className="hover:opacity-100 transition-opacity"
              />
              <text
                x={x + barWidth / 2}
                y={y - 6}
                fill="#4338ca"
                fontSize="8"
                fontWeight="bold"
                textAnchor="middle"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {item.hours} ชม.
              </text>
              <text
                x={x + barWidth / 2}
                y={chartHeight - 10}
                fill="#64748b"
                fontSize="8"
                fontWeight="semibold"
                textAnchor="middle"
              >
                {item.date}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div id="health-stats-view" className="space-y-6">
      
      {/* Three Pillars Summary Cards */}
      <div id="stats-summary-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Step Progression card */}
        <div id="health-stat-steps-pill" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
            <Footprints className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">จำนวนก้าวเดินเฉลี่ย</span>
            <h4 id="stat-steps-current" className="text-2xl font-black text-slate-800">{stats.stepsCount} ก้าว</h4>
            <p className="text-slate-400 text-xs mt-0.5">เป้าหมายประจำวัน: {stats.stepsTarget} ก้าว</p>
          </div>
        </div>

        {/* Avg Heart rate card */}
        <div id="health-stat-heart-pill" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
            <Heart className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">อัตราการเต้นหัวใจเฉลี่ย</span>
            <h4 id="stat-heart-avg" className="text-2xl font-black text-slate-800">{stats.avgHeartRate} bpm</h4>
            <p className="text-slate-400 text-xs mt-0.5">ต่ำสุด/สูงสุดวันนี้: {stats.minHeartRate}-{stats.maxHeartRate} bpm</p>
          </div>
        </div>

        {/* Sleep duration card */}
        <div id="health-stat-sleep-pill" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Moon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">ระยะเวลาการนอนสะท้อน</span>
            <h4 id="stat-sleep-hours" className="text-2xl font-black text-slate-800">{stats.sleepHours} ชม.</h4>
            <p className="text-indigo-600 text-xs mt-0.5 font-semibold">หลับลึก {stats.deepSleepPercent}% | หลับฝัน {stats.lightSleepPercent}%</p>
          </div>
        </div>

      </div>

      {/* Main Chart Graphic Panel */}
      <div id="major-analytics-card" className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6">
        
        {/* Segmented control navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">วิเคราะห์ลำดับกิจกรรม (Advanced Bio-Analytics Map)</h3>
            <p className="text-xs text-slate-400">กรุณาเลือกดัชนีชี้วัดเพื่อซูมดูกราฟระยะความชันสัปดาห์ปัจจุบัน</p>
          </div>

          <div className="flex p-0.5 bg-slate-100 rounded-xl max-w-sm">
            <button
              id="chart-steps-tab"
              onClick={() => setActiveChartTab('steps')}
              className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartTab === 'steps' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              ก้าวเดิน
            </button>
            <button
              id="chart-heart-tab"
              onClick={() => setActiveChartTab('heart')}
              className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartTab === 'heart' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              ชีพจร
            </button>
            <button
              id="chart-sleep-tab"
              onClick={() => setActiveChartTab('sleep')}
              className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartTab === 'sleep' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              การนอน
            </button>
          </div>
        </div>

        {/* Display Active SVG chart and details */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          
          <div className="lg:col-span-3 aspect-[2.5/1] bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex items-center justify-center">
            {activeChartTab === 'steps' && renderStepsChart()}
            {activeChartTab === 'heart' && renderHeartRateChart()}
            {activeChartTab === 'sleep' && renderSleepChart()}
          </div>

          {/* Context Explainer card on the right */}
          <div className="lg:col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-4 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">คำอธิบายจากผู้เชี่ยวชาญ AI</span>
            
            {activeChartTab === 'steps' && (
              <div className="space-y-3">
                <p className="leading-relaxed text-slate-600">
                  สถิติรายงาน <b>จำนวนก้าวเดินใน 7 วัน</b> แสดงแนวโน้มสม่ำเสมอ การย่างเท้าที่สูงช่วยลดความตึงแน่นในข้อสะโพกและเอ็นเข่า การบรรลุเป้าหมายถือว่าสอดคล้องกับเกณฑ์ส่งเสริมสุขภาพกระทรวงสาธารณสุข
                </p>
                <div className="flex items-center space-x-1.5 text-xs text-teal-700">
                  <Award className="w-4 h-4" />
                  <b>บรรลุเป้าหมาย 4 จาก 6 วัน</b>
                </div>
              </div>
            )}

            {activeChartTab === 'heart' && (
              <div className="space-y-3">
                <p className="leading-relaxed text-slate-600">
                  กราฟ <b>ช่วงชีพจรรายชั่วโมง</b> พบจุดสูงสุด 128 bpm ช่วงเที่ยงวันสอดคล้องกับอุณหภูมิร่างกายและพฤติกรรมการออกแรงเดินตลาด เช้ามืดชีพจรต่ำ 61 bpm ระบุถึงสภาวะหลับลึกที่ปลอดภัยและหัวใจได้ผ่อนคลายเต็มร้อย
                </p>
                <div className="flex items-center space-x-1.5 text-xs text-rose-750">
                  <Zap className="w-4 h-4" />
                  <b>หัวใจเต้นจังหวะสมบูรณ์</b>
                </div>
              </div>
            )}

            {activeChartTab === 'sleep' && (
              <div className="space-y-3">
                <p className="leading-relaxed text-slate-600">
                  <b>ชั่วโมงและคุณภาพการนอน</b> เฉลี่ย 7.2 ชั่วโมงสอดคล้องกับวัยผู้ทรงอายุ สัดส่วนหลับลึก 28% เป็นการพักฟื้นระบบประสาทและซ่อมแซมสมองที่ดีมาก ไม่มีอาการสะดุ้งตื่นกล้ามเนื้อเกร็งตัวในช่วงกลางค่ำ
                </p>
                <div className="flex items-center space-x-1.5 text-xs text-indigo-755">
                  <Clock className="w-4 h-4" />
                  <b>ประสิทธิภาพการนอนสมดุล</b>
                </div>
              </div>
            )}

            <p className="text-[10px] text-slate-400 border-t border-slate-200/60 pt-3 italic">
              * ข้อมูลข้างต้นถูกกรองสัญญาณรบกวนคลื่นรัวเรียบร้อยแล้ว
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
