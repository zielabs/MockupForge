"use client";

import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductShape from "@/components/editor/ProductShape";
import { LayoutGrid, Shirt, Crown, Coffee, GlassWater, ShoppingBag, SearchX } from "lucide-react";

const categoryIcons: Record<string, any> = {
  all: LayoutGrid, tshirt: Shirt, hoodie: Shirt,
  hat: Crown, mug: Coffee, tumbler: GlassWater, totebag: ShoppingBag,
};

const allCategories = [
  { key: "all" },
  { key: "tshirt" },
  { key: "hoodie" },

  { key: "hat" },
  { key: "mug" },
  { key: "tumbler" },
  { key: "totebag" },
];

const categoryToShape: Record<string, string> = {
  TSHIRT: "tshirt", HOODIE: "hoodie",
  HAT: "cap", MUG: "mug", TUMBLER: "tumbler",
  TOTEBAG: "totebag",
};

const categoryToKey: Record<string, string> = {
  TSHIRT: "tshirt", HOODIE: "hoodie",
  HAT: "hat", MUG: "mug", TUMBLER: "tumbler",
  TOTEBAG: "totebag",
};

const shapeBgColors: Record<string, string> = {
  tshirt: "#EDE9FF", hoodie: "#FFE5E5",
  cap: "#DFEEFF", mug: "#FFF5E6", tumbler: "#E0F7FA",
  totebag: "#F5F0E1",
};

const shapeAccent: Record<string, string> = {
  tshirt: "#6C5CE7", hoodie: "#FF6B6B",
  cap: "#0984E3", mug: "#E17055", tumbler: "#00CEC9",
  totebag: "#FDCB6E",
};

// Fallback templates
const fallbackTemplates = [
  { id: "1", slug: "basic-tshirt-front", name: "Classic White T-Shirt", category: "TSHIRT", isPremium: false },
  { id: "2", slug: "basic-tshirt-back", name: "Round Neck T-Shirt", category: "TSHIRT", isPremium: false },
  { id: "4", slug: "hoodie-front", name: "Streetwear Hoodie", category: "HOODIE", isPremium: true },
  { id: "5", slug: "baseball-cap", name: "Baseball Cap", category: "HAT", isPremium: false },
  { id: "7", slug: "coffee-mug", name: "Ceramic Coffee Mug", category: "MUG", isPremium: false },
  { id: "8", slug: "travel-tumbler", name: "Glass Tumbler", category: "TUMBLER", isPremium: true },
  { id: "9", slug: "canvas-totebag", name: "Canvas Tote Bag", category: "TOTEBAG", isPremium: false },

  { id: "13", slug: "premium-tshirt", name: "V-Neck T-Shirt", category: "TSHIRT", isPremium: true },
  { id: "14", slug: "white-mug-premium", name: "Travel Mug", category: "MUG", isPremium: false },
  { id: "15", slug: "oversized-tshirt", name: "Oversized T-Shirt", category: "TSHIRT", isPremium: true },
];

interface Template {
  id: string;
  name: string;
  category: string;
  isPremium: boolean;
  slug?: string;
}

export default function TemplatesPage() {
  const t = useTranslations("templates");
  const ct = useTranslations("categories");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = pathname.startsWith("/en") ? "en" : "id";

  const initialCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<Template[]>(fallbackTemplates);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch("/api/templates");
        if (res.ok) {
          const data = await res.json();
          if (data.templates?.length > 0) {
            setTemplates(data.templates);
          }
        }
      } catch { /* use fallback */ }
      setLoading(false);
    };
    fetchTemplates();
  }, []);

  const filtered = useMemo(() => {
    return templates.filter((tpl) => {
      const tplKey = categoryToKey[tpl.category] || tpl.category;
      const matchCat = activeCategory === "all" || tplKey === activeCategory;
      const matchSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery, templates]);

  return (
    <>
      <Header />
      <main className="templates-page">
        <div className="container">
          <div className="templates-header">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title">
              {t("title")}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="section-subtitle" style={{ margin: "0 0 var(--space-xl)" }}>
              {t("subtitle")}
            </motion.p>

            <div className="templates-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="templates-layout">
            <aside className="templates-sidebar">
              {allCategories.map((cat) => (
                <button
                  key={cat.key}
                  className={`sidebar-item ${activeCategory === cat.key ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  <span>{(() => { const Icon = categoryIcons[cat.key]; return Icon ? <Icon size={16} /> : null; })()}</span>
                  <span>{cat.key === "all" ? t("all") : ct(cat.key)}</span>
                </button>
              ))}
            </aside>

            <div className="templates-content">
              <p className="results-count">{filtered.length} {locale === "id" ? "template ditemukan" : "templates found"}</p>
              {filtered.length === 0 ? (
                <div className="no-results">
                  <p>{t("noResults")}</p>
                </div>
              ) : (
                <div className="templates-grid">
                  {filtered.map((tpl, i) => {
                    const shape = categoryToShape[tpl.category] || "tshirt";
                    const bgTint = shapeBgColors[shape] || "#F0F0F0";
                    const accent = shapeAccent[shape] || "#6C5CE7";
                    return (
                      <motion.div
                        key={tpl.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        style={{ position: "relative" }}
                      >
                        {/* Badge — rendered with inline styles, OUTSIDE Link */}
                        <div style={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          zIndex: 10,
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          padding: "5px 14px",
                          borderRadius: 20,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          pointerEvents: "none",
                          background: tpl.isPremium
                            ? "linear-gradient(135deg, #FFD700, #FF8C00)"
                            : "linear-gradient(135deg, #00B894, #00CEC9)",
                          color: tpl.isPremium ? "#1A1A2E" : "#FFFFFF",
                          boxShadow: tpl.isPremium
                            ? "0 3px 12px rgba(255,165,0,0.45)"
                            : "0 3px 12px rgba(0,184,148,0.45)",
                        }}>
                          {tpl.isPremium ? "Premium" : "Gratis"}
                        </div>

                        <Link
                          href={`/${locale}/editor/${tpl.slug || tpl.id}`}
                          style={{
                            display: "block",
                            background: "#FFFFFF",
                            borderRadius: 16,
                            overflow: "hidden",
                            border: "1px solid rgba(0,0,0,0.06)",
                            textDecoration: "none",
                            color: "inherit",
                            transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                          className="tpl-card"
                        >
                          {/* Preview Area */}
                          <div style={{
                            height: 220,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 24,
                            position: "relative",
                            background: `linear-gradient(160deg, ${bgTint} 0%, #FFFFFF 100%)`,
                            overflow: "hidden",
                          }}>
                            {/* Subtle accent circle behind shape */}
                            <div style={{
                              position: "absolute",
                              width: 180,
                              height: 180,
                              borderRadius: "50%",
                              background: `radial-gradient(circle, ${accent}10 0%, transparent 70%)`,
                            }} />
                            {/* Bottom gradient */}
                            <div style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: 60,
                              background: "linear-gradient(transparent, rgba(255,255,255,0.8))",
                            }} />
                            <div style={{
                              width: 120,
                              height: 160,
                              position: "relative",
                              zIndex: 1,
                              transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                            }} className="tpl-shape-inner">
                              <ProductShape shape={shape} color="#FFFFFF" />
                            </div>
                          </div>

                          {/* Info Area */}
                          <div style={{
                            padding: "14px 16px 16px",
                            borderTop: "1px solid rgba(0,0,0,0.04)",
                          }}>
                            <h3 style={{
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              marginBottom: 4,
                              lineHeight: 1.3,
                              color: "var(--text)",
                            }}>{tpl.name}</h3>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <span style={{
                                fontSize: "0.7rem",
                                color: accent,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                              }}>{ct(categoryToKey[tpl.category] || "tshirt")}</span>
                              <span style={{
                                fontSize: "0.7rem",
                                color: "var(--text-muted)",
                                fontWeight: 500,
                              }}>→</span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        .templates-page {
          padding-top: calc(var(--header-height) + var(--space-2xl));
          min-height: 100vh;
        }
        .templates-header {
          text-align: center;
          margin-bottom: var(--space-2xl);
        }
        .templates-search {
          display: flex; align-items: center; gap: var(--space-sm);
          max-width: 400px; margin: 0 auto;
          padding: 0.75rem 1.25rem;
          background: white; border: 2px solid var(--border);
          border-radius: var(--radius-full);
          color: var(--text-muted);
          transition: border-color var(--transition-fast);
        }
        .templates-search:focus-within { border-color: var(--primary); }
        .templates-search input {
          flex: 1; border: none; background: none;
          font-size: 0.938rem; color: var(--text);
        }
        .templates-layout {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: var(--space-2xl);
        }
        .templates-sidebar {
          display: flex; flex-direction: column; gap: 2px;
          position: sticky; top: calc(var(--header-height) + var(--space-xl));
          height: fit-content;
        }
        .sidebar-item {
          display: flex; align-items: center; gap: var(--space-sm);
          padding: 0.625rem 1rem; border-radius: var(--radius-md);
          font-size: 0.875rem; font-weight: 500;
          background: none; color: var(--text-secondary);
          transition: all var(--transition-fast); text-align: left; cursor: pointer;
          border: none;
        }
        .sidebar-item:hover { background: var(--bg-secondary); color: var(--primary); }
        .sidebar-item.active {
          background: rgba(108, 92, 231, 0.1);
          color: var(--primary); font-weight: 600;
        }
        .results-count {
          font-size: 0.875rem; color: var(--text-muted);
          margin-bottom: var(--space-lg);
        }
        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: var(--space-lg);
        }

        /* Hover effects via CSS */
        :global(.tpl-card:hover) {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(108, 92, 231, 0.18);
          border-color: rgba(108, 92, 231, 0.3) !important;
        }
        :global(.tpl-card:hover .tpl-shape-inner) {
          transform: scale(1.1) translateY(-4px);
        }

        .no-results {
          text-align: center; padding: var(--space-4xl);
          color: var(--text-muted); font-size: 1.125rem;
        }

        @media (max-width: 768px) {
          .templates-layout { grid-template-columns: 1fr; }
          .templates-sidebar {
            flex-direction: row; overflow-x: auto;
            gap: var(--space-sm); position: static;
            padding-bottom: var(--space-sm);
          }
          .sidebar-item { white-space: nowrap; flex-shrink: 0; }
          .templates-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
        }
      `}</style>
    </>
  );
}
