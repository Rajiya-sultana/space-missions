"use client";

import { useAuth } from "@/context/AuthContext";
import { VideoPlayer } from "@/components/VideoPlayer";
import LoginComponent from "@/components/LoginComponent";

interface Props {
  missionId: number;
  videoUrl: string;
  title: string;
}

export default function ProtectedVideo({ missionId, videoUrl, title }: Props) {
  const { user, loading, hasPurchase, logout } = useAuth();

  // Mission 1 is always free
  if (missionId === 1) {
    return <VideoPlayer videoUrl={videoUrl} title={title} />;
  }

  if (loading) {
    return (
      <div className="aspect-video rounded-2xl bg-white/5 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    );
  }

  // Not logged in — show login
  if (!user) {
    return <LoginComponent />;
  }

  // Logged in but no purchase
  if (!hasPurchase) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="font-bold text-white text-lg mb-2">Purchase Required</h3>
        <p className="text-slate-400 text-sm mb-6">
          You&apos;re logged in as <span className="text-white">{user.phoneNumber}</span>, but this mission requires a purchase.
        </p>
        <a
          href="https://learnwhatmatters.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-6 py-3 text-sm transition-colors mb-3"
        >
          Buy Now →
        </a>
        <br />
        <button onClick={logout} className="text-slate-500 hover:text-slate-300 text-xs mt-2 transition-colors">
          Logout
        </button>
      </div>
    );
  }

  // Logged in + has purchase — show video
  return <VideoPlayer videoUrl={videoUrl} title={title} />;
}
