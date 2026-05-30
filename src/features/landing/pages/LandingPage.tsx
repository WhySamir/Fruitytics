import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* ── Shared Navbar ── */}
      <Navbar />

           <main className="flex-grow pt-22 pb-24 px-3 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Content */}
        <div className=" flex flex-col gap-8   justify-end h-full ">
          <div className="space-y-6">
            <div className="font-label text-accent text-xs tracking-[0.3em] uppercase">
              FRUITYTICS DEEP SCAN
            </div>
            <h2 className="text-6xl md:text-7xl font-black leading-[0.9] tracking-tighter uppercase font-headline">
              Precision Nutrition <br />
              <span className="text-muted">Through Optical</span> <br />
              Analysis.
            </h2>
          </div>

          {/* <div className="bg-zinc-900 border-l-4 border-accent p-8 space-y-4 max-w-md">
            <p className="font-label text-sm leading-relaxed text-zinc-400">
              OBJECTIVE: DECOUPLE NUTRITIONAL UNCERTAINTY FROM PRODUCE CONSUMPTION. USING HIGH-FIDELITY OPTICAL MAPPING AND NEURAL ESTIMATION.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
              <div>
                <p className="font-label text-[10px] text-zinc-600 uppercase">Input_Stream</p>
                <p className="font-label text-xs">PHYTO_DATA_8K</p>
              </div>
              <div>
                <p className="font-label text-[10px] text-zinc-600 uppercase">Latency</p>
                <p className="font-label text-xs">0.004 MS</p>
              </div>
            </div>
          </div> */}

          <button
            onClick={() => navigate('/analysis')}
            className="machined-gradient w-fit group relative inline-flex items-center gap-4 px-12 py-6 text-zinc-950 font-label font-black text-xl tracking-widest uppercase transition-all hover:gap-6 active:scale-95"
          >
            Initialize Analysis
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:translate-x-2">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="3" strokeLinecap="square"/>
            </svg>
          </button>
        </div>

        {/* Right Side: Hero Image and Technical Overlays */}
        <div className="relative group h-[90%]">
          <div className="relative  overflow-hidden border border-zinc-800">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGgQtOHjxWjoAHAFrwz8MDC2GI5dV8r1quc4BwSeNfl9CJBS2qO0eMdGDrPCDKk1gH4-7GMIyiHm-N5yQfCjp67Qscl0VbjJe8DWVL3PU-b8u7MHsgt22pW7I4lxdeWuLRjMsw_3Gmb-Y0SpXX3G-yCwBAcbaMXbvGy7zWf-OanParCDwrdN_Dl0t3wwxZbYxI65cxdH32Q9rvy1kwnAx1ye74oxot7NXqjA1ysGevTMzLEFEVDsb8kG55vUqyfh8xS1DDcr6GhKk"
              alt="Structural Dragonfruit Analysis"
              className="w-full h-[80%] object-cover grayscale brightness-110 contrast-125 transition-transform duration-700 group-hover:scale-105"
            />
            {/* <div className="absolute inset-0 bg-accent/5 mix-blend-overlay"></div> */}

            {/* Technical Scanning Laser */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="w-full h-[2px] bg-accent shadow-[0_0_15px_#FF6B00] absolute top-[-2px] animate-scan"></div>
            </div>

            {/* Corner Markers */}
            <div className="absolute top-4 left-4 font-label text-[10px] text-white/40 space-y-1">
              <p> DATASET: Nutrition 5k</p>
              <p>MODEL: Convolution Neural Network</p>
              {/* <p>
                CONFIDENCE: 99.4%</p> */}


            </div>
          </div>

          <div className="absolute -bottom-24 -right-8 w-48 h-48 border-r border-b border-accent/30 pointer-events-none"></div>
          <div className="absolute -top-8 -left-8 w-48 h-48 border-l border-t border-accent/30 pointer-events-none"></div>
        </div>
      </main>

 

      {/* Lab Metadata Footer */}
      <footer className="px-6 py-12 border-t border-zinc-900 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-end">
          <div className="space-y-4 font-label">
            <div className="text-accent text-sm font-black">SYSTEM_OVERSIGHT</div>
            <div className="text-zinc-600 text-[10px] leading-relaxed uppercase tracking-widest">
              Automated nutrition estimation platform — Fruitytics. All data points are calculated via non-destructive optical mapping.
            </div>
          </div>

          <div className="space-y-4 font-label text-center md:text-right md:col-span-2">
            <div className="text-zinc-600 text-[10px] uppercase tracking-widest">
              © 2026 FRUITYTICS. ALL RIGHTS RESERVED.
            </div>
            <div className="flex justify-center md:justify-end gap-8 text-[10px] text-zinc-500 uppercase tracking-tighter">
              <a href='http://localhost:8000/docs' target="_blank" rel="noopener noreferrer" className="hover:text-accent cursor-pointer">API DOCUMENTATION</a>
              <a href='http://localhost:8000/docs' target="_blank" rel="noopener noreferrer" className="hover:text-accent cursor-pointer">SYSTEM ARCHITECTURE</a>
            </div>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: -2px; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}} />
    </div>
  );
};

export default LandingPage;
