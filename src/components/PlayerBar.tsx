import React, { useState, useEffect } from "react";
import { useMusic } from "../context/MusicContext";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Volume2, 
  VolumeX, 
  Heart, 
  Maximize2, 
  Compass,
  FileAudio,
  Radio,
  Sliders,
  Sparkles
} from "lucide-react";

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    pauseTrack,
    resumeTrack,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleMute,
    playbackMode,
    setPlaybackMode,
    isShuffle,
    setIsShuffle,
    isLoop,
    setIsLoop,
    isLiked,
    toggleLikeTrack,
    isLyricsOpen,
    setIsLyricsOpen
  } = useMusic();

  const [sliderVal, setSliderVal] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Sync slider coordinate to current audio time
  useEffect(() => {
    if (duration > 0) {
      setSliderVal((currentTime / duration) * 100);
    } else {
      setSliderVal(0);
    }
  }, [currentTime, duration]);

  if (!currentTrack) {
    return (
      <div className="h-24 bg-[#0a0a0f] border-t border-white/5 flex items-center justify-center text-gray-500 text-xs font-mono select-none px-6 fixed bottom-0 left-0 right-0 z-30">
        <Radio className="w-4 h-4 text-emerald-500 animate-pulse mr-2" />
        <span>PILIH LAGU UNTUK MEMULAI DEBIT AUDIO 8K</span>
      </div>
    );
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSliderVal(val);
    const newTime = (val / 100) * duration;
    seekTo(newTime);
  };

  const formatTime = (sec: number) => {
    if (isNaN(sec) || !isFinite(sec)) return "0:00";
    const min = Math.floor(sec / 60);
    const remaining = Math.floor(sec % 60);
    return `${min}:${remaining < 10 ? "0" : ""}${remaining}`;
  };

  // Toggle Quality modes seamlessly
  const handleToggleQuality = () => {
    if (playbackMode === "Standard") setPlaybackMode("HD");
    else if (playbackMode === "HD") setPlaybackMode("SuperHD_8K");
    else setPlaybackMode("Standard");
  };

  // Toggle Loop states
  const handleToggleLoop = () => {
    if (isLoop === "all") setIsLoop("one");
    else if (isLoop === "one") setIsLoop("none");
    else setIsLoop("all");
  };

  return (
    <div 
      className="h-24 bg-[#08080c] border-t border-white/5 flex items-center justify-between px-6 fixed bottom-0 left-0 right-0 z-30 select-none text-white font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Track Info (Left) */}
      <div className="flex items-center gap-3.5 w-1/4 min-w-0 pr-4">
        {/* Clickable cover triggers lyrics fullscreen */}
        <div 
          onClick={() => setIsLyricsOpen(!isLyricsOpen)}
          className="relative w-14 h-14 rounded-xl overflow-hidden cursor-pointer group shadow-lg border border-white/5 bg-[#12121a] shrink-0"
        >
          <img
            src={currentTrack.album.images[0]?.url}
            alt={currentTrack.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h4 
            onClick={() => setIsLyricsOpen(!isLyricsOpen)}
            className="text-xs font-black truncate text-white hover:text-emerald-400 cursor-pointer transition-colors leading-tight"
          >
            {currentTrack.name}
          </h4>
          <p className="text-[10px] text-gray-400 truncate mt-0.5 leading-none">
            {currentTrack.artists[0]?.name}
          </p>
        </div>

        {/* Favorite heart */}
        <button
          onClick={() => toggleLikeTrack(currentTrack)}
          className="p-1.5 hover:bg-white/5 rounded-lg shrink-0 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isLiked(currentTrack.id) ? "text-rose-500 fill-rose-500" : ""}`} />
        </button>
      </div>

      {/* 2. Playback Controllers & Seeker slider (Center) */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-lg">
        {/* Interactive Buttons Row */}
        <div className="flex items-center gap-5 sm:gap-6">
          {/* Shuffle button */}
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer ${
              isShuffle ? "text-emerald-400" : "text-gray-500 hover:text-white"
            }`}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Previous button */}
          <button
            onClick={prevTrack}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Master Play/Pause click triggers */}
          <button
            onClick={isPlaying ? pauseTrack : resumeTrack}
            className="p-3 bg-white text-black rounded-full hover:scale-105 transition-all cursor-pointer shadow-lg shadow-white/5 active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-black text-black" />
            ) : (
              <Play className="w-5 h-5 fill-black text-black pl-0.5" />
            )}
          </button>

          {/* Next button */}
          <button
            onClick={nextTrack}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Loop / Repeat button state cycles */}
          <button
            onClick={handleToggleLoop}
            className={`p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer relative ${
              isLoop !== "none" ? "text-emerald-400" : "text-gray-500 hover:text-white"
            }`}
          >
            {isLoop === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            {isLoop !== "none" && (
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Dynamic timeline seeker range */}
        <div className="flex items-center gap-2.5 w-full">
          <span className="text-[9px] font-mono text-gray-500 w-8 text-right font-medium">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min={0}
            max={100}
            value={sliderVal}
            onChange={handleSliderChange}
            className="flex-1 accent-emerald-500 bg-white/10 h-1 rounded-full cursor-pointer hover:bg-white/20 transition-all outline-none"
          />

          <span className="text-[9px] font-mono text-gray-500 w-8 text-left font-medium">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 3. Specs & Volume Controllers (Right) */}
      <div className="flex items-center justify-end gap-4 w-1/4 shrink-0 pl-4">
        
        {/* Dynamic HD/8K system Quality badge */}
        <button
          onClick={handleToggleQuality}
          className="px-3 py-1.5 rounded-full border bg-[#11111a] hover:bg-[#151522] cursor-pointer transition-colors flex items-center gap-1.5 shrink-0"
          style={{
            borderColor: playbackMode === "SuperHD_8K" ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.05)"
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
            {playbackMode === "Standard" && "Standard"}
            {playbackMode === "HD" && "HD Audio"}
            {playbackMode === "SuperHD_8K" && "Ultra 8K"}
          </span>
        </button>

        {/* Fullscreen synchronized lyrics toggler */}
        <button
          onClick={() => setIsLyricsOpen(!isLyricsOpen)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold leading-none cursor-pointer flex items-center gap-1 transition-colors ${
            isLyricsOpen 
              ? "bg-emerald-500 text-black shadow-lg" 
              : "bg-white/5 border border-white/5 text-gray-300 hover:text-white"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Lirik</span>
        </button>

        {/* Volume decibel slider */}
        <div className="flex items-center gap-2 group/vol">
          <button
            onClick={toggleMute}
            className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 accent-emerald-500 bg-white/10 h-0.5 rounded cursor-pointer group-hover/vol:h-1 transition-all"
          />
        </div>

      </div>
    </div>
  );
}
