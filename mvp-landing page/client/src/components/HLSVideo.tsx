/* =============================================================
   HLSVideo — HLS video background with Safari fallback
   Design: Liquid Brutalism Dark Premium
   Uses hls.js for HLS streams, native fallback for Safari
   ============================================================= */
import Hls from "hls.js";
import { useEffect, useRef } from "react";

interface HLSVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  poster?: string;
}

export default function HLSVideo({ src, className = "", style, poster }: HLSVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Safari native HLS support
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    // hls.js for other browsers
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => {
        hls.destroy();
      };
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      style={style}
      autoPlay
      loop
      muted
      playsInline
      poster={poster}
    />
  );
}
