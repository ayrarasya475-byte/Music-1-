import { useEffect, useState } from "react";
import { useMusic } from "../context/MusicContext";
import { CURATED_TRACKS } from "../data/premiumTracks";
import { Track } from "../types";
import { 
  Play, 
  Heart, 
  Radio, 
  Sparkles,
  Flame,
  Globe2,
  Clock,
  TrendingUp,
  Volume2,
  ListRestart
} from "lucide-react";

export default function DashboardView() {
  const { playTrack, currentTrack, isPlaying, toggleLikeTrack, isLiked, user, playHistory } = useMusic();
  const [greeting, setGreeting] = useState("Selamat Pagi");

  useEffect(() => {
    // Elegant greeting based on hour
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Selamat Pagi");
    } else if (hour < 17) {
      setGreeting("Selamat Siang");
    } else if (hour < 21) {
      setGreeting("Selamat Sore");
    } else {
      setGreeting("Selamat Malam");
    }
  }, []);

  // Format playcount for elegant displays
  const formatPlaycount = (count?: number) => {
    if (!count) return "0";
    if (count >= 1e9) return (count / 1e9).toFixed(1) + "B plays";
    if (count >= 1e6) return (count / 1e6).toFixed(1) + "M plays";
    return count.toLocaleString() + " plays";
  };

  // Format duration
  const formatDuration = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handlePlayCurated = (track: Track) => {
    playTrack(track, CURATED_TRACKS);
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 text-white font-sans scrollbar-thin select-none pb-32">
      {/* Top Banner Accent */}
      <div className="absolute top-0 right-0 left-64 h-64 bg-gradient-to-b from-emerald-500/15 via-transparent to-transparent pointer-events-none" />

      {/* Header Greeting */}
      <header className="relative flex justify-between items-center mb-8 pb-3 border-b border-white/5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            {greeting}, <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-black">{user.displayName}</span>
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            Merangkul kehangatan visual HD Audio & 8K Spatial Sound Decoder yang damai.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/15 rounded-full px-4 py-2 text-xs font-semibold hover:border-emerald-500/20 transition-all cursor-pointer">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-emerald-400">{user.isGuest ? "Tamu Mode" : "Premium Dolby"}</span>
        </div>
      </header>

      {/* Premium Hero Promo Box */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border border-white/5 p-8 mb-10 shadow-2xl shadow-black/4xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2" />
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-400/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-widest uppercase rounded-full mb-4">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Kenyamanan Audio Sejati</span>
          </div>
          <h3 className="text-4xl font-extrabold tracking-tight text-white leading-tight mb-3">
            Murninya Suara <br />
            Dalam Genggaman Anda.
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed max-w-md">
            Teknologi <strong className="text-white">HD Audio 8K System</strong> kami mereduksi distorsi digital, merekonstruksi vokal selembut beludru, memberikan ketenangan tak tertandingi di telinga.
          </p>
        </div>
        <div className="relative z-10 shrink-0 w-36 h-36 rounded-2xl bg-gradient-to-tr from-emerald-505/10 to-cyan-500/10 border border-white/10 flex items-center justify-center p-4 shadow-xl select-none">
          <TrendingUp className="absolute top-3 left-3 w-4 h-4 text-emerald-400 opacity-60" />
          <div className="text-center">
            <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight animate-bounce">8K</div>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1 font-bold">Resonance</div>
          </div>
        </div>
      </section>

      {/* Horizontal Curated International Hits */}
      <section className="mb-10">
        <div className="flex justify-between items-end mb-5">
          <div className="flex items-center gap-2.5">
            <Globe2 className="w-5 h-5 text-emerald-400" />
            <h4 className="text-xl font-bold tracking-tight text-white font-sans">Music Internasional Curated</h4>
          </div>
          <span className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">GESER HORIZONTAL &bull; HQ</span>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin container-snap select-none scroll-smooth">
          {CURATED_TRACKS.map((track) => {
            const isPlayingThis = currentTrack?.id === track.id && isPlaying;
            return (
              <div
                key={track.id}
                onClick={() => handlePlayCurated(track)}
                className="w-48 bg-[#0f0f15] hover:bg-[#13131c] border border-white/5 hover:border-emerald-500/20 rounded-2xl p-4 cursor-pointer transition-all duration-300 shadow-lg shrink-0 group hover:-translate-y-1 relative"
              >
                {/* Artwork Area */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3.5 bg-[#14141c] shadow-lg">
                  <img
                    src={track.album.images[0]?.url}
                    alt={track.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Floating Play Overlay Hover state */}
                  <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 ${
                    isPlayingThis ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}>
                    <div className="p-3 bg-emerald-500 rounded-full text-black shadow-xl scale-95 group-hover:scale-100 transition-transform active:scale-95">
                      <Play className={`w-5 h-5 ${isPlayingThis ? "fill-black" : "fill-black"}`} />
                    </div>
                  </div>
                </div>

                {/* Info Text */}
                <h5 className="text-xs font-bold text-white truncate max-w-full mb-0.5 group-hover:text-emerald-400 transition-colors">
                  {track.name}
                </h5>
                <p className="text-[10px] text-gray-400 truncate max-w-full font-medium">
                  {track.artists[0]?.name}
                </p>

                {/* Footer specs */}
                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-white/5 text-[9px] font-mono text-gray-500 text-left">
                  <span>{formatPlaycount(track.playcount)}</span>
                  <span className="text-emerald-500 font-bold">8K</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Row Split: Trending VS Relevant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Trending Global Rows (left 7 cols) */}
        <section className="lg:col-span-7">
          <div className="flex items-center gap-2.5 mb-5 border-b border-white/5 pb-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h4 className="text-lg font-bold tracking-tight text-white font-sans">Trending Global 8K Master</h4>
          </div>

          <div className="flex flex-col gap-2">
            {CURATED_TRACKS.slice(0, 5).map((track, i) => {
              const isPlayingThis = currentTrack?.id === track.id && isPlaying;
              return (
                <div
                  key={track.id}
                  onClick={() => handlePlayCurated(track)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all duration-250 border group cursor-pointer ${
                    currentTrack?.id === track.id 
                      ? "bg-emerald-500/5 border-emerald-500/20" 
                      : "bg-[#0b0b0e]/50 hover:bg-[#101015]/80 border-white/5 hover:border-emerald-500/10"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Number */}
                    <span className="w-5 text-xs text-center font-mono font-black text-gray-600 group-hover:text-emerald-400">
                      {i + 1}
                    </span>
                    
                    {/* Thumbnail */}
                    <img
                      src={track.album.images[0]?.url}
                      alt={track.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-lg bg-[#14141c] border border-white/5 shrink-0"
                    />

                    {/* Metadata */}
                    <div className="min-w-0">
                      <div className={`text-xs font-bold truncate ${
                        currentTrack?.id === track.id ? "text-emerald-400" : "text-white"
                      }`}>
                        {track.name}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate mt-0.5">
                        {track.artists[0]?.name} &bull; {track.album.name}
                      </div>
                    </div>
                  </div>

                  {/* Right specs */}
                  <div className="flex items-center gap-5 shrink-0 pl-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] font-mono text-gray-500 font-medium">
                        {formatPlaycount(track.playcount)}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLikeTrack(track);
                      }}
                      className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-rose-500 transition-all cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${isLiked(track.id) ? "text-rose-500 fill-rose-500" : ""}`} />
                    </button>

                    <span className="text-[10px] font-mono text-gray-500 pr-1">
                      {formatDuration(track.duration_ms)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dynamic Relevant / History Feed (right 5 cols) */}
        <section className="lg:col-span-5">
          <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-2">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h4 className="text-lg font-bold tracking-tight text-white font-sans">
                {playHistory.length > 0 ? "Baru Diputar" : "Optimasi Relevan"}
              </h4>
            </div>
            {playHistory.length > 0 && (
              <span className="text-[10px] font-mono text-gray-500 py-0.5 px-2 rounded-full bg-white/5">
                MUTAKHIR
              </span>
            )}
          </div>

          {playHistory.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {playHistory.slice(0, 4).map((track) => (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, playHistory)}
                  className="flex items-center gap-3 p-2 bg-[#0c0c11] hover:bg-[#111118]/80 border border-white/5 hover:border-emerald-500/10 rounded-xl cursor-pointer transition-colors"
                >
                  <img
                    src={track.album.images[0]?.url}
                    alt={track.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 object-cover rounded-lg shrink-0 outline outline-1 outline-white/5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">{track.name}</div>
                    <div className="text-[10px] text-gray-500 truncate mt-0.5">{track.artists[0]?.name}</div>
                  </div>
                  <Volume2 className="w-4 h-4 text-emerald-400 opacity-60 pr-1 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            // Curated recommended list in case they haven't listened to anything
            <div className="bg-[#0b0b0e] border border-white/5 rounded-2xl p-5 text-center flex flex-col items-center">
              <div className="p-3 bg-cyan-400/10 border border-cyan-500/20 rounded-full mb-3 text-cyan-400">
                <ListRestart className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <h5 className="text-xs font-bold text-white mb-1.5">Rekomendasi Pintar 8K</h5>
              <p className="text-[10px] text-gray-500 leading-relaxed max-w-xs mb-4">
                Mulai putar lagu di bagian International Hits atau cari lagu favorit Anda untuk mengaktifkan deep neural rekomendasi real-time dari riwayat Anda!
              </p>
              
              {/* Highlight a recommended random acoustic song */}
              <div
                onClick={() => playTrack(CURATED_TRACKS[5])}
                className="w-full bg-[#12121c]/60 p-3 rounded-xl border border-white/5 hover:border-cyan-500/20 flex items-center gap-3 text-left cursor-pointer transition-all"
              >
                <img
                  src={CURATED_TRACKS[5].album.images[0]?.url}
                  alt="track"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 object-cover rounded-md shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-white truncate">{CURATED_TRACKS[5].name}</div>
                  <div className="text-[9px] text-gray-400 truncate">{CURATED_TRACKS[5].artists[0]?.name}</div>
                </div>
                <div className="text-[10px] font-bold px-2 py-0.5 text-cyan-400 bg-cyan-500/10 rounded-full font-mono">
                  HQ Acoustic
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
