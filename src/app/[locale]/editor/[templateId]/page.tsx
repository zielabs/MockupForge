"use client";

import { useTranslations } from "next-intl";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import ProductShape from "@/components/editor/ProductShape";
import { Save, Download, Palette, Paintbrush, Upload, Trash2, RotateCcw, Lock, Loader2, ArrowUpFromLine, Plus, Layers, ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";

const productColors = [
  "#FFFFFF", "#1A1A2E", "#6C5CE7", "#FF6B6B", "#00B894",
  "#FDCB6E", "#0984E3", "#E17055", "#636E72", "#2D3436",
];

const bgColors = [
  "#FFFFFF", "#F5F5F5", "#E8E8E8", "#1A1A2E", "#6C5CE7",
  "#FFF3E0", "#E8F5E9", "#E3F2FD",
];

const categoryToShape: Record<string, string> = {
  TSHIRT: "tshirt", HOODIE: "hoodie",
  HAT: "cap", MUG: "mug", TUMBLER: "tumbler",
  TOTEBAG: "totebag",
};

const categoryToEmoji: Record<string, string> = {
  TSHIRT: "", HOODIE: "",
  HAT: "", MUG: "", TUMBLER: "",
  TOTEBAG: "",
};

type ExportFormat = "png" | "jpg" | "webp";

// Local slug-to-template fallback — used when API fails or DB is not seeded
const slugFallbackMap: Record<string, { name: string; category: string }> = {
  "basic-tshirt-front": { name: "Basic T-Shirt Front", category: "TSHIRT" },
  "basic-tshirt-back": { name: "Basic T-Shirt Back", category: "TSHIRT" },
  "premium-tshirt": { name: "Premium T-Shirt", category: "TSHIRT" },
  "hoodie-front": { name: "Hoodie Front", category: "HOODIE" },
  "baseball-cap": { name: "Baseball Cap", category: "HAT" },
  "coffee-mug": { name: "Coffee Mug", category: "MUG" },
  "travel-tumbler": { name: "Travel Tumbler", category: "TUMBLER" },
  "canvas-totebag": { name: "Canvas Tote Bag", category: "TOTEBAG" },

  "white-mug-premium": { name: "White Mug Premium", category: "MUG" },
  "oversized-tshirt": { name: "Oversized T-Shirt", category: "TSHIRT" },
};

function resolveFromSlug(slug: string) {
  const fallback = slugFallbackMap[slug];
  if (fallback) {
    return {
      name: fallback.name,
      emoji: categoryToEmoji[fallback.category] || "",
      shape: categoryToShape[fallback.category] || "tshirt",
    };
  }
  return { name: "Mockup Template", emoji: "", shape: "tshirt" };
}

export default function EditorPage() {
  const t = useTranslations("editor");
  const pathname = usePathname();
  const params = useParams();
  const { data: session } = useSession();
  const locale = pathname.startsWith("/en") ? "en" : "id";
  const templateId = params.templateId as string;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Multi-layer design system
  interface DesignLayer {
    id: string;
    image: string;
    scale: number;
    rotation: number;
    posX: number;
    posY: number;
    visible: boolean;
    name: string;
  }

  const [designLayers, setDesignLayers] = useState<DesignLayer[]>([]);
  const [activeLayerIdx, setActiveLayerIdx] = useState<number>(0);
  const [productColor, setProductColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#F5F5F5");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"design" | "color" | "export">("design");
  const [zoom, setZoom] = useState(1);
  const initialTpl = resolveFromSlug(templateId);
  const [tpl, setTpl] = useState(initialTpl);
  const [resolvedTemplateId, setResolvedTemplateId] = useState<string>(templateId);

  // Active layer helpers
  const activeLayer = designLayers[activeLayerIdx] || null;
  const updateActiveLayer = (updates: Partial<DesignLayer>) => {
    setDesignLayers(prev => prev.map((l, i) => i === activeLayerIdx ? { ...l, ...updates } : l));
  };
  const removeLayer = (idx: number) => {
    setDesignLayers(prev => prev.filter((_, i) => i !== idx));
    if (activeLayerIdx >= idx && activeLayerIdx > 0) setActiveLayerIdx(activeLayerIdx - 1);
  };
  const moveLayer = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= designLayers.length) return;
    setDesignLayers(prev => {
      const arr = [...prev];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
    setActiveLayerIdx(newIdx);
  };

  // Fetch template data from API
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await fetch("/api/templates");
        if (res.ok) {
          const data = await res.json();
          // Match by slug first (preferred), then by id
          const found = data.templates?.find(
            (t: any) => t.slug === templateId || t.id === templateId
          );
          if (found) {
            setTpl({
              name: found.name,
              emoji: categoryToEmoji[found.category] || "",
              shape: categoryToShape[found.category] || "tshirt",
            });
            setResolvedTemplateId(found.id);
            return;
          }
        }
      } catch { /* fallback below */ }
      // Fallback: resolve from the URL slug directly
      setTpl(resolveFromSlug(templateId));
    };
    fetchTemplate();
  }, [templateId]);

  const userPlan = (session?.user as any)?.subscription?.plan;
  const isPro = !!session?.user && userPlan !== "FREE" && userPlan !== undefined;

  // Initialize Fabric.js canvas
  useEffect(() => {
    let canvas: any = null;
    const initCanvas = async () => {
      try {
        const fabric = await import("fabric");
        if (!canvasRef.current) return;
        canvas = new fabric.Canvas(canvasRef.current, {
          width: 500,
          height: 500,
          backgroundColor: bgColor,
          selection: true,
        });
        fabricRef.current = canvas;
      } catch {
        console.warn("Fabric.js init deferred");
      }
    };
    initCanvas();
    return () => { if (canvas) canvas.dispose(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update background color
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.backgroundColor = bgColor;
      fabricRef.current.renderAll();
    }
  }, [bgColor]);

  const addDesignLayer = useCallback((dataUrl: string) => {
    const newLayer: DesignLayer = {
      id: `layer-${Date.now()}`,
      image: dataUrl,
      scale: 100,
      rotation: 0,
      posX: 0,
      posY: 0,
      visible: true,
      name: `Design ${designLayers.length + 1}`,
    };
    setDesignLayers(prev => [...prev, newLayer]);
    setActiveLayerIdx(designLayers.length);
  }, [designLayers.length]);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => addDesignLayer(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
    // Reset input so the same file can be uploaded again
    if (e.target) e.target.value = "";
  }, [addDesignLayer]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => addDesignLayer(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, [addDesignLayer]);

  const drawShapeOnCanvas = useCallback((ctx: CanvasRenderingContext2D, r: number, size: number) => {
    const cx = size / 2, cy = size / 2;
    ctx.fillStyle = productColor;
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 2 * r;
    ctx.shadowColor = "rgba(0,0,0,0.08)";
    ctx.shadowBlur = 12 * r;

    const shape = tpl.shape;
    ctx.beginPath();
    if (shape === "tshirt") {
      const s = r * 0.7;
      ctx.moveTo(cx - 100*s, cy - 180*s);
      ctx.lineTo(cx - 40*s, cy - 180*s);
      ctx.bezierCurveTo(cx - 35*s, cy - 150*s, cx - 10*s, cy - 130*s, cx, cy - 130*s);
      ctx.bezierCurveTo(cx + 10*s, cy - 130*s, cx + 35*s, cy - 150*s, cx + 40*s, cy - 180*s);
      ctx.lineTo(cx + 100*s, cy - 180*s);
      ctx.lineTo(cx + 180*s, cy - 100*s);
      ctx.lineTo(cx + 140*s, cy - 60*s);
      ctx.lineTo(cx + 100*s, cy - 80*s);
      ctx.lineTo(cx + 100*s, cy + 180*s);
      ctx.quadraticCurveTo(cx + 100*s, cy + 190*s, cx + 80*s, cy + 190*s);
      ctx.lineTo(cx - 80*s, cy + 190*s);
      ctx.quadraticCurveTo(cx - 100*s, cy + 190*s, cx - 100*s, cy + 180*s);
      ctx.lineTo(cx - 100*s, cy - 80*s);
      ctx.lineTo(cx - 140*s, cy - 60*s);
      ctx.lineTo(cx - 180*s, cy - 100*s);
      ctx.closePath();
    } else if (shape === "cap") {
      const s = r * 0.8;
      ctx.ellipse(cx, cy + 40*s, 170*s, 40*s, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy + 40*s, 160*s, Math.PI, 0, false);
      ctx.closePath();
    } else if (shape === "mug") {
      const s = r * 0.7;
      ctx.roundRect(cx - 110*s, cy - 140*s, 220*s, 280*s, 12*s);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 130*s, cy, 40*s, -Math.PI/2, Math.PI/2, false);
      ctx.lineWidth = 14*r*0.7;
      ctx.strokeStyle = productColor;
      ctx.stroke();
      ctx.strokeStyle = "rgba(0,0,0,0.06)";
      ctx.lineWidth = 2*r;
      ctx.beginPath();
    } else if (shape === "hoodie") {
      const s = r * 0.65;
      ctx.moveTo(cx - 100*s, cy - 160*s);
      ctx.lineTo(cx - 50*s, cy - 180*s);
      ctx.bezierCurveTo(cx - 40*s, cy - 145*s, cx - 15*s, cy - 125*s, cx, cy - 120*s);
      ctx.bezierCurveTo(cx + 15*s, cy - 125*s, cx + 40*s, cy - 145*s, cx + 50*s, cy - 180*s);
      ctx.lineTo(cx + 110*s, cy - 160*s);
      ctx.lineTo(cx + 190*s, cy - 80*s);
      ctx.lineTo(cx + 150*s, cy - 40*s);
      ctx.lineTo(cx + 110*s, cy - 60*s);
      ctx.lineTo(cx + 110*s, cy + 190*s);
      ctx.quadraticCurveTo(cx + 110*s, cy + 200*s, cx + 90*s, cy + 200*s);
      ctx.lineTo(cx - 90*s, cy + 200*s);
      ctx.quadraticCurveTo(cx - 110*s, cy + 200*s, cx - 110*s, cy + 190*s);
      ctx.lineTo(cx - 110*s, cy - 60*s);
      ctx.lineTo(cx - 150*s, cy - 40*s);
      ctx.lineTo(cx - 190*s, cy - 80*s);
      ctx.closePath();
    } else if (shape === "totebag") {
      const s = r * 0.7;
      ctx.moveTo(cx - 120*s, cy - 100*s);
      ctx.lineTo(cx + 120*s, cy - 100*s);
      ctx.lineTo(cx + 100*s, cy + 190*s);
      ctx.quadraticCurveTo(cx + 100*s, cy + 200*s, cx + 80*s, cy + 200*s);
      ctx.lineTo(cx - 80*s, cy + 200*s);
      ctx.quadraticCurveTo(cx - 100*s, cy + 200*s, cx - 100*s, cy + 190*s);
      ctx.closePath();
    } else {
      // tumbler or fallback
      const s = r * 0.7;
      ctx.roundRect(cx - 75*s, cy - 180*s, 150*s, 360*s, 10*s);
    }
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [productColor, tpl.shape]);

  const handleExport = useCallback(() => {
    // Enforce free tier: only PNG allowed
    if (!isPro && exportFormat !== "png") {
      alert(locale === "id" ? "Format JPG/WebP hanya untuk Pro. Silakan upgrade!" : "JPG/WebP format is Pro only. Please upgrade!");
      setExportFormat("png");
      return;
    }

    setIsExporting(true);
    const canvas = document.createElement("canvas");
    const size = isPro ? 1920 : 720;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const r = size / 500;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // Draw product shape
    drawShapeOnCanvas(ctx, r, size);

    // Draw all visible design layers
    const visibleLayers = designLayers.filter(l => l.visible);
    if (visibleLayers.length > 0) {
      let loaded = 0;
      const total = visibleLayers.length;
      visibleLayers.forEach((layer) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          ctx.save();
          const cx = size / 2 + layer.posX * r;
          const cy = size / 2 + layer.posY * r;
          ctx.translate(cx, cy);
          ctx.rotate((layer.rotation * Math.PI) / 180);
          const s = (layer.scale / 100) * r;
          const drawW = 120 * s, drawH = 120 * s;
          ctx.drawImage(img, -drawW, -drawH, drawW * 2, drawH * 2);
          ctx.restore();
          loaded++;
          if (loaded === total) addWatermarkAndDownload(ctx, canvas, size);
        };
        img.src = layer.image;
      });
    } else {
      addWatermarkAndDownload(ctx, canvas, size);
    }
  }, [bgColor, productColor, designLayers, isPro, exportFormat, templateId, drawShapeOnCanvas, locale]);

  const addWatermarkAndDownload = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, size: number) => {
    if (!isPro) {
      ctx.fillStyle = "rgba(108, 92, 231, 0.3)";
      ctx.font = `bold ${Math.round(size * 0.035)}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("MockupForge — Free", size / 2, size - size * 0.04);
    }
    // Force PNG for free users
    const actualFormat = isPro ? exportFormat : "png";
    const mimeType = actualFormat === "jpg" ? "image/jpeg" : actualFormat === "webp" ? "image/webp" : "image/png";
    const link = document.createElement("a");
    link.download = `mockup-${tpl.name.replace(/\s+/g, "-").toLowerCase()}.${actualFormat}`;
    link.href = canvas.toDataURL(mimeType, 0.92);
    link.click();
    setTimeout(() => setIsExporting(false), 500);
  };

  const handleSave = useCallback(async () => {
    if (!session?.user) return;

    // Enforce free tier: max 3 saves
    if (!isPro) {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          if (data.projects && data.projects.length >= 3) {
            alert(locale === "id"
              ? "Batas 3 proyek tercapai. Upgrade ke Pro untuk menyimpan lebih banyak!"
              : "Free plan limit: 3 projects. Upgrade to Pro for more!");
            return;
          }
        }
      } catch { /* proceed */ }
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: resolvedTemplateId,
          name: tpl.name,
          designConfig: { productColor, bgColor, designLayers },
        }),
      });
      if (res.ok) {
        alert(locale === "id" ? "Proyek berhasil disimpan!" : "Project saved successfully!");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(locale === "id"
          ? `Gagal menyimpan: ${data.error || "Terjadi kesalahan"}`
          : `Save failed: ${data.error || "Something went wrong"}`);
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert(locale === "id" ? "Gagal menyimpan proyek" : "Failed to save project");
    }
    setTimeout(() => setIsSaving(false), 600);
  }, [session, resolvedTemplateId, tpl.name, productColor, bgColor, designLayers, isPro, locale]);

  const handleReset = () => {
    if (activeLayer) {
      updateActiveLayer({ scale: 100, rotation: 0, posX: 0, posY: 0 });
    }
  };

  return (
    <div className="editor-page">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <Link href={`/${locale}/templates`} className="toolbar-back">
          ← {t("back")}
        </Link>
        <div className="toolbar-center">
          <span className="toolbar-emoji">{tpl.emoji}</span>
          <span className="toolbar-title">{tpl.name}</span>
        </div>
        <div className="toolbar-actions">
          {session?.user && (
            <button className="btn btn-ghost btn-sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 size={14} className="spin" /> : <Save size={14} />} {locale === "id" ? "Simpan" : "Save"}
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Loader2 size={14} className="spin" /> : <Download size={14} />} {isExporting ? t("exporting") : t("export")}
          </button>
        </div>
      </div>

      <div className="editor-body">
        {/* Left Sidebar */}
        <div className="editor-sidebar">
          <div className="sidebar-tabs">
            <button className={`tab-btn ${activeTab === "design" ? "active" : ""}`} onClick={() => setActiveTab("design")}>
              <Palette size={14} /> {locale === "id" ? "Desain" : "Design"}
            </button>
            <button className={`tab-btn ${activeTab === "color" ? "active" : ""}`} onClick={() => setActiveTab("color")}>
              <Paintbrush size={14} /> {locale === "id" ? "Warna" : "Color"}
            </button>
            <button className={`tab-btn ${activeTab === "export" ? "active" : ""}`} onClick={() => setActiveTab("export")}>
              <Download size={14} /> Export
            </button>
          </div>

          {activeTab === "design" && (
            <>
              <div className="sidebar-section">
                <h4><Upload size={12} /> {locale === "id" ? "UPLOAD DESAIN" : "UPLOAD DESIGN"}</h4>
                <div className="upload-zone" onClick={() => fileRef.current?.click()} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                  <div className="upload-icon"><Plus size={20} /></div>
                  <p>{designLayers.length > 0
                    ? (locale === "id" ? "Tambah desain lain" : "Add another design")
                    : t("uploadHint")
                  }</p>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} hidden />
                </div>
              </div>

              {/* Layer Management */}
              {designLayers.length > 0 && (
                <div className="sidebar-section">
                  <h4><Layers size={12} /> {locale === "id" ? "LAYER DESAIN" : "DESIGN LAYERS"} ({designLayers.length})</h4>
                  <div className="layers-list">
                    {designLayers.map((layer, idx) => (
                      <div key={layer.id} className={`layer-item ${idx === activeLayerIdx ? "active" : ""}`} onClick={() => setActiveLayerIdx(idx)}>
                        <div className="layer-thumb">
                          <img src={layer.image} alt={layer.name} />
                        </div>
                        <span className="layer-name">{layer.name}</span>
                        <div className="layer-actions">
                          <button className="layer-action-btn" title={layer.visible ? "Hide" : "Show"} onClick={(e) => { e.stopPropagation(); setDesignLayers(prev => prev.map((l, i) => i === idx ? { ...l, visible: !l.visible } : l)); }}>
                            {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                          </button>
                          <button className="layer-action-btn" title="Move up" onClick={(e) => { e.stopPropagation(); moveLayer(idx, -1); }} disabled={idx === 0}>
                            <ChevronUp size={12} />
                          </button>
                          <button className="layer-action-btn" title="Move down" onClick={(e) => { e.stopPropagation(); moveLayer(idx, 1); }} disabled={idx === designLayers.length - 1}>
                            <ChevronDown size={12} />
                          </button>
                          <button className="layer-action-btn layer-delete" title="Delete" onClick={(e) => { e.stopPropagation(); removeLayer(idx); }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Per-layer controls */}
              {activeLayer && (
                <>
                  <div className="sidebar-section">
                    <h4>{t("scale")} — {activeLayer.name}</h4>
                    <input type="range" min="20" max="200" value={activeLayer.scale} onChange={(e) => updateActiveLayer({ scale: Number(e.target.value) })} />
                    <span className="ctrl-val">{activeLayer.scale}%</span>
                  </div>
                  <div className="sidebar-section">
                    <h4>{t("rotation")}</h4>
                    <input type="range" min="-180" max="180" value={activeLayer.rotation} onChange={(e) => updateActiveLayer({ rotation: Number(e.target.value) })} />
                    <span className="ctrl-val">{activeLayer.rotation}°</span>
                  </div>
                  <div className="sidebar-section">
                    <h4>{t("position")} X</h4>
                    <input type="range" min="-150" max="150" value={activeLayer.posX} onChange={(e) => updateActiveLayer({ posX: Number(e.target.value) })} />
                    <span className="ctrl-val">{activeLayer.posX}px</span>
                  </div>
                  <div className="sidebar-section">
                    <h4>{t("position")} Y</h4>
                    <input type="range" min="-150" max="150" value={activeLayer.posY} onChange={(e) => updateActiveLayer({ posY: Number(e.target.value) })} />
                    <span className="ctrl-val">{activeLayer.posY}px</span>
                  </div>
                  <div className="sidebar-section" style={{ paddingTop: 0 }}>
                    <button className="btn btn-ghost btn-sm" style={{ width: "100%" }} onClick={handleReset}>
                      <RotateCcw size={14} /> {t("reset")}
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "color" && (
            <>
              <div className="sidebar-section">
                <h4>{t("productColor")}</h4>
                <div className="color-grid">
                  {productColors.map((c) => (
                    <button key={c} className={`color-swatch ${productColor === c ? "active" : ""}`} style={{ background: c }} onClick={() => setProductColor(c)} />
                  ))}
                </div>
                <div className="custom-color">
                  <label>{locale === "id" ? "Kustom" : "Custom"}</label>
                  <input type="color" value={productColor} onChange={(e) => setProductColor(e.target.value)} />
                </div>
              </div>
              <div className="sidebar-section">
                <h4>{t("background")}</h4>
                <div className="color-grid">
                  {bgColors.map((c) => (
                    <button key={c} className={`color-swatch ${bgColor === c ? "active" : ""}`} style={{ background: c }} onClick={() => setBgColor(c)} />
                  ))}
                </div>
                <div className="custom-color">
                  <label>{locale === "id" ? "Kustom" : "Custom"}</label>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                </div>
              </div>
            </>
          )}

          {activeTab === "export" && (
            <>
              <div className="sidebar-section">
                <h4>{t("format")}</h4>
                <div className="format-options">
                  {(["png", "jpg", "webp"] as ExportFormat[]).map((f) => (
                    <button key={f} className={`format-btn ${exportFormat === f ? "active" : ""} ${f !== "png" && !isPro ? "locked" : ""}`}
                      onClick={() => { if (f === "png" || isPro) setExportFormat(f); }}>
                      {f.toUpperCase()}
                      {f !== "png" && !isPro && <span className="lock-icon"><Lock size={12} /></span>}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sidebar-section">
                <h4>{t("quality")}</h4>
                <div className="quality-info">
                  <div className="quality-row">
                    <span>{locale === "id" ? "Resolusi" : "Resolution"}</span>
                    <span className="quality-value">{isPro ? "1920×1920" : "720×720"}</span>
                  </div>
                  <div className="quality-row">
                    <span>Watermark</span>
                    <span className="quality-value">{isPro ? "No" : "Yes"}</span>
                  </div>
                </div>
                {!isPro && (
                  <Link href={`/${locale}/pricing`} className="btn btn-primary btn-sm" style={{ width: "100%", marginTop: "12px" }}>
                    {locale === "id" ? "Upgrade untuk HD" : "Upgrade for HD"}
                  </Link>
                )}
              </div>
              <button className="btn btn-primary" style={{ width: "100%", marginTop: "8px" }} onClick={handleExport} disabled={isExporting}>
                {isExporting ? <><Loader2 size={14} className="spin" /> {t("exporting")}</> : <><Download size={14} /> {t("download")}</>}
              </button>
            </>
          )}
        </div>

        {/* Canvas Area */}
        <div className="editor-canvas-area">
          <div className="canvas-controls">
            <button className="zoom-btn" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>−</button>
            <span className="zoom-val">{Math.round(zoom * 100)}%</span>
            <button className="zoom-btn" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>+</button>
          </div>

          {/* Fabric canvas (hidden - used for export only) */}
          <canvas ref={canvasRef} width={500} height={500} style={{ display: "none" }} />

          <div className="canvas-wrapper" style={{ background: bgColor, transform: `scale(${zoom})` }}>
            {/* SVG Product Mockup */}
            <div className="product-shape-area">
              <ProductShape shape={tpl.shape} color={productColor}>
                {designLayers.filter(l => l.visible).map((layer, idx) => (
                  <div key={layer.id} className={`design-overlay ${layer.id === activeLayer?.id ? "design-overlay-active" : ""}`} style={{
                    transform: `translate(${layer.posX}px, ${layer.posY}px) rotate(${layer.rotation}deg) scale(${layer.scale / 100})`,
                    zIndex: idx + 1,
                  }}>
                    <img src={layer.image} alt={layer.name} />
                  </div>
                ))}
              </ProductShape>
            </div>
            {!isPro && <div className="watermark-text">MockupForge — Free</div>}
          </div>
        </div>
      </div>

      <style jsx>{`
        .editor-page { display: flex; flex-direction: column; height: 100vh; background: var(--bg); }
        .editor-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 var(--space-lg); height: 56px;
          background: white; border-bottom: 1px solid var(--border-light); flex-shrink: 0;
        }
        .toolbar-back { font-size: 0.875rem; color: var(--text-secondary); transition: color var(--transition-fast); }
        .toolbar-back:hover { color: var(--primary); }
        .toolbar-center { display: flex; align-items: center; gap: var(--space-sm); }
        .toolbar-emoji { font-size: 1.25rem; }
        .toolbar-title { font-weight: 700; font-size: 0.938rem; }
        .toolbar-actions { display: flex; gap: var(--space-sm); }
        .editor-body { display: flex; flex: 1; overflow: hidden; }

        .editor-sidebar {
          width: 300px; background: white; border-right: 1px solid var(--border-light);
          overflow-y: auto; flex-shrink: 0; display: flex; flex-direction: column;
        }
        .sidebar-tabs {
          display: flex; border-bottom: 1px solid var(--border-light);
          position: sticky; top: 0; background: white; z-index: 5;
        }
        .tab-btn {
          flex: 1; padding: 0.75rem 0.5rem; font-size: 0.75rem; font-weight: 600;
          color: var(--text-muted); background: none; cursor: pointer;
          border-bottom: 2px solid transparent; transition: all var(--transition-fast);
        }
        .tab-btn:hover { color: var(--primary); }
        .tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); background: rgba(108,92,231,0.03); }

        .sidebar-section { padding: var(--space-md) var(--space-lg); }
        .sidebar-section h4 {
          font-size: 0.75rem; font-weight: 600; color: var(--text-muted);
          text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-sm);
        }
        .upload-zone {
          border: 2px dashed var(--border); border-radius: var(--radius-lg);
          padding: var(--space-lg); text-align: center; cursor: pointer;
          transition: all var(--transition-fast);
          display: flex; flex-direction: column; align-items: center; gap: var(--space-xs);
        }
        .upload-zone:hover { border-color: var(--primary); background: rgba(108,92,231,0.03); }
        .upload-icon { font-size: 1.75rem; }
        .upload-zone p { font-size: 0.75rem; color: var(--text-muted); }
        .upload-preview { max-width: 100%; max-height: 100px; border-radius: var(--radius-md); object-fit: contain; }

        .sidebar-section input[type="range"] { width: 100%; accent-color: var(--primary); height: 4px; cursor: pointer; }
        .ctrl-val { font-size: 0.75rem; color: var(--text-secondary); font-weight: 600; display: block; margin-top: 2px; }

        .color-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
        .color-swatch {
          width: 36px; height: 36px; border-radius: var(--radius-md);
          border: 2px solid var(--border-light); cursor: pointer;
          transition: all var(--transition-fast);
        }
        .color-swatch:hover { transform: scale(1.15); }
        .color-swatch.active { border-color: var(--primary); box-shadow: 0 0 0 2px var(--primary); }
        .custom-color {
          display: flex; align-items: center; gap: var(--space-sm);
          margin-top: var(--space-sm); font-size: 0.75rem; color: var(--text-muted);
        }
        .custom-color input[type="color"] {
          width: 32px; height: 32px; border: 2px solid var(--border); border-radius: var(--radius-md);
          cursor: pointer; padding: 0;
        }

        .format-options { display: flex; gap: var(--space-sm); }
        .format-btn {
          flex: 1; padding: 0.6rem; font-size: 0.813rem; font-weight: 600;
          border: 2px solid var(--border); border-radius: var(--radius-md);
          background: white; cursor: pointer; transition: all var(--transition-fast);
          position: relative; text-align: center;
        }
        .format-btn:hover { border-color: var(--primary); }
        .format-btn.active { border-color: var(--primary); background: rgba(108,92,231,0.06); color: var(--primary); }
        .format-btn.locked { opacity: 0.5; cursor: not-allowed; }
        .lock-icon { font-size: 0.625rem; margin-left: 2px; }

        .quality-info { display: flex; flex-direction: column; gap: var(--space-sm); }
        .quality-row {
          display: flex; justify-content: space-between; font-size: 0.813rem;
          padding: 0.5rem 0.75rem; background: var(--bg-secondary); border-radius: var(--radius-md);
        }
        .quality-value { font-weight: 600; }

        .editor-canvas-area {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: var(--space-xl); background: var(--bg-secondary);
          position: relative; overflow: auto; min-width: 0;
        }
        .canvas-controls {
          display: flex; align-items: center; gap: var(--space-sm);
          position: absolute; bottom: var(--space-lg); left: 50%; transform: translateX(-50%);
          background: white; border-radius: var(--radius-full); padding: 4px 12px;
          box-shadow: var(--shadow-md); z-index: 10;
        }
        .zoom-btn {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; font-weight: 700; background: var(--bg-secondary);
          cursor: pointer; transition: all var(--transition-fast);
        }
        .zoom-btn:hover { background: var(--primary); color: white; }
        .zoom-val { font-size: 0.75rem; font-weight: 600; min-width: 42px; text-align: center; }

        .canvas-wrapper {
          width: 500px; height: 500px; border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          transition: transform 0.2s ease, background var(--transition-normal);
          flex-shrink: 0;
        }
        .product-shape-area {
          width: 320px; height: 380px;
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .design-overlay {
          position: absolute; inset: 20px;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.1s linear;
        }
        .design-overlay-active {
          outline: 2px dashed rgba(108,92,231,0.35);
          outline-offset: 2px;
          border-radius: 4px;
        }
        .design-overlay img { max-width: 100%; max-height: 100%; object-fit: contain; pointer-events: none; }

        /* Layer management */
        .layers-list {
          display: flex; flex-direction: column; gap: 4px;
        }
        .layer-item {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 8px; border-radius: var(--radius-md);
          border: 1.5px solid var(--border-light);
          cursor: pointer; transition: all var(--transition-fast);
          background: var(--bg-card);
        }
        .layer-item:hover { border-color: var(--primary-light); background: rgba(108,92,231,0.03); }
        .layer-item.active { border-color: var(--primary); background: rgba(108,92,231,0.06); box-shadow: 0 0 0 1px rgba(108,92,231,0.15); }
        .layer-thumb {
          width: 36px; height: 36px; border-radius: var(--radius-sm);
          background: var(--bg-secondary); overflow: hidden;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .layer-thumb img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .layer-name {
          flex: 1; font-size: 0.75rem; font-weight: 600;
          color: var(--text-secondary); overflow: hidden;
          text-overflow: ellipsis; white-space: nowrap;
        }
        .layer-actions { display: flex; gap: 2px; flex-shrink: 0; }
        .layer-action-btn {
          width: 22px; height: 22px; border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          background: transparent; cursor: pointer;
          color: var(--text-muted); transition: all var(--transition-fast);
        }
        .layer-action-btn:hover { background: var(--bg-secondary); color: var(--primary); }
        .layer-action-btn:disabled { opacity: 0.3; cursor: default; }
        .layer-action-btn.layer-delete:hover { background: rgba(255,107,107,0.1); color: var(--error); }

        .watermark-text {
          position: absolute; bottom: 12px; left: 0; right: 0;
          text-align: center; font-size: 0.7rem; font-weight: 600;
          color: rgba(108, 92, 231, 0.35);
        }

        @media (max-width: 1024px) {
          .editor-sidebar { width: 260px; }
          .canvas-wrapper { width: 420px; height: 420px; }
        }
        @media (max-width: 768px) {
          .editor-body { flex-direction: column; }
          .editor-sidebar {
            width: 100%; border-right: none; border-bottom: 1px solid var(--border-light);
            max-height: 45vh;
          }
          .canvas-wrapper { width: 100%; max-width: 340px; height: 340px; }
          .toolbar-actions { gap: 4px; }
        }
      `}</style>
    </div>
  );
}
