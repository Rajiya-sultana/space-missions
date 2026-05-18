"use client";

import { useAuth } from "@/context/AuthContext";
import { VideoPlayer } from "@/components/VideoPlayer";
import LoginComponent from "@/components/LoginComponent";
import { getProduct } from "@/data/products";
import { useProgress } from "@/hooks/useProgress";

const AUTH_ENABLED = true;

interface Props {
  missionId: number;
  videoUrl: string;
  title: string;
  productSlug: string;
  vertical?: boolean;
  lightMode?: boolean;
}

export default function ProtectedVideo({ missionId, videoUrl, title, productSlug, vertical = false, lightMode = false }: Props) {
  const aspect = vertical ? "aspect-[9/16]" : "aspect-video";
  const { user, loading, purchaseMap, amazonAccess, logout } = useAuth();
  const hasPurchase = purchaseMap[productSlug] ?? false;
  const hasAmazonAccess = amazonAccess?.productSlug === productSlug;
  const { markComplete } = useProgress(productSlug);

  if (!AUTH_ENABLED) {
    return <VideoPlayer videoUrl={videoUrl} title={title} onComplete={() => markComplete(missionId)} vertical={vertical} />;
  }

  // Mission 1 is always free
  if (missionId === 1) {
    return <VideoPlayer videoUrl={videoUrl} title={title} onComplete={() => markComplete(missionId)} vertical={vertical} />;
  }

  // Amazon order ID access — no login required
  if (hasAmazonAccess) {
    return <VideoPlayer videoUrl={videoUrl} title={title} onComplete={() => markComplete(missionId)} vertical={vertical} />;
  }

  if (loading) {
    return (
      <div className={`w-full ${aspect} rounded-2xl overflow-hidden bg-white/5 animate-pulse flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-white/10" />
          <div className="w-24 h-3 rounded-full bg-white/10" />
        </div>
      </div>
    );
  }

  const centeredCard = { maxWidth: '28rem', width: '100%', alignSelf: 'center' as const };

  if (!user) {
    return (
      <div style={centeredCard}>
        <LoginComponent productSlug={productSlug} lightMode={lightMode} />
      </div>
    );
  }

  if (!hasPurchase) {
    const product = getProduct(productSlug);
    const shopUrl = product?.shopifyUrl ?? "https://learnwhatmatters.in";

    const cardCls = lightMode
      ? "rounded-2xl p-8 text-center bg-white border border-gray-200 shadow-sm"
      : "glass-card rounded-2xl p-8 text-center";
    const headingCls = lightMode ? "font-bold text-gray-900 text-lg mb-2" : "font-bold text-white text-lg mb-2";
    const bodyCls = lightMode ? "text-gray-600 text-sm mb-6" : "text-slate-400 text-sm mb-6";
    const emailCls = lightMode ? "text-gray-900 font-medium break-all" : "text-white break-all";
    const logoutCls = lightMode
      ? "text-gray-400 hover:text-gray-700 text-xs mt-2 transition-colors"
      : "text-slate-500 hover:text-slate-300 text-xs mt-2 transition-colors";

    return (
      <div style={centeredCard} className={cardCls}>
        <div className="text-4xl mb-4">🔒</div>
        <h3 className={headingCls}>Purchase Required</h3>
        <p className={bodyCls}>
          You&apos;re logged in as{" "}
          <span className={emailCls}>{user.email}</span>
          {", "}but this mission requires a purchase.
        </p>
        <a
          href={shopUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-6 py-3 text-sm transition-colors mb-3"
        >
          Buy Now →
        </a>
        <br />
        <a
          href={`https://wa.me/919263358336?text=${encodeURIComponent("Hi! I already bought the Learn What Matters workbook but I'm unable to access the videos. Can you please help me?")}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 text-xs font-semibold mt-2 mb-1 px-4 py-2 rounded-lg border transition-colors ${lightMode ? "text-green-700 border-green-400 hover:bg-green-50" : "text-green-400 border-green-500/50 hover:bg-green-500/10"}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.528 5.855L.057 23.012a.75.75 0 0 0 .93.93l5.157-1.471A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.5-5.208-1.377l-.374-.214-3.878 1.107 1.107-3.878-.214-.374A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Need help? Chat with us
        </a>
        <br />
        <button onClick={logout} className={logoutCls}>
          Logout
        </button>
      </div>
    );
  }

  return <VideoPlayer videoUrl={videoUrl} title={title} onComplete={() => markComplete(missionId)} vertical={vertical} />;
}
