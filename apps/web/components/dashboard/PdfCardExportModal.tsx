"use client";

import { useState, useRef, useEffect } from "react";
import { X, Download, FileText, Sparkles, Check, RefreshCw, Layers } from "lucide-react";

export interface PdfDesignOption {
  id: string;
  stitchId: string;
  name: string;
  tag: string;
  bgFill: string;
  themeColor: string;
  accentColor: string;
  textColor: string;
  isDarkBg: boolean;
  fontStyle: "serif" | "sans";
  frameType: "mandala" | "deco" | "lotus" | "arch" | "double-border" | "wreath" | "sunburst" | "floral-ring";
}

export const PDF_DESIGNS: PdfDesignOption[] = [
  {
    id: "royal-punjabi",
    stitchId: "4c108c0ddd0c46b38c0bb77d72fe2786",
    name: "Royal Punjabi",
    tag: "Royal Marigold & Crimson",
    bgFill: "#3D0A12",
    themeColor: "#E5B869",
    accentColor: "#D9A441",
    textColor: "#FFFFFF",
    isDarkBg: true,
    fontStyle: "serif",
    frameType: "mandala",
  },
  {
    id: "midnight-reception",
    stitchId: "3e3a2fe7b50241118e7e74737dec3c09",
    name: "Midnight Reception",
    tag: "Obsidian Night & Gold",
    bgFill: "#0B0F19",
    themeColor: "#C5A059",
    accentColor: "#D9A441",
    textColor: "#FFFFFF",
    isDarkBg: true,
    fontStyle: "sans",
    frameType: "deco",
  },
  {
    id: "traditional-hindu",
    stitchId: "6886436306d74ce9bf8d99462b6ce224",
    name: "Traditional Vedic",
    tag: "Lotus Arch & Deep Maroon",
    bgFill: "#500A15",
    themeColor: "#E5B869",
    accentColor: "#F5D089",
    textColor: "#FFFFFF",
    isDarkBg: true,
    fontStyle: "serif",
    frameType: "lotus",
  },
  {
    id: "boho-botanical",
    stitchId: "665ba0161a394275a39dd3a565193208",
    name: "Boho Botanical",
    tag: "Sage Green & Terracotta Arch",
    bgFill: "#EBF0E6",
    themeColor: "#3D5A45",
    accentColor: "#C4714A",
    textColor: "#2B3D30",
    isDarkBg: false,
    fontStyle: "serif",
    frameType: "arch",
  },
  {
    id: "classic-bordered",
    stitchId: "73bb430851434016ac085947a884ec3b",
    name: "Classic Bordered",
    tag: "Vintage Cream & Gold Ruled",
    bgFill: "#FDF6F0",
    themeColor: "#7A1F2B",
    accentColor: "#C9A84C",
    textColor: "#2B2320",
    isDarkBg: false,
    fontStyle: "serif",
    frameType: "double-border",
  },
  {
    id: "lavender-engagement",
    stitchId: "2e13edbaef3347229ea3480f768f54d4",
    name: "Lavender Amethyst",
    tag: "Soft Blush & Wreath Ring",
    bgFill: "#F4EFF9",
    themeColor: "#5C3D75",
    accentColor: "#B8A8D4",
    textColor: "#3A264C",
    isDarkBg: false,
    fontStyle: "serif",
    frameType: "wreath",
  },
  {
    id: "glamorous-night",
    stitchId: "cd4530048e204f4f8930401b35529b56",
    name: "Glamorous Night",
    tag: "Velvet Obsidian & Sunburst",
    bgFill: "#121212",
    themeColor: "#E2C37A",
    accentColor: "#F5DF9E",
    textColor: "#FFFFFF",
    isDarkBg: true,
    fontStyle: "sans",
    frameType: "sunburst",
  },
  {
    id: "fine-art-floral",
    stitchId: "34487e8c4055412188b5541a3f7005c5",
    name: "Fine Art Floral",
    tag: "Rose Gold Botanical Bloom",
    bgFill: "#FDF0F2",
    themeColor: "#7A1F2B",
    accentColor: "#C4837B",
    textColor: "#4A1E28",
    isDarkBg: false,
    fontStyle: "serif",
    frameType: "floral-ring",
  },
];

interface PdfCardExportModalProps {
  templateSlug?: string;
  invitationSlug: string;
  partnerOne: string;
  partnerTwo: string;
  weddingDate: string;
  venuePlace: string;
  coupleImage?: string;
  tagline?: string;
  coupleInitials?: string;
  onClose: () => void;
}

export default function PdfCardExportModal({
  templateSlug = "classic-floral",
  invitationSlug,
  partnerOne,
  partnerTwo,
  weddingDate,
  venuePlace,
  coupleImage,
  tagline = "TOGETHER WITH THEIR FAMILIES",
  coupleInitials = "W",
  onClose,
}: PdfCardExportModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Default to matching template design or first design
  const initialDesignIndex = PDF_DESIGNS.findIndex(d =>
    templateSlug.includes(d.id) || d.name.toLowerCase().includes(templateSlug.toLowerCase())
  );

  const [selectedDesignId, setSelectedDesignId] = useState<string>(
    initialDesignIndex >= 0 ? PDF_DESIGNS[initialDesignIndex].id : "royal-punjabi"
  );
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<"image" | "pdf">("image");

  const cardWidth = 1080;
  const cardHeight = 1920;

  const currentDesign = PDF_DESIGNS.find(d => d.id === selectedDesignId) || PDF_DESIGNS[0];

  const renderCardCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = cardWidth;
    canvas.height = cardHeight;

    const { bgFill, themeColor, accentColor, textColor, isDarkBg, fontStyle, frameType } = currentDesign;
    const isSerif = fontStyle === "serif";

    // 1. Background Fill
    ctx.fillStyle = bgFill;
    ctx.fillRect(0, 0, cardWidth, cardHeight);

    // 2. Frame & Border Decorations matching template style
    if (frameType === "double-border") {
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 14;
      ctx.strokeRect(46, 46, cardWidth - 92, cardHeight - 92);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(66, 66, cardWidth - 132, cardHeight - 132);

      ctx.fillStyle = accentColor;
      [
        { x: 90, y: 90 }, { x: cardWidth - 90, y: 90 },
        { x: 90, y: cardHeight - 90 }, { x: cardWidth - 90, y: cardHeight - 90 },
      ].forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (frameType === "mandala" || frameType === "lotus") {
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 10;
      ctx.strokeRect(40, 40, cardWidth - 80, cardHeight - 80);

      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(56, 56, cardWidth - 112, cardHeight - 112);

      // Mandala Corner Motifs
      ctx.fillStyle = accentColor;
      [
        { x: 40, y: 40, dx: 1, dy: 1 },
        { x: cardWidth - 40, y: 40, dx: -1, dy: 1 },
        { x: 40, y: cardHeight - 40, dx: 1, dy: -1 },
        { x: cardWidth - 40, y: cardHeight - 40, dx: -1, dy: -1 },
      ].forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x + c.dx * 70, c.y + c.dy * 70, 36, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (frameType === "sunburst" || frameType === "deco") {
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 8;
      ctx.strokeRect(44, 44, cardWidth - 88, cardHeight - 88);

      // Sunburst Corner Ray Lines
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      [
        { x: 44, y: 44, dx: 1, dy: 1 },
        { x: cardWidth - 44, y: 44, dx: -1, dy: 1 },
        { x: 44, y: cardHeight - 44, dx: 1, dy: -1 },
        { x: cardWidth - 44, y: cardHeight - 44, dx: -1, dy: -1 },
      ].forEach(c => {
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(c.x + c.dx * (40 + i * 20), c.y + c.dy * (120 - i * 15));
          ctx.stroke();
        }
      });
    } else if (frameType === "arch") {
      // Terracotta Arch Border
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 8;
      ctx.strokeRect(40, 40, cardWidth - 80, cardHeight - 80);

      // Inner Arch SVG Path
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cardWidth / 2, 380, 240, Math.PI, 0);
      ctx.lineTo(cardWidth / 2 + 240, cardHeight - 120);
      ctx.lineTo(cardWidth / 2 - 240, cardHeight - 120);
      ctx.closePath();
      ctx.stroke();
    } else {
      // Soft Wreath / Floral Ring Frame
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 6;
      ctx.strokeRect(50, 50, cardWidth - 100, cardHeight - 100);
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(62, 62, cardWidth - 124, cardHeight - 124);
    }

    // 3. Top Tagline Header
    ctx.textAlign = "center";
    ctx.fillStyle = accentColor;
    ctx.font = "bold 24px sans-serif";
    ctx.fillText((tagline || "TOGETHER WITH THEIR FAMILIES").toUpperCase(), cardWidth / 2, 220);

    ctx.fillStyle = isDarkBg ? "#FFFFFF" : themeColor;
    ctx.font = isSerif ? "bold 28px serif" : "bold 26px sans-serif";
    ctx.fillText("JOYFULLY INVITE YOU TO CELEBRATE THE WEDDING OF", cardWidth / 2, 275);

    // 4. Optional Couple Photo
    if (coupleImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = coupleImage;
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cardWidth / 2, 440, 135, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, cardWidth / 2 - 135, 305, 270, 270);
        ctx.restore();

        // Photo Frame Ring
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(cardWidth / 2, 440, 137, 0, Math.PI * 2);
        ctx.stroke();

        renderText(ctx, 650);
      };
      img.onerror = () => renderText(ctx, 410);
    } else {
      renderText(ctx, 410);
    }

    function renderText(ctx: CanvasRenderingContext2D, startY: number) {
      const nameFont = isSerif ? "bold 82px serif" : "bold 76px sans-serif";
      const primaryTextColor = isDarkBg ? "#FFFFFF" : textColor;

      // Partner One Name
      ctx.fillStyle = primaryTextColor;
      ctx.font = nameFont;
      ctx.fillText(partnerOne, cardWidth / 2, startY);

      // Ampersand
      ctx.fillStyle = accentColor;
      ctx.font = "italic 62px serif";
      ctx.fillText("&", cardWidth / 2, startY + 90);

      // Partner Two Name
      ctx.fillStyle = primaryTextColor;
      ctx.font = nameFont;
      ctx.fillText(partnerTwo, cardWidth / 2, startY + 190);

      // Divider Line
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cardWidth / 2 - 180, startY + 260);
      ctx.lineTo(cardWidth / 2 + 180, startY + 260);
      ctx.stroke();

      // Date & Time
      ctx.fillStyle = isDarkBg ? accentColor : themeColor;
      ctx.font = "bold 32px sans-serif";
      ctx.fillText("DATE & TIME", cardWidth / 2, startY + 340);

      ctx.fillStyle = primaryTextColor;
      ctx.font = isSerif ? "bold 40px serif" : "bold 36px sans-serif";
      ctx.fillText(weddingDate, cardWidth / 2, startY + 400);

      // Venue Location
      ctx.fillStyle = isDarkBg ? accentColor : themeColor;
      ctx.font = "bold 32px sans-serif";
      ctx.fillText("VENUE LOCATION", cardWidth / 2, startY + 500);

      ctx.fillStyle = primaryTextColor;
      ctx.font = isSerif ? "bold 36px serif" : "bold 32px sans-serif";

      const words = (venuePlace || "The Grand Ballroom").split(" ");
      let line = "";
      let y = startY + 560;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 750 && n > 0) {
          ctx.fillText(line, cardWidth / 2, y);
          line = words[n] + " ";
          y += 48;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, cardWidth / 2, y);

      // Digital RSVP Section Box
      const rsvpBoxY = Math.min(y + 70, cardHeight - 380);
      ctx.fillStyle = isDarkBg ? "rgba(255,255,255,0.08)" : "#FAF8F5";
      ctx.fillRect(140, rsvpBoxY, cardWidth - 280, 230);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(140, rsvpBoxY, cardWidth - 280, 230);

      ctx.fillStyle = isDarkBg ? accentColor : themeColor;
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("INTERACTIVE DIGITAL INVITATION & RSVP", cardWidth / 2, rsvpBoxY + 55);

      ctx.fillStyle = primaryTextColor;
      ctx.font = "bold 24px monospace";
      ctx.fillText(`bervic.app/invitations/${invitationSlug}`, cardWidth / 2, rsvpBoxY + 115);

      ctx.fillStyle = accentColor;
      ctx.font = "italic 20px serif";
      ctx.fillText("Scan or open link to RSVP & view live event directions", cardWidth / 2, rsvpBoxY + 175);

      // Footer Branding
      ctx.fillStyle = primaryTextColor;
      ctx.globalAlpha = 0.6;
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`BERVIC HIGH-RES PRINTABLE SUITE • ${currentDesign.name.toUpperCase()}`, cardWidth / 2, cardHeight - 70);
      ctx.globalAlpha = 1.0;
    }
  };

  useEffect(() => {
    renderCardCanvas();
  }, [selectedDesignId, partnerOne, partnerTwo, weddingDate, venuePlace, coupleImage, tagline]);

  const handleDownloadHighRes = async (format: "image" | "pdf") => {
    setDownloading(true);
    setDownloadFormat(format);
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const fileName = `${partnerOne}_and_${partnerTwo}_${currentDesign.name.replace(/\s+/g, '_')}_HighRes`;

      if (format === "image") {
        const imageUri = canvas.toDataURL("image/jpeg", 1.0);
        const link = document.createElement("a");
        link.download = `${fileName}.jpg`;
        link.href = imageUri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const { jsPDF } = await import("jspdf");
        const imgData = canvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [1080, 1920] });
        pdf.addImage(imgData, "PNG", 0, 0, 1080, 1920);
        pdf.save(`${fileName}.pdf`);
      }

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3500);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" data-lenis-prevent>
      <div data-lenis-prevent className="bg-[#F8F3EA] border-2 border-[#D9A441]/40 rounded-3xl w-full max-w-3xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-[#221C17] overscroll-contain">
        {/* Header */}
        <div className="p-4 px-6 border-b border-[#D9A441]/20 bg-[#EFE7D8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7A1F2B] text-[#D9A441] flex items-center justify-center shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#221C17] flex items-center gap-2">
                High-Res Card & Printable PDF Studio
                <span className="px-2.5 py-0.5 rounded-full bg-[#7A1F2B] text-[#F8F3EA] text-[10px] uppercase tracking-wider font-extrabold">
                  {currentDesign.name}
                </span>
              </h2>
              <p className="text-xs text-[#221C17]/70 font-medium">
                Choose any of the 8 high-resolution printable card designs below
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 text-[#221C17]/70">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 8-TEMPLATE DESIGN SELECTOR RIBBON */}
        <div className="p-3 px-6 bg-[#E8DFC9] border-b border-[#D9A441]/20 flex flex-col gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#7A1F2B]">
            Select Design Template ({PDF_DESIGNS.length} Printable Styles Available)
          </span>
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
            {PDF_DESIGNS.map(d => {
              const isSelected = d.id === selectedDesignId;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDesignId(d.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold shrink-0 transition-all ${
                    isSelected
                      ? "bg-[#7A1F2B] text-[#F8F3EA] border-[#7A1F2B] shadow-md scale-105"
                      : "bg-[#F8F3EA] text-[#221C17] border-[#D9A441]/40 hover:bg-[#FAF7F2]"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: d.bgFill }}
                  />
                  <span>{d.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#D9A441]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content & Canvas Live Preview */}
        <div data-lenis-prevent className="p-5 flex-1 overflow-y-auto flex flex-col items-center gap-4 overscroll-contain">
          <div className="relative border-4 border-[#D9A441]/40 rounded-2xl overflow-hidden shadow-2xl bg-white max-w-[280px] max-h-[497px] aspect-[9/16]">
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
          </div>

          <div className="text-center max-w-md">
            <h4 className="text-sm font-bold text-[#221C17]">
              {currentDesign.name} — {currentDesign.tag}
            </h4>
            <p className="text-xs text-[#221C17]/70 mt-0.5">
              Pre-populated with couple names, date, venue, tagline, photo, and interactive RSVP link.
            </p>
          </div>
        </div>

        {/* Action Footer with Both JPG & PDF Buttons */}
        <div className="p-4 px-6 border-t border-[#D9A441]/20 bg-[#EFE7D8] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#D9A441]/40 text-xs font-semibold hover:bg-black/5"
          >
            Close
          </button>

          <div className="flex gap-2.5">
            <button
              onClick={() => handleDownloadHighRes("image")}
              disabled={downloading}
              className="px-5 py-2.5 rounded-xl bg-[#D9A441] text-[#221C17] text-xs font-bold flex items-center gap-2 shadow-md hover:bg-[#c49235] transition-all disabled:opacity-50"
            >
              {downloading && downloadFormat === "image" ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>High-Res JPG (1080x1920)</span>
            </button>

            <button
              onClick={() => handleDownloadHighRes("pdf")}
              disabled={downloading}
              className="btn-maroon px-5 py-2.5 text-xs font-bold flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              {downloading && downloadFormat === "pdf" ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D9A441]" />
                  <span>Generating PDF...</span>
                </>
              ) : downloaded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export Complete!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>Printable PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
