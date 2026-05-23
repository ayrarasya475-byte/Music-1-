export interface Track {
  id: string;
  uri: string;
  url: string | null;
  name: string;
  duration_ms: number;
  explicit?: boolean;
  playcount?: number;
  artists: Array<{
    id: string | null;
    uri: string;
    url: string | null;
    name: string;
  }>;
  album: {
    id: string | null;
    uri: string;
    url: string | null;
    name: string | null;
    images: Array<{ url: string; width?: number; height?: number }>;
    color_dark?: string | null;
  };
  audio_url?: string; // High-quality audio preview stream
}

export interface Artist {
  id: string;
  uri: string;
  name: string;
  verified: boolean;
  images: Array<{ url: string }>;
  header_images?: Array<{ url: string }>;
  color?: string | null;
  statistics: {
    followers: number;
    monthly_listeners: number;
  };
  top_tracks: Array<{
    id: string;
    uri: string;
    name: string;
    playcount: number;
    duration_ms: number;
    album: {
      id: string | null;
      uri: string;
      images: Array<{ url: string }>;
    };
  }>;
}

export interface Playlist {
  id: string;
  uri: string;
  name: string;
  description: string | null;
  followers: number;
  images: Array<{ url: string }>;
  color?: string | null;
  owner?: {
    display_name: string | null;
    username: string | null;
  };
  tracks: Track[];
}

export interface LyricLine {
  timeMs: number;
  text: string;
  indonesian?: string;
}

export interface LyricsResponse {
  meaning: string;
  translationAvailable: boolean;
  lines: LyricLine[];
}

export type PlaybackMode = "HD" | "SuperHD_8K" | "Standard";

export interface UserState {
  isAuthenticated: boolean;
  isGuest: boolean;
  uid: string | null;
  displayName: string | null;
  email: string | null;
  avatarUrl: string | null;
}
