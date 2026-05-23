import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMusic } from "../context/MusicContext";
import { 
  X, 
  Sparkles, 
  Music, 
  ListMusic, 
  Languages, 
  HelpCircle,
  Radio,
  FileAudio
} from "lucide-react";

export default function LyricsPane() {
  const {
    currentTrack,
    lyrics,
    isLyricsOpen,
    setIsLyricsOpen,
    activeLyricIndex,
    isLoadingLyrics,
    seekTo,
    currentTime,
    isLyricsArabicHD,
    setIsLyricsArabicHD,
    audioAnalyserRef
  } = useMusic();

  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Auto scroll to active lyric line nicely
  useEffect(() => {
    if (activeLineRef.current && scrollContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest"
      });
    }
  }, [activeLyricIndex]);

  // Realtime Web Audio frequency visualization drawing routine on Canvas
  useEffect(() => {
    if (!isLyricsOpen) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = audioAnalyserRef.current;
    const bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    // Dynamic sizing based on resize observer or layout boundaries
    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = 120;

    const draw = () => {
      animFrameIdRef.current = requestAnimationFrame(draw);

      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Mock fine sinusoidal ambient waves if audio context is locked
        const t = Date.now() * 0.003;
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.max(0, Math.sin(i * 0.15 + t) * 45 + 50 + Math.random() * 10);
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create rich color gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "rgba(52, 211, 153, 0.45)"); // Emerald-400
      gradient.addColorStop(0.5, "rgba(34, 211, 238, 0.6)");  // Cyan-400
      gradient.addColorStop(1, "rgba(52, 211, 153, 0.45)");

      ctx.fillStyle = gradient;

      const barWidth = (canvas.width / bufferLength) * 1.6;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.9 + 5;

        // Custom rounded bars
        ctx.beginPath();
        ctx.roundRect(x, canvas.height - barHeight, barWidth - 2, barHeight, [4, 4, 0, 0]);
        ctx.fill();

        x += barWidth;
      }
    };

    draw();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isLyricsOpen, audioAnalyserRef, currentTrack]);

  if (!isLyricsOpen || !currentTrack) return null;

  return (
    <div className="fixed inset-0 bg-[#07070a]/98 z-40 flex flex-col font-sans select-none overflow-hidden text-white">
      {/* Background artwork deeply blurred for high luxury feel */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 blur-[130px] pointer-events-none scale-125"
        style={{ backgroundImage: `url(${currentTrack.album.images[0]?.url})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07070a]/40 via-[#07070a]/92 to-[#07070a] pointer-events-none" />

      {/* Modern Top Header bar */}
      <header className="relative z-10 h-20 px-8 flex items-center justify-between border-b border-white/5 bg-[#0a0a0f]/40 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div>
            <span className="text-[10px] font-mono text-emerald-400 font-extrabold uppercase tracking-widest block leading-none mb-0.5">
              LIRIK MODE &bull; MASTERING SOUND 8K
            </span>
            <h3 className="text-sm font-bold text-gray-300">
              Sinkronisasi Musik Sebenarnya
            </h3>
          </div>
        </div>

        {/* Translation Mode Selector Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsLyricsArabicHD(!isLyricsArabicHD)}
            className={`px-4 py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer border ${
              isLyricsArabicHD
                ? "bg-emerald-500 text-black border-emerald-500 shadow-md"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>Terjemahan Indonesia: {isLyricsArabicHD ? "AKTIF" : "NONAKTIF"}</span>
          </button>

          {/* Close Panel button */}
          <button
            onClick={() => setIsLyricsOpen(false)}
            className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Structural split layout */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden px-8 py-6 gap-8">
        
        {/* Left Info Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between items-center bg-[#0d0d14]/50 border border-white/5 p-6 rounded-3xl h-full select-none overflow-y-auto">
          <div className="w-full flex flex-col items-center text-center">
            {/* Master artwork */}
            <img
              src={currentTrack.album.images[0]?.url}
              alt={currentTrack.name}
              referrerPolicy="no-referrer"
              className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-3xl shadow-2xl border border-white/10 mb-5 relative z-10"
            />
            
            <h2 className="text-xl font-extrabold leading-snug tracking-tight text-white line-clamp-2">
              {currentTrack.name}
            </h2>
            <p className="text-xs text-emerald-400 font-semibold font-sans mt-1">
              {currentTrack.artists[0]?.name}
            </p>
            <p className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-wider mt-0.5">
              {currentTrack.album.name}
            </p>
          </div>

          {/* AI generated song meaning card by Gemini */}
          <div className="w-full bg-[#0a0a0f] border border-emerald-500/10 p-5 rounded-2xl text-left shadow-lg mt-6">
            <h4 className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest mb-2.5 flex items-center gap-1.5 border-b border-white/5 pb-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Analisis Makna Lagu (Gemini AI)</span>
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed font-sans font-medium">
              {isLoadingLyrics ? (
                <span className="italic animate-pulse">Menghubungkan kecerdasan resonansi...</span>
              ) : lyrics?.meaning ? (
                lyrics.meaning
              ) : (
                "Sistem 8K sedang menganalisis instrumen dan frekuensi beat."
              )}
            </p>
          </div>

          {/* Web Audio Live visualizer Canvas container */}
          <div className="w-full mt-6 bg-[#09090f] border border-white/5 rounded-2xl p-3 flex flex-col gap-1 shadow-inner shrink-0">
            <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 font-bold px-1">
              <span>8K DECODER REALTIME WAVEFORM</span>
              <span className="text-emerald-400 font-black tracking-widest select-none">BUFFER OK</span>
            </div>
            <canvas ref={canvasRef} className="w-full block bg-transparent" />
          </div>
        </div>

        {/* Right Lyrics Interactive Scrolling Panel (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-full overflow-hidden bg-[#0a0a10]/40 border border-white/5 rounded-3xl p-6 shadow-2xl relative">
          
          {isLoadingLyrics ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-gray-400 animate-pulse">
                Melakukan sinkronisasi lirik dari database hybrid...
              </p>
            </div>
          ) : (
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto pr-2 scrollbar-thin scroll-smooth select-none py-16 space-y-10"
            >
              {lyrics && lyrics.lines && lyrics.lines.length > 0 ? (
                lyrics.lines.map((line, idx) => {
                  const isActive = activeLyricIndex === idx;
                  return (
                    <div
                      key={idx}
                      ref={isActive ? activeLineRef : null}
                      onClick={() => seekTo(line.timeMs / 1000)}
                      className={`py-3.5 px-5 rounded-2xl cursor-pointer select-none transition-all duration-350 transform text-left hover:bg-white/5 group relative ${
                        isActive
                          ? "bg-emerald-500/10 border-l-4 border-emerald-500 scale-[1.01]"
                          : "opacity-45 hover:opacity-80 border-l-4 border-transparent"
                      }`}
                    >
                      {/* Interactive timing helper hover bubble */}
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-mono text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                        TAP TO SEEK
                      </span>

                      {/* Main original lyric */}
                      <p className={`text-lg sm:text-xl font-extrabold tracking-tight transition-colors ${
                        isActive ? "text-emerald-400" : "text-white"
                      }`}>
                        {line.text}
                      </p>

                      {/* Translated subline */}
                      {isLyricsArabicHD && line.indonesian && (
                        <p className={`text-xs mt-1.5 transition-colors font-medium select-none ${
                          isActive ? "text-cyan-400" : "text-gray-500"
                        }`}>
                          {line.indonesian}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 text-xs py-20 font-mono">
                  LIRIK TIDAK TERSEDIA UNTUK TREK INSTRUMEN INI
                </div>
              )}
            </div>
          )}

          {/* Tip notification bar */}
          <div className="border-t border-white/5 pt-3.5 mt-2 flex justify-between items-center text-[10px] font-mono text-gray-500 shrink-0">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Petunjuk: Tekan baris lirik untuk memutar langsung dari bait tersebut!</span>
            </span>
            <span>MUSIC VERSION 8K SYSTEM</span>
          </div>
        </div>

      </div>
    </div>
  );
}
