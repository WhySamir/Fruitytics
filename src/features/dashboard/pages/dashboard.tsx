import React from 'react';
import Navbar from '../../../components/Navbar';

const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      {/* ── Shared Navbar ── */}
      <Navbar />

      <main className="max-w-[1440px] mx-auto w-full pt-24 pb-32 px-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Top Stats Row */}
        <section className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBlock label="Total_Samples" value="4,102" isAccent={false} />
          <StatBlock label="Avg_Confidence" value="98.4%" isAccent={true} />
          <StatBlock label="Uptime" value="99.99%" isAccent={false} />
          <StatBlock label="Storage_Index" value="0xA42" isAccent={false} />
        </section>

        {/* Main Data Visuals */}
        <section className="col-span-12 lg:col-span-8 bg-zinc-900 border border-zinc-800 p-8 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="font-headline font-black uppercase tracking-tighter text-3xl">Nutrient_Trends_Over_Time</h2>
              <p className="font-label text-[10px] text-zinc-500 mt-2 uppercase">Sensory_Input_Array: 0x882_Validated</p>
            </div>
            <div className="bg-accent/10 border border-accent/20 px-3 py-1 font-label text-[10px] text-accent animate-pulse">
              LIVE_FEED
            </div>
          </div>

          <div className="h-64 w-full relative">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
              {/* Grid Lines */}
              {[0, 50, 100, 150, 200].map(y => (
                <line key={y} x1="0" x2="1000" y1={y} y2={y} stroke="#27272A" strokeWidth="1" />
              ))}
              {/* Data Line */}
              <path 
                d="M0,150 L100,140 L200,160 L300,120 L400,130 L500,80 L600,90 L700,50 L800,60 L900,20 L1000,30" 
                fill="none" 
                stroke="#F97316" 
                strokeWidth="3"
                className="drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
              />
              <path 
                d="M0,150 L100,140 L200,160 L300,120 L400,130 L500,80 L600,90 L700,50 L800,60 L900,20 L1000,30 V200 H0 Z" 
                fill="#F97316" 
                fillOpacity="0.05" 
              />
            </svg>
          </div>
          <div className="grid grid-cols-5 mt-6 font-label text-[10px] text-zinc-600 uppercase tracking-widest">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span className="text-right">Synchronized_Now</span>
          </div>
        </section>

        {/* System Health Sidebar */}
        <section className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-8 space-y-8">
            <h3 className="font-label text-[10px] text-zinc-500 tracking-[0.3em] uppercase underline underline-offset-8">System_Integrity</h3>
            <div className="space-y-6 font-label">
              <HealthRow label="GPU_Temp" value="42.4°C" isAccent />
              <HealthRow label="Model" value="Fruit_Net_V4.2" />
              <HealthRow label="Core_Sync" value="Active" isSuccess />
            </div>
            <div className="h-32 bg-zinc-950 relative overflow-hidden group">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjaxpeQd77oHOz34NOOemTKROS8y-WDPgE5BmVOIUwkoKpUNd4VRor_yRwQprVqZYT9gCohylsg12CGdrK5OXMaIpumSiITeMWvoOq2O30Hoxxi4KkhGnqFKSKARbJI2WESae-v-OJZM8KLjYs-AUEpvD2q_s0LyZapB7C0H3sZt5OsITWFAk8DpLGbH30De8MsdtK0oHaL5sgB0K61fhtIohJqTtGYwvNpYneT3zjhIACKJMLGsHkDOG3ZcKwFQWyQALTYnZsNIo"
                alt="3D Wireframe Fruit Cell"
                className="w-full h-full object-cover grayscale opacity-20 group-hover:opacity-40 transition-opacity"
              />
              <div className="absolute inset-0 bg-accent/5 mix-blend-overlay"></div>
            </div>
          </div>
        </section>

        {/* Transaction Logs */}
        <section className="col-span-12 space-y-8">
          <div className="flex items-end gap-4">
            <h2 className="font-headline font-black uppercase text-3xl leading-none">Transaction_Logs</h2>
            <div className="h-[2px] flex-grow bg-zinc-900 mb-1"></div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <LogEntry id="0x41" target="Dragonfruit" time="12:44:02" confidence="99.8%" isAccent />
            <LogEntry id="0x3F" target="Mangosteen" time="11:20:15" confidence="97.2%" />
            <LogEntry id="0x3E" target="Pomelo" time="09:15:44" confidence="98.9%" isAccent />
            <LogEntry id="0x3D" target="Durian" time="08:02:11" confidence="94.5%" />
          </div>
        </section>
      </main>

      {/* Mobile Nav Overlay */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-zinc-950 border-t border-zinc-800 py-4 px-6">
         <div className="flex flex-col items-center gap-1 text-zinc-600">
            <div className="w-1 h-1 bg-zinc-800"></div>
            <span className="font-label text-[8px] uppercase">Research</span>
         </div>
         <div className="flex flex-col items-center gap-1 text-accent">
            <div className="w-4 h-[2px] bg-accent"></div>
            <span className="font-label text-[8px] uppercase font-bold tracking-widest">Archives</span>
         </div>
         <div className="flex flex-col items-center gap-1 text-zinc-600">
            <div className="w-1 h-1 bg-zinc-800"></div>
            <span className="font-label text-[8px] uppercase">Model</span>
         </div>
      </nav>
    </div>
  );
};

const StatBlock: React.FC<{ label: string; value: string; isAccent?: boolean }> = ({ label, value, isAccent }) => (
  <div className="bg-zinc-900 p-8 border border-zinc-800 hover:border-zinc-700 transition-colors group">
    <div className="font-label text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-4">{label}</div>
    <div className={`font-label text-4xl font-black ${isAccent ? 'text-accent' : 'text-white'}`}>{value}</div>
  </div>
);

const HealthRow: React.FC<{ label: string; value: string; isAccent?: boolean; isSuccess?: boolean }> = ({ label, value, isAccent, isSuccess }) => (
  <div className="flex justify-between items-center py-2 border-b border-zinc-800">
    <span className="text-zinc-500 text-[10px] uppercase">{label}</span>
    <span className={`text-[10px] font-bold ${isAccent ? 'text-accent' : isSuccess ? 'text-success' : 'text-zinc-200'}`}>
      {value}
    </span>
  </div>
);

const LogEntry: React.FC<{ id: string; target: string; time: string; confidence: string; isAccent?: boolean }> = ({ id, target, time, confidence, isAccent }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-6 flex flex-col md:flex-row justify-between items-center group hover:bg-zinc-800/50 transition-colors cursor-pointer">
    <div className="flex items-center gap-6 w-full md:w-auto">
      <span className="font-label text-accent text-sm font-bold">{id}</span>
      <span className="font-label text-white text-sm font-bold tracking-[0.2em] uppercase">{target}</span>
    </div>
    <div className="flex items-center gap-12 w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-end">
      <span className="font-label text-[10px] text-zinc-600">{time}</span>
      <div className={`px-4 py-1 font-label text-[10px] font-bold ${isAccent ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
        {confidence} CONF
      </div>
    </div>
  </div>
);

export default DashboardPage;
