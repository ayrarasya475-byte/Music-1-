import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flame, Radio, Cpu, Headphones, Volume2, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function SplashBoot({ onBootComplete }: { onBootComplete: () => void }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState("Initializing MusicKu sound core...");

  useEffect(() => {
    // Elegant incremental progress loop
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 28);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 15) {
      setStage(0);
      setLog("Loading high-fidelity audio structures...");
    } else if (progress < 35) {
      setStage(1);
      setLog("Authenticating 8K Spatial Sound Decoder...");
    } else if (progress < 55) {
      setStage(2);
      setLog("Synchronizing live Spotify metadata mirrors...");
    } else if (progress < 75) {
      setStage(3);
      setLog("Optimizing local cache & offline storage matrix...");
    } else if (progress < 95) {
      setStage(4);
      setLog("Securing end-host PWA service workers...");
    } else {
      setStage(5);
      setLog("MusicKu 8K Digital System ONLINE.");
    }
  }, [progress]);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onBootComplete();
      }, 900);
      return () => clearTimeout(timeout);
    }
  }, [progress, onBootComplete]);

  return (
    <div className="fixed inset-0 bg-[#07070a] text-white flex flex-col items-center justify-center font-sans select-none z-50">
      {/* Background ambient radial glowing circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-8 text-center flex flex-col items-center">
        {/* Animated Brand Logo Icon with pulse styling */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative inline-flex items-center justify-center p-6 bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 rounded-full border border-emerald-500/20 mb-6 shadow-2xl shadow-emerald-500/5"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-emerald-500/50"
          />
          <Radio className="w-12 h-12 text-emerald-400" />
        </motion.div>

        {/* Brand Text */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 bg-clip-text text-transparent font-sans"
        >
          MusicKu
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-gray-500 tracking-wider uppercase mt-1 mb-10 font-mono"
        >
          Hi-Fi Audio &bull; 8K Digital System
        </motion.p>

        {/* Real-time Stage Metrics */}
        <div className="w-full bg-[#111116] border border-white/5 rounded-2xl p-4 mb-6 text-left shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            {stage === 0 && <Headphones className="w-4 h-4 text-cyan-400 animate-pulse" />}
            {stage === 1 && <Cpu className="w-4 h-4 text-teal-400 animate-pulse" />}
            {stage === 2 && <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
            {stage === 3 && <Flame className="w-4 h-4 text-amber-500 animate-pulse" />}
            {stage === 4 && <ShieldCheck className="w-4 h-4 text-indigo-400 animate-pulse" />}
            {stage === 5 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            <span className="text-xs font-mono font-medium text-gray-300 transition-all duration-300">
              {log}
            </span>
          </div>

          {/* Progress Slider */}
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>

          <div className="flex justify-between items-center mt-2.5">
            <span className="text-[10px] font-mono text-gray-400">DECIBEL GAIN STATE: OPTIMAL</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">{progress}%</span>
          </div>
        </div>

        {/* Boot Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8 }}
          className="text-[10px] font-mono text-gray-600 flex flex-col gap-0.5"
        >
          <div>SYSTEM VERSION 1.2.88-HD</div>
          <div>POWERED BY SPOTIFY PARTNER CORE &bull; SECURE FIREBASE</div>
        </motion.div>
      </div>
    </div>
  );
}
