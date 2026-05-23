import { useMusic } from "../context/MusicContext";
import { Track } from "../types";
import { 
  History as HistoryIcon, 
  Heart, 
  Trash2, 
  Music,
  Play,
  Volume2,
  FolderHeart,
  Bookmark
} from "lucide-react";

export default function HistoryView() {
  const { 
    playHistory, 
    likedTracks, 
    clearHistory, 
    playTrack, 
    currentTrack, 
    isPlaying, 
    toggleLikeTrack 
  } = useMusic();

  const handlePlayHistorical = (track: Track, parentQueue: Track[]) => {
    playTrack(track, parentQueue);
  };

  const formatPlaycount = (count?: number) => {
    if (!count) return "0";
    if (count >= 1e9) return (count / 1e9).toFixed(1) + "B plays";
    if (count >= 1e6) return (count / 1e6).toFixed(1) + "M plays";
    return count.toLocaleString();
  };

  const formatDuration = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 text-white font-sans scrollbar-thin select-none pb-32">
      {/* Header Banner */}
      <h2 className="text-2xl font-extrabold text-white tracking-tight mb-8 border-b border-white/5 pb-2 flex items-center gap-2.5">
        <HistoryIcon className="w-5 h-5 text-emerald-400" />
        <span>Koleksi & Riwayat MusikKu</span>
      </h2>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Liked Tracks (7 cols) */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h3 className="font-extrabold text-lg text-white">Lagu yang Disukai</h3>
            </div>
            <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2.5 py-1 rounded-full font-bold">
              {likedTracks.length} LAGU TOTAL
            </span>
          </div>

          {likedTracks.length > 0 ? (
            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto scrollbar-thin pr-1 pb-4">
              {likedTracks.map((track) => {
                const isPlayingThis = currentTrack?.id === track.id && isPlaying;
                return (
                  <div
                    key={track.id}
                    onClick={() => handlePlayHistorical(track, likedTracks)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all pointer-events-auto cursor-pointer group ${
                      currentTrack?.id === track.id
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : "bg-[#0b0b0e] hover:bg-[#111116] border-white/5 hover:border-emerald-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={track.album.images[0]?.url}
                        alt={track.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded-lg shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className={`text-xs font-bold truncate ${
                          currentTrack?.id === track.id ? "text-emerald-400" : "text-white"
                        }`}>
                          {track.name}
                        </h4>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">
                          {track.artists[0]?.name} &bull; {track.album.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 pl-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLikeTrack(track);
                        }}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-rose-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 fill-rose-500" />
                      </button>
                      <span className="text-[10px] font-mono text-gray-500 w-8 text-right pr-1">
                        {formatDuration(track.duration_ms)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#0b0b0e] border border-white/5 rounded-2xl p-10 text-center flex flex-col items-center">
              <FolderHeart className="w-10 h-10 text-rose-500/40 mb-3" />
              <h4 className="text-xs font-bold text-white mb-1.5">Koleksi Favorit Kosong</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed max-w-xs">
                Ketuk tombol ikon <Heart className="w-3.5 h-3.5 inline text-rose-500" /> pada dashboard atau pencarian untuk mengukir daftar lagu favorit yang bermakna buat Anda!
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Play History (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2.5">
              <HistoryIcon className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-lg text-white">Baru Saja Didengar</h3>
            </div>
            {playHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-[10px] font-mono text-gray-500 hover:text-rose-400 hover:border-rose-500/20 px-2 py-0.5 rounded border border-white/5 transition-colors cursor-pointer"
              >
                HAPUS SEMUA
              </button>
            )}
          </div>

          {playHistory.length > 0 ? (
            <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto scrollbar-thin pr-1 pb-4">
              {playHistory.map((track, idx) => (
                <div
                  key={idx}
                  onClick={() => playTrack(track, playHistory)}
                  className="flex items-center justify-between p-2.5 bg-[#0c0c11] hover:bg-[#111119] border border-white/5 hover:border-emerald-500/10 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={track.album.images[0]?.url}
                      alt={track.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 object-cover rounded-md shrink-0 opacity-80"
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-white truncate">{track.name}</div>
                      <div className="text-[9px] text-gray-500 truncate">{track.artists[0]?.name}</div>
                    </div>
                  </div>
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Volume2 className="w-4 h-4 text-emerald-500 animate-pulse shrink-0 mr-1" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-gray-600 group-hover:text-emerald-400 transition-colors shrink-0 mr-1" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#0b0b0e] border border-white/5 rounded-2xl p-10 text-center flex flex-col items-center">
              <Bookmark className="w-10 h-10 text-emerald-500/40 mb-3" />
              <h4 className="text-xs font-bold text-white mb-1.5">Belum Ada Riwayat Putar</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed max-w-xs">
                Mulai putar lagu dari lagu-lagu internasional curated atau pencarian sistem untuk melihat jejak perjalanan melodi Anda di sini!
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
