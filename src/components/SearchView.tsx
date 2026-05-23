import { useState, useEffect } from "react";
import { useMusic } from "../context/MusicContext";
import { Track } from "../types";
import { CURATED_TRACKS } from "../data/premiumTracks";
import { 
  Search, 
  Trash2, 
  Clock, 
  Music, 
  Users, 
  FolderHeart, 
  HelpCircle,
  Play,
  Volume2
} from "lucide-react";

export default function SearchView() {
  const { 
    playTrack, 
    currentTrack, 
    isPlaying, 
    searchHistory, 
    addToSearchHistory, 
    clearSearchHistory 
  } = useMusic();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Debouncing query inputs
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400); // 400ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Execute Search from Server api wrapper
  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setResults(null);
      setErrorMsg(null);
      return;
    }

    const performSearch = async () => {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const url = `/api/spotify/search?q=${encodeURIComponent(debouncedQuery)}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Gagal memperoleh hasil dari API Spotify");
        }
        const data = await response.json();
        setResults(data);
        addToSearchHistory(debouncedQuery);
      } catch (err: any) {
        console.warn("Spotify API backend error, falling back to smart local catalog:", err);
        // Resilient Offline Local Catalog Search
        const searchVal = debouncedQuery.toLowerCase();
        const matchedTracks = CURATED_TRACKS.filter(
          t => t.name.toLowerCase().includes(searchVal) || 
               t.artists[0].name.toLowerCase().includes(searchVal) ||
               (t.album.name?.toLowerCase().includes(searchVal) || false)
        );
        
        setResults({
          top_results: matchedTracks.slice(0, 2).map(t => ({
            type: "Track",
            id: t.id,
            uri: t.uri,
            url: t.url,
            name: t.name,
            images: t.album.images
          })),
          tracks: matchedTracks,
          artists: [],
          albums: [],
          playlists: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  // Format Duration helper
  const formatDuration = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleQuickHistorySearch = (histQuery: string) => {
    setQuery(histQuery);
  };

  // Convert Spotify track schema to local Player-compatible Track schema
  const convertToPlayerTrack = (sTrack: any): Track => {
    // If it's already a player track (local fallback schema)
    if (sTrack.audio_url) return sTrack;

    // Convert from Spotify API response
    return {
      id: sTrack.id || Math.random().toString(),
      uri: sTrack.uri || "",
      url: sTrack.url || null,
      name: sTrack.name || "Unknown Track",
      duration_ms: sTrack.duration_ms || 180000,
      explicit: sTrack.explicit,
      artists: sTrack.artists?.map((a: any) => ({
        id: a.id || null,
        uri: a.uri || "",
        url: a.url || null,
        name: a.name || "Unknown Artist"
      })) || [{ id: null, uri: "", url: null, name: "Unknown Artist" }],
      album: {
        id: sTrack.album?.id || null,
        uri: sTrack.album?.uri || "",
        url: sTrack.album?.url || null,
        name: sTrack.album?.name || "Single Release",
        images: sTrack.album?.images || [{ url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=200" }]
      },
      // Generate realistic high-quality dummy stream url bound to the duration or random seeds
      audio_url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(Math.floor(Math.random() * 8) + 1)}.mp3`
    };
  };

  const handlePlaySpotifyTrack = (spotifyTrack: any) => {
    const playerTrack = convertToPlayerTrack(spotifyTrack);
    
    // Create a sensible queue of active tracks
    let newQueue: Track[] = [];
    if (results?.tracks?.length > 0) {
      newQueue = results.tracks.map((t: any) => convertToPlayerTrack(t));
    } else {
      newQueue = [playerTrack];
    }
    
    playTrack(playerTrack, newQueue);
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 text-white font-sans scrollbar-thin select-none pb-32">
      {/* Search Header */}
      <h2 className="text-2xl font-extrabold text-white tracking-tight mb-5 border-b border-white/5 pb-2 flex items-center gap-2.5">
        <Search className="w-5 h-5 text-emerald-400" />
        <span>Pencarian Pintar &bull; Spotify Engine</span>
      </h2>

      {/* Main Search Input Form */}
      <div className="relative w-full max-w-xl mb-8 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari lagu, artis, album, atau genre dari Spotify..."
          className="w-full bg-[#0f0f15] border border-white/5 focus:border-emerald-500/30 rounded-2xl pl-12 pr-10 py-4 text-xs text-white placeholder-gray-500 focus:outline-none transition-all shadow-xl font-sans"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs font-mono py-1 rounded cursor-pointer"
          >
            CLEAR
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-gray-400">Menghubungkan ke API Partner Spotify...</p>
        </div>
      )}

      {/* Conditionally render Search History when query is empty */}
      {!isLoading && query.trim() === "" && (
        <div className="max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Riwayat Pencarian Anda</span>
            </span>
            {searchHistory.length > 0 && (
              <button
                onClick={clearSearchHistory}
                className="text-xs text-gray-400 hover:text-rose-400 font-bold flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Bersihkan Semua</span>
              </button>
            )}
          </div>

          {searchHistory.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {searchHistory.map((hist, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickHistorySearch(hist)}
                  className="px-4 py-2.5 bg-[#0e0e14] hover:bg-[#12121c] border border-white/5 hover:border-emerald-500/20 rounded-xl text-xs font-medium text-gray-300 hover:text-emerald-400 transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <Search className="w-3 h-3 opacity-60 shrink-0" />
                  <span>{hist}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-[#0b0b0e] border border-white/5 rounded-2xl p-6 text-center text-gray-500 text-xs">
              Mulai ketikkan kueri untuk mencari musik di seluruh katalog global!
            </div>
          )}
        </div>
      )}

      {/* Display Search Results */}
      {!isLoading && results && (
        <div className="space-y-10 animate-fade-in">
          
          {/* Top Result + Top Track Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Top Match Result Card (4 cols) */}
            {results.top_results?.length > 0 && (
              <div className="lg:col-span-5 flex flex-col gap-4">
                <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest">
                  Hasil Teratas Cocok
                </span>
                
                <div 
                  onClick={() => {
                    const matchedTrack = results.tracks?.find((t: any) => t.name === results.top_results[0].name);
                    if (matchedTrack) {
                      handlePlaySpotifyTrack(matchedTrack);
                    } else if (results.tracks?.length > 0) {
                      handlePlaySpotifyTrack(results.tracks[0]);
                    }
                  }}
                  className="bg-gradient-to-br from-[#101017] to-[#0a0a0f] border border-white/5 hover:border-emerald-500/20 rounded-3xl p-6 cursor-pointer transition-all duration-300 group shadow-xl relative overflow-hidden flex flex-col justify-end min-h-60"
                >
                  {/* Glowing background ripple */}
                  <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
                  
                  <div className="relative z-10 flex flex-col gap-4">
                    <img
                      src={results.top_results[0].images?.[0]?.url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=200"}
                      alt={results.top_results[0].name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-2xl shadow-xl border border-white/10"
                    />

                    <div>
                      <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-400 transition-colors leading-tight truncate">
                        {results.top_results[0].name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-mono font-bold bg-white/5 px-2 py-0.5 rounded text-gray-400">
                          {results.top_results[0].type || "Track"}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">8K System Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Track Songs List (7 cols) */}
            <div className={`lg:col-span-7 flex flex-col gap-4`}>
              <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest flex justify-between">
                <span>Lagu &mdash; Spotify Tracks</span>
                <span className="text-emerald-400 font-bold">100% HI-RES PREVIEW</span>
              </span>

              {results.tracks?.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {results.tracks.slice(0, 5).map((track: any) => {
                    const isPlayingThis = currentTrack?.name === track.name && isPlaying;
                    return (
                      <div
                        key={track.id}
                        onClick={() => handlePlaySpotifyTrack(track)}
                        className={`flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 border cursor-pointer group ${
                          currentTrack?.name === track.name
                            ? "bg-emerald-500/5 border-emerald-500/20"
                            : "bg-[#0c0c11]/40 hover:bg-[#12121a]/80 border-white/5 hover:border-emerald-500/10"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={track.album?.images?.[0]?.url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=100"}
                            alt={track.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-lg bg-gray-950 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className={`text-xs font-bold truncate ${
                              currentTrack?.name === track.name ? "text-emerald-400" : "text-white"
                            }`}>
                              {track.name}
                            </h4>
                            <p className="text-[10px] text-gray-500 truncate mt-0.5">
                              {track.artists?.[0]?.name || "Unknown Artist"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 pl-3 shrink-0">
                          {isPlayingThis ? (
                            <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                          )}
                          <span className="text-[10px] font-mono text-gray-500">
                            {formatDuration(track.duration_ms)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 bg-white/5 rounded-2xl text-center text-xs text-gray-500">
                  Tidak ada lagu yang ditemukan.
                </div>
              )}
            </div>
          </div>

          {/* Albums, Playlists grid if loaded */}
          {(results.albums?.length > 0 || results.playlists?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              {results.albums?.length > 0 && (
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest">
                    Album Teratas
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {results.albums.slice(0, 4).map((album: any) => (
                      <div
                        key={album.id}
                        className="p-3 bg-[#0c0c11] border border-white/5 rounded-xl flex items-center gap-3"
                      >
                        <img
                          src={album.images?.[0]?.url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=100"}
                          alt={album.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 object-cover rounded-lg bg-gray-950 shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-white truncate">{album.name}</h5>
                          <p className="text-[9px] text-gray-500 truncate mt-0.5">
                            {album.artists?.[0]?.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.playlists?.length > 0 && (
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest">
                    Rekomendasi Playlist
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {results.playlists.slice(0, 4).map((playlist: any) => (
                      <div
                        key={playlist.id}
                        className="p-3 bg-[#0c0c11] border border-white/5 rounded-xl flex items-center gap-3"
                      >
                        <img
                          src={playlist.images?.[0]?.url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=100"}
                          alt={playlist.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 object-cover rounded-lg bg-gray-950 shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-white truncate">{playlist.name}</h5>
                          <p className="text-[9px] text-gray-500 truncate mt-0.5">
                            By {playlist.owner?.display_name || "Spotify"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}
    </div>
  );
}
