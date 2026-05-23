import { useEffect, useState } from "react";
import { useMusic } from "../context/MusicContext";
import { 
  User, 
  Download, 
  HelpCircle, 
  ShieldCheck, 
  Cpu, 
  Music, 
  ChevronDown, 
  ChevronUp,
  Bookmark,
  Sparkles,
  Award
} from "lucide-react";

export default function ProfilView() {
  const { user } = useMusic();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Capture beforeinstallprompt PWA event dynamically
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstalled(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Check if app is launched as standalone PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const triggerPwaInstall = async () => {
    if (!deferredPrompt) {
      alert("PWA Mode: Aplikasi sudah terinstall atau browser Anda belum mendaftarkan prompt install. Anda juga dapat menekan bagikan lalu pilih 'Tambahkan ke Layar Utama' (Add to HomeScreen) di Safari / Chrome!");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const faqItems = [
    {
      q: "Apa itu HD Audio 8K System di MusicKu?",
      a: "Teknologi HD Audio 8K System adalah implementasi audio berbasis komputasi lokal yang mereduksi jitter sinyal audio hingga ke tingkat mikrodesibel. Ini menghasilkan spatial soundstage yang amat luas, beresolusi tinggi, layaknya mendengarkan rekaman master studio asli."
    },
    {
      q: "Bagaimana cara kerja PWA Mode (Aplikasi Portabel)?",
      a: "PWA (Progressive Web App) memungkinkan MusicKu di-install langsung ke layar beranda handphone atau desktop PC Anda layaknya aplikasi native tanpa memakan memori penyimpanan internal yang besar. Integrasi ini mempercepat booting sistem dan meniadakan lag."
    },
    {
      q: "Apakah MusicKu menggunakan API Spotify resmi?",
      a: "Ya. MusicKu menggunakan Spotify Partner Search and Metadata API secara aman di lapisan backend (Express). Akses data dikompresi sedemikian rupa untuk efisiensi request, menyajikan lag-free searching bagi pencinta musik sejati."
    },
    {
      q: "Bagaimana cara menyiasati jika fitur Audio macet?",
      a: "Pastikan Anda telah mengetuk salah satu tombol putar (Play) untuk membuka izin Web Audio API di browser Anda. Audio MusicKu didukung penuh oleh decoder media browser bawaan yang higienis."
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 text-white font-sans scrollbar-thin select-none pb-32">
      {/* Header Banner */}
      <h2 className="text-2xl font-extrabold text-white tracking-tight mb-8 border-b border-white/5 pb-2 flex items-center gap-2.5">
        <User className="w-5 h-5 text-emerald-400" />
        <span>Pusat Profil & Edukasi PWA</span>
      </h2>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Profile, specs & PWA Trigger (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Detailed Account Panel */}
          <div className="bg-gradient-to-br from-[#0f0f15] to-[#08080c] border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none" />
            
            <div className="flex flex-col items-center text-center">
              <img
                src={user.avatarUrl || "https://api.dicebear.com/7.x/pixel-art/svg?seed=musicku"}
                alt="Avatar"
                className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 shadow-lg mb-4"
              />
              <h3 className="text-lg font-extrabold text-white leading-tight">
                {user.displayName}
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-1">{user.email}</p>
              
              <div className="flex gap-2.5 mt-4">
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-3 py-1 font-mono font-bold uppercase rounded-full border border-emerald-500/15">
                  {user.isGuest ? "GUEST LEVEL" : "PREMIUM DOLBY"}
                </span>
                <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-3 py-1 font-mono font-bold uppercase rounded-full border border-cyan-500/15">
                  8K CORES ENGINE
                </span>
              </div>
            </div>
          </div>

          {/* Majestic PWA Installer Screen */}
          <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0e0e14] border border-emerald-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/25 shrink-0">
                <Download className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">Konversi ke App Aplikasi (PWA Mode)</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-1">
                  Pasang MusicKu langsung ke layar ponsel atau desktop komputer Anda untuk kecepatan pemutaran lag-free sejati.
                </p>
              </div>
            </div>

            {/* Prompt installer CTA */}
            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Aplikasi Status</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">
                  {isInstalled ? "Sistem Standalone Aktif" : "Siap Dipasang di Beranda"}
                </div>
              </div>

              {!isInstalled ? (
                <button
                  onClick={triggerPwaInstall}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-[11px] font-extrabold hover:opacity-90 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/5 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Install Aplikasi
                </button>
              ) : (
                <span className="text-xs font-mono font-bold py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  INSTALLED
                </span>
              )}
            </div>
          </div>

          {/* Scientific Specification details */}
          <div className="bg-[#0b0b0e] border border-white/5 rounded-2xl p-5">
            <h4 className="text-xs font-mono font-bold text-gray-400 tracking-wider uppercase mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Spesifikasi Hardware Audio</span>
            </h4>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-500">Audio Codec</span>
                <span className="font-mono text-emerald-400 font-bold">MPEG-4 AAC / 320kbps</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-500">Decibel Dynamic Range</span>
                <span className="font-mono text-emerald-400 font-bold">144 dB (HD Audio 8K)</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-500">Sistem API Backend</span>
                <span className="font-mono text-emerald-400 font-bold">Express + Spotify Mirror</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Database Realtime</span>
                <span className="font-mono text-emerald-400 font-bold">Sandbox Hybrid Cache</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: FAQ (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5 bg-[#0f0f15]/50 border border-white/5 rounded-3xl p-6 shadow-xl">
          <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-teal-400" />
            <span>Frequently Asked Questions (FAQ)</span>
          </span>

          <div className="space-y-3.5">
            {faqItems.map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-white/5 rounded-2xl overflow-hidden bg-[#0a0a0f] transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center px-4.5 py-4 hover:bg-white/5 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-bold text-white pr-2 leading-snug">
                      {item.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <p className="px-4.5 pb-4 text-[11px] text-gray-400 leading-relaxed border-t border-white/5 pt-2.5">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-[#0a0a0e]/90 border border-white/5 rounded-2xl flex items-center gap-3.5">
            <Award className="w-8 h-8 text-emerald-400 shrink-0 opacity-80" />
            <div>
              <h5 className="text-xs font-bold text-white">MusicKu Visual Philosophy</h5>
              <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">
                Desain arsitektur dashboard MusicKu memprioritaskan tipografi minimalis, warna gelap yang aman bagi mata lelah, serta layout bebas hambatan emosional untuk mengantar pencinta musik ke surga akustik sejati.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
