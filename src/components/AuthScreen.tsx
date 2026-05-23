import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMusic } from "../context/MusicContext";
import { Radio, Users, Chrome, CornerDownRight, Check, ArrowRight } from "lucide-react";

export default function AuthScreen() {
  const { loginAsGuest, loginWithGoogle } = useMusic();
  const [showGoogleForm, setShowGoogleForm] = useState(false);
  const [googleName, setGoogleName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.includes("@") || googleName.trim().length === 0) {
      setErrorMsg("Harap masukkan nama dan email Google yang valid.");
      return;
    }
    loginWithGoogle(googleEmail, googleName);
  };

  const handleQuickGoogle = () => {
    loginWithGoogle("pencintamusik@gmail.com", "Premium User");
  };

  return (
    <div className="fixed inset-0 bg-[#07070a] text-white flex items-center justify-center font-sans select-none z-40 overflow-y-auto py-8">
      {/* Background ambient radial glowing circles */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Visual Brand Panel */}
        <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-3 p-3 bg-emerald-400/10 border border-emerald-500/20 rounded-2xl mb-5 shadow-lg shadow-emerald-500/5">
            <Radio className="w-8 h-8 text-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide text-emerald-400">System 8K Master</span>
          </div>

          <h2 className="text-5xl font-extrabold tracking-tight font-sans leading-none">
            Dengar Tanpa <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Batasan.
            </span>
          </h2>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            Selamat datang di <strong className="text-white">MusicKu</strong>. Nikmati audio berkualitas tinggi (HD Mode / 8K), lirik real-time, dan koleksi internasional premium yang dirancang khusus untuk memeluk kenyamanan spiritual pencinta musik sejati.
          </p>

          <div className="mt-8 flex flex-col gap-4 text-xs font-mono text-gray-500 text-left w-full max-w-sm">
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full Mirror Api Spotify Premium</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Sistem HD Audio & Synchronized Lirik</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Dukungan PWA Aplikasi Portabel</span>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="md:col-span-7">
          <AnimatePresence mode="wait">
            {!showGoogleForm ? (
              <motion.div
                key="choice"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                {/* Google Sign In option */}
                <div className="bg-[#0f0f15]/80 hover:bg-[#12121b]/90 border border-white/5 hover:border-emerald-500/20 rounded-3xl p-6 transition-all duration-300 shadow-2xl group relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-white/5 rounded-2xl">
                        <Chrome className="w-7 h-7 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                      </div>
                      <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-1 rounded-full font-mono">
                        AKUN SINkron
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Hubungkan Akun Google Anda
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Sinkronkan koleksi lagu, riwayat mendengarkan, serta penanda favorit Anda di cloud Firebase secara permanen dari perangkat apa pun.
                    </p>
                  </div>
                  
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowGoogleForm(true)}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black text-xs font-bold font-sans transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
                    >
                      <span>Masuk Akun Google</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleQuickGoogle}
                      className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold font-sans transition-colors cursor-pointer"
                    >
                      Masuk Instan (Premium)
                    </button>
                  </div>
                </div>

                {/* Guest Entrance option */}
                <div className="bg-[#0f0f15]/80 hover:bg-[#12121b]/90 border border-white/5 hover:border-cyan-500/20 rounded-3xl p-6 transition-all duration-300 shadow-2xl group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-white/5 rounded-2xl">
                        <Users className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                      </div>
                      <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-1 rounded-full font-mono">
                        ID TAMU INSTAN
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      Masuk Sebagai Tamu / Guest Mode
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Sama seperti orang masuk ke rumah orang lain secara hangat, bersantai sebagai tamu yang terhormat tanpa ikatan registrasi google. Kebebasan penuh berekspresi!
                    </p>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={loginAsGuest}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black text-xs font-bold font-sans transition-all active:scale-[0.98] w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 cursor-pointer"
                    >
                      <CornerDownRight className="w-4 h-4" />
                      <span>Masuk Sebagai Tamu</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="google-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0f0f15]/95 border border-emerald-500/20 rounded-3xl p-8 shadow-2xl relative"
              >
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <Chrome className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-lg text-white">Google Account Sign-In</h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowGoogleForm(false);
                      setErrorMsg("");
                    }}
                    className="text-xs text-gray-400 hover:text-white font-mono bg-white/5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    KEMBALI
                  </button>
                </div>

                <form onSubmit={handleGoogleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 font-bold uppercase tracking-wider">
                      Nama Lengkap Anda
                    </label>
                    <input
                      type="text"
                      value={googleName}
                      onChange={(e) => setGoogleName(e.target.value)}
                      placeholder="Contoh: Ayra Rasya"
                      required
                      className="w-full bg-[#14141d] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 font-bold uppercase tracking-wider">
                      Email Google Anda
                    </label>
                    <input
                      type="email"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      placeholder="Contoh: ayrarasya475@gmail.com"
                      required
                      className="w-full bg-[#14141d] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-red-400 text-xs font-mono italic animate-pulse">
                      * {errorMsg}
                    </p>
                  )}

                  <div className="pt-4 flex flex-col md:flex-row gap-3">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98]"
                    >
                      <span>Verifikasi & Masuk</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGoogleName("Ayra Rasya");
                        setGoogleEmail("ayrarasya475@gmail.com");
                      }}
                      className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Isi Otomatis (Demo Email)
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
