/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { MusicProvider, useMusic } from "./context/MusicContext";

// Import Custom Component Subviews
import SplashBoot from "./components/SplashBoot";
import AuthScreen from "./components/AuthScreen";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import SearchView from "./components/SearchView";
import HistoryView from "./components/HistoryView";
import ProfilView from "./components/ProfilView";
import PlayerBar from "./components/PlayerBar";
import LyricsPane from "./components/LyricsPane";

function AppContent() {
  const [isBooting, setIsBooting] = useState(true);
  const { user, activeTab } = useMusic();

  // 1. Render Majestic Boot Splash Screen
  if (isBooting) {
    return <SplashBoot onBootComplete={() => setIsBooting(false)} />;
  }

  // 2. Render Google Authentication / Guest Registration Screen
  if (!user.isAuthenticated) {
    return <AuthScreen />;
  }

  // 3. Render Master Layout Shell with dark slate theme
  return (
    <div className="flex flex-col h-screen w-screen bg-[#07070a] text-gray-150 overflow-hidden font-sans select-none relative">
      {/* Background glowing circle for luxurious visual rhythm */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />

      {/* Main view deck */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-96px)]">
        {/* Sidebar Left Navigation */}
        <Sidebar />

        {/* Dynamic content rendering frame */}
        <main className="flex-1 flex flex-col relative bg-[#09090e]/60 backdrop-blur-md overflow-hidden h-full">
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "search" && <SearchView />}
          {activeTab === "history" && <HistoryView />}
          {activeTab === "profil" && <ProfilView />}
        </main>
      </div>

      {/* Playerdeck (glowing sticky bottom bar) */}
      <PlayerBar />

      {/* Floating Fullscreen Lyrics Synchronizer */}
      <LyricsPane />
    </div>
  );
}

export default function App() {
  return (
    <MusicProvider>
      <AppContent />
    </MusicProvider>
  );
}
