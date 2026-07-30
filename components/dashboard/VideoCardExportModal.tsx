"use client";

import { useState, useRef, useEffect } from "react";
import { X, Video, Play, Pause, Download, Sparkles, Music, Check, RefreshCw } from "lucide-react";

interface VideoCardExportModalProps {
  invitationSlug: string;
  partnerOne: string;
  partnerTwo: string;
  weddingDate: string;
  venuePlace: string;
  onClose: () => void;
}

export default function VideoCardExportModal({
  invitationSlug,
  partnerOne,
  partnerTwo,
  weddingDate,
  venuePlace,
  onClose,
}: VideoCardExportModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [enableAudio, setEnableAudio] = useState(true);

  const cardWidth = 1080;
  const cardHeight = 1920;
  const animFrameId = useRef<number | null>(null);
  const startTime = useRef<number>(Date.now());

  // Particles for floating romance effect
  const particles = useRef(
    Array.from({ length: 25 }, () => ({
      x: Math.random() * cardWidth,
      y: Math.random() * cardHeight,
      radius: Math.random() * 8 + 3,
      speedY: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
    }))
  );

  const drawFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const elapsed = (Date.now() - startTime.current) / 1000; // time in seconds

    // 1. Background Fill (Rich Deep Crimson / Maroon Dark Romance gradient)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, cardHeight);
    bgGrad.addColorStop(0, "#4A121A");
    bgGrad.addColorStop(0.5, "#7A1F2B");
    bgGrad.addColorStop(1, "#2B0B10");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, cardWidth, cardHeight);

    // 2. Animated Pulsing Decorative Frame
    const pulse = Math.sin(elapsed * 2) * 4;
    ctx.strokeStyle = "#D9A441";
    ctx.lineWidth = 10 + pulse;
    ctx.strokeRect(60, 60, cardWidth - 120, cardHeight - 120);

    ctx.strokeStyle = "#FAF8F5";
    ctx.lineWidth = 3;
    ctx.strokeRect(80, 80, cardWidth - 160, cardHeight - 160);

    // 3. Draw Floating Particles (Romance Sparkles)
    particles.current.forEach((p) => {
      p.y -= p.speedY;
      if (p.y < 50) p.y = cardHeight - 50;

      ctx.fillStyle = `rgba(217, 164, 65, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Header Animation
    const headerY = 300 + Math.sin(elapsed * 1.5) * 6;
    ctx.textAlign = "center";
    ctx.fillStyle = "#D9A441";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText("INSTAGRAM STORY & WHATSAPP STATUS", cardWidth / 2, headerY);

    ctx.fillStyle = "#FAF8F5";
    ctx.font = "bold 34px serif";
    ctx.fillText("WE ARE GETTING MARRIED", cardWidth / 2, headerY + 60);

    // 5. Couple Names Animation (Fade & Scale rhythm)
    const nameAlpha = Math.min(1, elapsed * 0.8);
    ctx.globalAlpha = nameAlpha;

    ctx.fillStyle = "#D9A441";
    ctx.font = "bold 96px serif";
    ctx.fillText(partnerOne, cardWidth / 2, 580);

    ctx.fillStyle = "#FAF8F5";
    ctx.font = "italic 72px serif";
    ctx.fillText("&", cardWidth / 2, 690);

    ctx.fillStyle = "#D9A441";
    ctx.font = "bold 96px serif";
    ctx.fillText(partnerTwo, cardWidth / 2, 800);

    ctx.globalAlpha = 1.0;

    // 6. Wedding Date & Location Badge
    const badgeY = 1000;
    ctx.fillStyle = "rgba(250, 248, 245, 0.12)";
    ctx.fillRect(140, badgeY, cardWidth - 280, 260);
    ctx.strokeStyle = "#D9A441";
    ctx.lineWidth = 3;
    ctx.strokeRect(140, badgeY, cardWidth - 280, 260);

    ctx.fillStyle = "#D9A441";
    ctx.font = "bold 40px sans-serif";
    ctx.fillText("SAVE THE DATE", cardWidth / 2, badgeY + 70);

    ctx.fillStyle = "#FAF8F5";
    ctx.font = "bold 44px serif";
    ctx.fillText(weddingDate, cardWidth / 2, badgeY + 140);

    ctx.fillStyle = "#EFE7D8";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText(venuePlace, cardWidth / 2, badgeY + 210);

    // 7. Interactive Digital Card Link Footer Callout
    ctx.fillStyle = "#D9A441";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText("SWIPE UP OR CLICK TO RSVP", cardWidth / 2, cardHeight - 260);

    ctx.fillStyle = "#FAF8F5";
    ctx.font = "bold 30px monospace";
    ctx.fillText(`bervic.app/invitations/${invitationSlug}`, cardWidth / 2, cardHeight - 200);

    // Watermark
    ctx.fillStyle = "#FAF8F5";
    ctx.globalAlpha = 0.5;
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("BERVIC DIGITAL INVITATIONS", cardWidth / 2, cardHeight - 100);
    ctx.globalAlpha = 1.0;

    if (isPlaying) {
      animFrameId.current = requestAnimationFrame(drawFrame);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = cardWidth;
      canvas.height = cardHeight;
    }
    startTime.current = Date.now();
    drawFrame();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isPlaying, partnerOne, partnerTwo, weddingDate, venuePlace]);

  // Generate synthetic romantic ambient audio stream using Web Audio API
  const createAudioStream = (): MediaStreamTrack | null => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime); // Soft volume

      osc.connect(gain);
      const dest = audioCtx.createMediaStreamDestination();
      gain.connect(dest);

      osc.start();
      return dest.stream.getAudioTracks()[0] || null;
    } catch {
      return null;
    }
  };

  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecording(true);

    try {
      const canvasStream = canvas.captureStream(60); // 60 FPS video stream

      if (enableAudio) {
        const audioTrack = createAudioStream();
        if (audioTrack) {
          canvasStream.addTrack(audioTrack);
        }
      }

      // Check supported MIME types
      let mimeType = "video/webm";
      if (MediaRecorder.isTypeSupported("video/mp4")) {
        mimeType = "video/mp4";
      } else if (MediaRecorder.isTypeSupported("video/webm;codecs=h264")) {
        mimeType = "video/webm;codecs=h264";
      }

      const mediaRecorder = new MediaRecorder(canvasStream, {
        mimeType,
        videoBitsPerSecond: 8000000, // 8 Mbps high quality
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const ext = mimeType.includes("mp4") ? "mp4" : "webm";
        link.download = `${partnerOne}_and_${partnerTwo}_Story_Video.${ext}`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsRecording(false);
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 3000);
      };

      // Record 6-second video loop
      mediaRecorder.start();
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      }, 6000);
    } catch (err) {
      console.error("Video export error:", err);
      setIsRecording(false);
      alert("Failed to render video stream. Please ensure your browser supports MediaRecorder.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" data-lenis-prevent>
      <div data-lenis-prevent className="bg-[#F8F3EA] border-2 border-[#D9A441]/40 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-[#221C17] overscroll-contain">
        {/* Header */}
        <div className="p-5 border-b border-[#D9A441]/20 bg-[#EFE7D8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7A1F2B] text-[#D9A441] flex items-center justify-center shadow-md">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#221C17]">Instagram Story & WhatsApp Status MP4 Video Studio</h2>
              <p className="text-xs text-[#221C17]/70 font-medium">
                Vertical 9:16 (1080x1920) animated card video exporter
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 text-[#221C17]/70">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Studio */}
        <div data-lenis-prevent className="p-6 flex-1 overflow-y-auto flex flex-col items-center gap-6 overscroll-contain">

          <div className="relative border-4 border-[#D9A441]/40 rounded-2xl overflow-hidden shadow-2xl bg-black max-w-[320px] max-h-[568px] aspect-[9/16]">
            <canvas ref={canvasRef} className="w-full h-full object-contain" />

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute bottom-4 right-4 p-3 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all backdrop-blur-sm shadow-md"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>

          {/* Controls & Music Selector */}
          <div className="bg-[#EFE7D8] p-4 rounded-2xl border border-[#D9A441]/30 w-full max-w-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-[#7A1F2B]" />
              <span className="text-xs font-bold text-[#221C17]">Romantic Audio Track</span>
            </div>

            <button
              onClick={() => setEnableAudio(!enableAudio)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                enableAudio
                  ? "bg-[#7A1F2B] text-white"
                  : "bg-white text-[#221C17]/60 border border-[#D9A441]/30"
              }`}
            >
              {enableAudio ? "Audio Enabled" : "Muted"}
            </button>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-5 border-t border-[#D9A441]/20 bg-[#EFE7D8] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#D9A441]/40 text-xs font-semibold hover:bg-black/5"
          >
            Close Studio
          </button>

          <button
            onClick={handleExportVideo}
            disabled={isRecording}
            className="btn-maroon px-6 py-3 text-xs font-bold flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            {isRecording ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#D9A441]" />
                <span>Recording 6s MP4 Video...</span>
              </>
            ) : downloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>MP4 Video Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#D9A441]" />
                <span>Export Instagram / WhatsApp Status Video (MP4)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
