import React, { useState, useRef, useCallback } from 'react';
import Navbar from '../../../components/Navbar';

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface NutritionData {
  energy_kcal?: number;
  protein_g?: number;
  fat_g?: number;
  carbs_g?: number;
  fiber_g?: number;
  sugars_g?: number;
  calcium_mg?: number;
  iron_mg?: number;
  potassium_mg?: number;
  vitamin_c_mg?: number;
}

interface Detection {
  fruit: string;
  ripeness: string;
  ripeness_conf: number;
  final_weight_g: number;
  volume_cm3: number;
  nutrition: NutritionData;
  coin_detected: boolean;
  calories_kcal: number;
}

interface AnalysisResult {
  detections: Detection[];
  total_fruits: number;
  coin_detected: boolean;
  mm_per_pixel: number | null;
}

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'accent' | 'success' | 'error';
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function nowTimestamp(): string {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

function clamp100(v: number): number {
  return Math.min(100, Math.max(0, v));
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

const MetricBar: React.FC<{ label: string; progress: number }> = ({
  label,
  progress,
}) => (
  <div className="space-y-2">
    <div className="flex justify-between font-label text-[10px] uppercase text-zinc-500">
      <span>{label}</span>
      <span className={progress > 0 ? 'text-white' : ''}>
        {progress > 0 ? `${progress.toFixed(1)}%` : '0.00%'}
      </span>
    </div>
    <div className="h-1 bg-zinc-800 w-full overflow-hidden">
      <div
        className="h-full bg-accent transition-all duration-1000 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

/* ─── Main Page ──────────────────────────────────────────────────────────── */

const AnalysisPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: nowTimestamp(),
      message: 'INITIALIZING_CORE_KERNELS...',
      type: 'accent',
    },
    {
      timestamp: nowTimestamp(),
      message: 'OPTICAL_CALIBRATION_COMPLETE',
      type: 'info',
    },
    {
      timestamp: nowTimestamp(),
      message: 'LOADING_NEURAL_WEIGHTS: FRUIT_NET_V4.2',
      type: 'info',
    },
    {
      timestamp: nowTimestamp(),
      message: 'WAITING_FOR_PAYLOAD...',
      type: 'accent',
    },
  ]);

  const addLog = useCallback(
    (message: string, type: LogEntry['type'] = 'info') => {
      setLogs((prev) => [
        ...prev,
        { timestamp: nowTimestamp(), message, type },
      ]);
    },
    []
  );

  /* ── Spectral metrics derived from result ── */
  const spectral = React.useMemo(() => {
    if (!result || result.detections.length === 0)
      return { sugars: 0, fiber: 0, vitaminC: 0 };
    const det = result.detections[0];
    if (!det) return { sugars: 0, fiber: 0, vitaminC: 0 };
    const n = det.nutrition;
    // Normalize to 0-100 scale based on typical max values
    const sugarsMax = 30; // g, typical max
    const fiberMax = 10; // g
    const vitCMax = 200; // mg
    return {
      sugars: clamp100(((n.sugars_g ?? 0) / sugarsMax) * 100),
      fiber: clamp100(((n.fiber_g ?? 0) / fiberMax) * 100),
      vitaminC: clamp100(((n.vitamin_c_mg ?? 0) / vitCMax) * 100),
    };
  }, [result]);

  /* ── File selection ── */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setResult(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    addLog(`SAMPLE_LOADED: ${file.name.toUpperCase()}`, 'success');
    addLog('SCAN_READY — PRESS_ESTIMATE_TO_ANALYZE', 'accent');
  };

  const handleDiscard = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setResult(null);
    addLog('PAYLOAD_DISCARDED // AWAITING_NEW_SAMPLE', 'info');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ── Analysis API call ── */
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    addLog('INITIATING_NEURAL_SCAN...', 'accent');
    addLog('UPLOADING_PAYLOAD_TO_PIPELINE', 'info');

    const formData = new FormData();
    formData.append('file', selectedFile);

    const token = localStorage.getItem('fruitytics_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!res.ok) {
        const err = (await res.json()) as { detail?: string };
        addLog(`ERROR: ${String(err.detail ?? 'ANALYSIS_FAILED')}`, 'error');
        return;
      }

      const raw = await res.json();

      const data: AnalysisResult = {
        ...raw,
        detections: raw.detections.map((d: any) => ({
          fruit: d.fruit,
          ripeness: d.ripeness,
          ripeness_conf: d.ripeness_conf,
          final_weight_g: d.final_weight_g,
          volume_cm3: d.volume_cm3,
          coin_detected: d.coin_detected,

          nutrition: {
            energy_kcal: d.nutrition?.['Energy (kcal)'],
            protein_g: d.nutrition?.['Protein (g)'],
            fat_g: d.nutrition?.['Total Fat (g)'],
            carbs_g: d.nutrition?.['Carbohydrates (g)'],
            fiber_g: d.nutrition?.['Dietary Fiber (g)'],
            sugars_g: d.nutrition?.['Total Sugars (g)'],
            calcium_mg: d.nutrition?.['Calcium (mg)'],
            iron_mg: d.nutrition?.['Iron (mg)'],
            potassium_mg: d.nutrition?.['Potassium (mg)'],
            vitamin_c_mg: d.nutrition?.['Vitamin C (mg)'],
          },
        })),
      };

      setResult(data);

      addLog(
        `SCAN_COMPLETE — ${data.total_fruits} FRUIT(S) DETECTED`,
        'success'
      );

      data.detections.forEach((det) => {
        addLog(
          `${det.fruit.toUpperCase()} | ${det.ripeness.toUpperCase()} | ${(det.ripeness_conf * 100).toFixed(1)}% CONF | ${det.final_weight_g.toFixed(1)}G`,
          'accent'
        );
      });
      if (data.coin_detected)
        addLog('REFERENCE_COIN_DETECTED — SCALE_CALIBRATED', 'info');
    } catch {
      addLog('NETWORK_ERROR // BACKEND_UNREACHABLE', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* ── Log color map ── */
  const logColor: Record<LogEntry['type'], string> = {
    accent: '#FF6B00',
    success: '#22C55E',
    error: '#FF6B00',
    info: '#666',
  };

  const firstDet = result?.detections[0];

  /* ── Calculate total calories from all detections ── */
  const totalCalories = React.useMemo(() => {
    if (!result || result.detections.length === 0) return 0;
    return result.detections.reduce(
      (sum, det) => sum + (det.nutrition.energy_kcal ?? 0),
      0
    );
  }, [result]);

  /* ── Calculate total nutrition across all detections ── */
  const totalNutrition = React.useMemo(() => {
    if (!result || result.detections.length === 0) {
      return {
        energy_kcal: 0,
        protein_g: 0,
        fat_g: 0,
        carbs_g: 0,
        fiber_g: 0,
        sugars_g: 0,
        calcium_mg: 0,
        iron_mg: 0,
        potassium_mg: 0,
        vitamin_c_mg: 0,
      };
    }
    return {
      energy_kcal: result.detections.reduce(
        (sum, det) => sum + (det.nutrition.energy_kcal ?? 0),
        0
      ),
      protein_g: result.detections.reduce(
        (sum, det) => sum + (det.nutrition.protein_g ?? 0),
        0
      ),
      fat_g: result.detections.reduce(
        (sum, det) => sum + (det.nutrition.fat_g ?? 0),
        0
      ),
      carbs_g: result.detections.reduce(
        (sum, det) => sum + (det.nutrition.carbs_g ?? 0),
        0
      ),
      fiber_g: result.detections.reduce(
        (sum, det) => sum + (det.nutrition.fiber_g ?? 0),
        0
      ),
      sugars_g: result.detections.reduce(
        (sum, det) => sum + (det.nutrition.sugars_g ?? 0),
        0
      ),
      calcium_mg: result.detections.reduce(
        (sum, det) => sum + (det.nutrition.calcium_mg ?? 0),
        0
      ),
      iron_mg: result.detections.reduce(
        (sum, det) => sum + (det.nutrition.iron_mg ?? 0),
        0
      ),
      potassium_mg: result.detections.reduce(
        (sum, det) => sum + (det.nutrition.potassium_mg ?? 0),
        0
      ),
      vitamin_c_mg: result.detections.reduce(
        (sum, det) => sum + (det.nutrition.vitamin_c_mg ?? 0),
        0
      ),
    };
  }, [result]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      {/* ── Navbar ── */}
      <Navbar />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.raw,.tiff,.tif,.png,.jpg,.jpeg"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <main className="max-w-[1440px] mx-auto w-full pt-24 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
        {/* ── Left Column ── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Analysis Staging Area */}
          <section className="bg-surface relative border border-zinc-800 p-1 group overflow-hidden">
            <div className="absolute top-4 right-4 z-10 font-label text-[10px] text-accent bg-zinc-950 px-2 py-1">
              [ LIVE_FEED_ALPHA ]
            </div>

            <div className="bg-zinc-950 h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
              {!selectedFile ? (
                <div className="z-20 flex flex-col items-center gap-6">
                  <div className="w-16 h-16 border-2 border-accent/20 flex items-center justify-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-accent/40"
                    >
                      <path
                        d="M12 5V19M5 12H19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="square"
                      />
                    </svg>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-zinc-900 border border-zinc-700 text-foreground font-label text-sm px-12 py-5 hover:bg-zinc-800 transition-all active:scale-95 tracking-widest uppercase"
                  >
                    {'>>_INITIATE_IMAGE_STREAM'}
                  </button>
                  <p className="font-label text-[10px] text-zinc-600 uppercase tracking-tighter">
                    Formats: RAW, TIFF, PNG, JPG // Optical_Lock_Optional
                  </p>
                </div>
              ) : (
                <div className="z-20 w-full h-full flex flex-col items-center justify-center relative">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Uploaded sample"
                      className="max-h-[420px] max-w-full object-contain"
                    />
                  )}
                  <button
                    onClick={handleDiscard}
                    className="absolute bottom-4 text-zinc-500 font-label text-[10px] uppercase hover:text-white underline underline-offset-4"
                  >
                    Discard_And_Restart
                  </button>
                </div>
              )}

              {/* HUD Scan Line */}
              <div className="absolute inset-0 pointer-events-none origin-top mix-blend-overlay">
                <div className="w-full h-[1px] bg-accent/30 animate-scan"></div>
              </div>

              {!selectedFile && (
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRO1wQtOWAF5sNLfQnM5-5oAVBTMVypx_TYRini63hkm136A8hGLIztuzHejHHduZywsYYDwkMZDDl_b2MBeQB0a8s1eTusYrCOyaM-rdec_auZCSFOIqxJnICc_A_E7HLSnEpw0s3senEhepsaIYAPDTG4f1wJzceymaHFTngK7P2IOrRevqYzM6yk-IQkqy3_Idd7J28obJO3P-esT650NrU4VTPgmkXqJgoqe5vyd6GrV8gZDdUrrJbcBdGf1Gi2Esrg-Avxik"
                  alt="Analytical Microscope View"
                  className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale brightness-150"
                />
              )}
            </div>
          </section>

          {/* Real-time Telemetry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* System Log */}
            <div className="bg-surface border border-zinc-800 p-6 flex flex-col h-64">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-label text-[10px] text-zinc-500 tracking-[0.3em] uppercase">
                  System_Runtime_Log
                </h3>
                <div className="w-2 h-2 bg-accent animate-pulse"></div>
              </div>
              <div className="flex-1 font-label text-[10px] overflow-y-auto space-y-2 scrollbar-hide">
                {logs.map((log, i) => (
                  <p key={i}>
                    <span style={{ color: logColor[log.type] }}>
                      [ {log.timestamp} ]
                    </span>{' '}
                    <span
                      style={{
                        color:
                          log.type === 'error'
                            ? '#FF6B00'
                            : log.type === 'success'
                              ? '#22C55E'
                              : log.type === 'accent'
                                ? '#FF6B00'
                                : '#666',
                      }}
                    >
                      {log.message}
                    </span>
                  </p>
                ))}
              </div>
            </div>

            {/* Spectral Estimates */}
            <div className="bg-surface border border-zinc-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-label text-[10px] text-zinc-500 tracking-[0.3em] uppercase">
                  Spectral_Estimates
                </h3>
                <span className="font-label text-[10px] text-accent">
                  Unit: MG/100G
                </span>
              </div>
              <div className="space-y-6">
                <MetricBar label="MACRO: SUGARS" progress={spectral.sugars} />
                <MetricBar label="MACRO: FIBER" progress={spectral.fiber} />
                <MetricBar
                  label="MICRO: VITAMIN_C"
                  progress={spectral.vitaminC}
                />
              </div>
            </div>
          </div>

          {/* Detection Results Table */}
          {result && result.detections.length > 0 && (
            <section className="bg-surface border border-zinc-800 p-6">
              <h3 className="font-label text-[10px] text-zinc-500 tracking-[0.3em] uppercase mb-6">
                Detection_Results // {result.total_fruits} FRUIT(S)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full font-label text-[10px]">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-600 uppercase tracking-widest">
                      <th className="text-left pb-3 pr-4">Fruit</th>
                      <th className="text-left pb-3 pr-4">Ripeness</th>
                      <th className="text-right pb-3 pr-4">Conf%</th>
                      <th className="text-right pb-3 pr-4">Weight_G</th>
                      <th className="text-right pb-3 pr-4">Energy_Kcal</th>
                      <th className="text-right pb-3 pr-4">Protein_G</th>
                      <th className="text-right pb-3">VitC_Mg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.detections.map((det, i) => (
                      <tr
                        key={i}
                        className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors"
                      >
                        <td className="py-3 pr-4 text-accent font-bold">
                          {det.fruit.toUpperCase()}
                        </td>
                        <td className="py-3 pr-4 text-zinc-300">
                          {det.ripeness.toUpperCase()}
                        </td>
                        <td className="py-3 pr-4 text-right text-white">
                          {(det.ripeness_conf * 100).toFixed(1)}
                        </td>
                        <td className="py-3 pr-4 text-right text-zinc-300">
                          {det.final_weight_g.toFixed(1)}
                        </td>
                        <td className="py-3 pr-4 text-right text-zinc-300">
                          {det.nutrition.energy_kcal?.toFixed(1) ?? '—'}
                        </td>
                        <td className="py-3 pr-4 text-right text-zinc-300">
                          {det.nutrition.protein_g?.toFixed(1) ?? '—'}
                        </td>
                        <td className="py-3 text-right text-zinc-300">
                          {det.nutrition.vitamin_c_mg?.toFixed(1) ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {/* ── Right Column: Execution Control ── */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Total Estimated Calories */}
          <div className="bg-zinc-900 p-8 border-l-4 border-accent space-y-4">
            <p className="font-label text-[10px] text-accent tracking-widest uppercase">
              Energy_Aggregate
            </p>
            <h2 className="font-headline font-black text-4xl uppercase leading-none">
              {totalCalories > 0 ? `${totalCalories.toFixed(1)}` : '0'}
              <br />
              Total_Kcal
            </h2>
            <div className="flex gap-2 pt-4">
              <div className="bg-zinc-800 px-2 py-1 font-label text-[8px] text-zinc-500">
                {result && result.detections.length > 0
                  ? `${result.detections.length}_FRUITS_SCANNED`
                  : 'AWAITING_DATA'}
              </div>
              <div className="bg-zinc-800 px-2 py-1 font-label text-[8px] text-zinc-500">
                AVG_PER_FRUIT
              </div>
            </div>
          </div>

          {/* Execution Controls */}
          <div className="bg-surface border border-zinc-800 p-6 space-y-6">
            <h3 className="font-label text-[10px] text-zinc-500 tracking-[0.3em] uppercase">
              Execution_Controls
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => {
                  void handleAnalyze();
                }}
                disabled={!selectedFile || isAnalyzing}
                className={`w-full py-5 font-label font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-colors ${
                  selectedFile && !isAnalyzing
                    ? 'machined-gradient text-zinc-950 cursor-pointer'
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
              >
                {isAnalyzing ? 'ANALYZING...' : 'Estimate_Nutrition'}
              </button>
              <button
                onClick={handleDiscard}
                className="w-full bg-zinc-800 text-foreground py-5 font-label tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-zinc-700 transition-colors"
              >
                Recalibrate_Optics
              </button>
            </div>

            {!selectedFile && (
              <div className="flex items-start gap-4 p-4 bg-zinc-950/50">
                <div className="w-1 h-8 bg-zinc-700 flex-shrink-0"></div>
                <p className="font-label text-[10px] text-zinc-500 leading-tight">
                  SYSTEM_LOCKED.
                  PLEASE_UPLOAD_SAMPLE_DATA_TO_ENABLE_ESTIMATION_ENGINE.
                </p>
              </div>
            )}
          </div>

          {/* Hardware Telemetry / Nutrition Summary */}
          <div className="bg-surface border border-zinc-800 p-6">
            <h3 className="font-label text-[10px] text-zinc-500 tracking-[0.3em] uppercase mb-6">
              {result && result.detections.length > 0
                ? `Nutrition_Summary_Total`
                : 'Hardware_Telemetery'}
            </h3>
            <div className="space-y-4 font-label text-[10px]">
              {result && result.detections.length > 0 ? (
                <>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-600 uppercase">Energy</span>
                    <span className="text-accent">
                      {totalNutrition.energy_kcal?.toFixed(1) ?? '—'} kcal
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-600 uppercase">Protein</span>
                    <span className="text-white">
                      {totalNutrition.protein_g?.toFixed(1) ?? '—'} g
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-600 uppercase">Carbs</span>
                    <span className="text-white">
                      {totalNutrition.carbs_g?.toFixed(1) ?? '—'} g
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-600 uppercase">Fat</span>
                    <span className="text-white">
                      {totalNutrition.fat_g?.toFixed(1) ?? '—'} g
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-600 uppercase">Fiber</span>
                    <span className="text-white">
                      {totalNutrition.fiber_g?.toFixed(1) ?? '—'} g
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-600 uppercase">Sugars</span>
                    <span className="text-white">
                      {totalNutrition.sugars_g?.toFixed(1) ?? '—'} g
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-600 uppercase">Calcium</span>
                    <span className="text-white">
                      {totalNutrition.calcium_mg?.toFixed(1) ?? '—'} mg
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-600 uppercase">Iron</span>
                    <span className="text-white">
                      {totalNutrition.iron_mg?.toFixed(1) ?? '—'} mg
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-600 uppercase">Potassium</span>
                    <span className="text-white">
                      {totalNutrition.potassium_mg?.toFixed(1) ?? '—'} mg
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-600 uppercase">Vitamin_C</span>
                    <span className="text-white">
                      {totalNutrition.vitamin_c_mg?.toFixed(1) ?? '—'} mg
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-600 uppercase">GPU_Temp</span>
                    <span className="text-accent tracking-tighter">42.4°C</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-600 uppercase">RAM_Usage</span>
                    <span className="text-white tracking-tighter">12.8GB</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-600 uppercase">Link_State</span>
                    <span className="text-success tracking-tighter font-bold">
                      OPTIMAL
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `,
        }}
      />
    </div>
  );
};

export default AnalysisPage;
