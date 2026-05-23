import { useMusic } from "../context/MusicContext";
import { 
  Home, 
  Search, 
  History as HistoryIcon, 
  User, 
  LogOut, 
  Download, 
  Heart,
  Radio,
  Flame,
  Globe2
} from "lucide-react";

export default function Sidebar() {
  const { activeTab, setActiveTab, user, logout, likedTracks } = useMusic();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "search", label: "Cari Lagu", icon: Search },
    { id: "history", label: "Riwayat Musik", icon: HistoryIcon },
    { id: "profil", label: "Profil & PWA", icon: User },
  ] as const;

  return (
    <aside className="w-64 bg-[#0a0a0e] text-gray-300 flex flex-col justify-between border-r border-white/5 h-full font-sans select-none p-5 shrink-0">
      <div className="flex flex-col gap-8">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Radio className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white leading-none">MusicKu</h1>
            <span className="text-[9px] font-mono font-bold text-emerald-400">8K ULTRA RES SYSTEM</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 relative group cursor-pointer ${
                  isActive
                    ? "text-white bg-gradient-to-r from-emerald-500/10 to-transparent border-l-2 border-emerald-500"
                    : "hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-105 ${
                  isActive ? "text-emerald-400" : "text-gray-400 group-hover:text-emerald-400"
                }`} />
                <span>{item.label}</span>
                
                {/* Micro badge indicator */}
                {item.id === "history" && likedTracks.length > 0 && (
                  <span className="ml-auto bg-emerald-500/10 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border border-emerald-500/15">
                    {likedTracks.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Interactive Playlists shortcuts */}
        <div className="flex flex-col gap-4 border-t border-white/5 pt-5 px-2">
          <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest block">
            Kategori Utama
          </span>
          <div className="flex flex-col gap-2.5 text-xs text-gray-400">
            <button
              onClick={() => setActiveTab("dashboard")}
              className="flex items-center gap-2.5 hover:text-white mb-0.5 text-left transition-colors cursor-pointer"
            >
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>International Hits</span>
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className="flex items-center gap-2.5 hover:text-white mb-0.5 text-left transition-colors cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Trending Global</span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className="flex items-center gap-2.5 hover:text-white text-left transition-colors cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Lagu Tergila Disukai</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Dashboard Profile */}
      <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center gap-3">
          <img
            src={user.avatarUrl || "https://api.dicebear.com/7.x/pixel-art/svg?seed=music"}
            alt="Avatar"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-xl bg-[#111116] border border-white/10 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate leading-tight">
              {user.displayName}
            </div>
            <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest mt-0.5 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {user.isGuest ? "TAMU GUEST" : "PREMIUM GOLD"}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 text-xs font-bold font-sans transition-all duration-300 border border-transparent hover:border-rose-500/15 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
}
