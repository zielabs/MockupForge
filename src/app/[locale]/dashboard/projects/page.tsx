"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Shirt, Coffee, Crown, GlassWater, ShoppingBag, Inbox, Pencil, Copy, Trash2, Package } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const categoryIconComponents: Record<string, any> = {
  tshirt: Shirt, hoodie: Shirt,
  hat: Crown, mug: Coffee, tumbler: GlassWater,
  totebag: ShoppingBag,
};

type Project = { id: string; name: string; category: string; date: string; status: "completed" | "draft" };
const projects: Project[] = [];

export default function ProjectsPage() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const locale = pathname.startsWith("/en") ? "en" : "id";

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === "all" || p.category === filterCategory;
      const matchStatus = filterStatus === "all" || p.status === filterStatus;
      return matchSearch && matchCat && matchStatus;
    });
  }, [searchQuery, filterCategory, filterStatus]);

  return (
    <div className="projects-page">
      <div className="page-header">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {locale === "id" ? "Proyek Saya" : "My Projects"}
        </motion.h1>
        <Link href={`/${locale}/templates`} className="btn btn-primary btn-sm">
          + {locale === "id" ? "Buat Baru" : "Create New"}
        </Link>
      </div>

      {/* Filters */}
      <motion.div className="filters-bar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder={locale === "id" ? "Cari proyek..." : "Search projects..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
            <option value="all">{locale === "id" ? "Semua Kategori" : "All Categories"}</option>
            {Object.keys(categoryIconComponents).map((key) => (
              <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
            ))}
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="all">{locale === "id" ? "Semua Status" : "All Status"}</option>
            <option value="completed">{locale === "id" ? "Selesai" : "Completed"}</option>
            <option value="draft">Draft</option>
          </select>

          <div className="view-toggle">
            <button className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")} title="Grid">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button className={`toggle-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")} title="List">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <p className="results-info">
        {filtered.length} {locale === "id" ? "proyek" : "projects"}
      </p>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Inbox size={40} /></div>
          <p>{locale === "id" ? "Tidak ada proyek ditemukan." : "No projects found."}</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="projects-grid">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              className="project-card-grid"
              initial="hidden" animate="visible"
              variants={fadeInUp} custom={i}
            >
              <div className="project-card-preview">
                <span className="project-card-emoji">{(() => { const Icon = categoryIconComponents[project.category] || Package; return <Icon size={24} />; })()}</span>
                <span className={`status-badge ${project.status}`}>
                  {project.status === "completed" ? (locale === "id" ? "Selesai" : "Done") : "Draft"}
                </span>
              </div>
              <div className="project-card-body">
                <h3>{project.name}</h3>
                <p className="project-card-date">{project.date}</p>
              </div>
              <div className="project-card-footer">
                <Link href={`/${locale}/editor/${project.id}`} className="btn btn-ghost btn-sm"><Pencil size={14} /> Edit</Link>
                <button className="btn btn-ghost btn-sm" title={locale === "id" ? "Duplikat" : "Duplicate"}><Copy size={14} /></button>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--error)" }} title={locale === "id" ? "Hapus" : "Delete"}><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="projects-list">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              className="project-row"
              initial="hidden" animate="visible"
              variants={fadeInUp} custom={i}
            >
              <div className="project-row-left">
                <div className="project-row-icon">
                  {(() => { const Icon = categoryIconComponents[project.category] || Package; return <Icon size={20} />; })()}
                </div>
                <div className="project-row-info">
                  <h3>{project.name}</h3>
                  <span className="project-row-date">{project.date}</span>
                </div>
              </div>
              <div className="project-row-right">
                <span className={`status-badge ${project.status}`}>
                  {project.status === "completed" ? (locale === "id" ? "Selesai" : "Done") : "Draft"}
                </span>
                <Link href={`/${locale}/editor/${project.id}`} className="btn btn-ghost btn-sm"><Pencil size={14} /> Edit</Link>
                <button className="btn btn-ghost btn-sm" title={locale === "id" ? "Duplikat" : "Duplicate"}><Copy size={14} /></button>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--error)" }} title={locale === "id" ? "Hapus" : "Delete"}><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <style jsx>{`
        .projects-page { max-width: 960px; }
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-xl);
        }
        .page-header h1 {
          font-size: 1.5rem;
          font-weight: 800;
        }
        .filters-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
          flex-wrap: wrap;
        }
        .search-box {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 0.6rem 1rem;
          background: white;
          border: 2px solid var(--border);
          border-radius: var(--radius-full);
          color: var(--text-muted);
          transition: border-color var(--transition-fast);
          min-width: 250px;
        }
        .search-box:focus-within { border-color: var(--primary); }
        .search-box input {
          flex: 1;
          border: none;
          background: none;
          font-size: 0.875rem;
          color: var(--text);
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        .filter-select {
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: 0.813rem;
          color: var(--text-secondary);
          background: white;
          cursor: pointer;
        }
        .view-toggle {
          display: flex;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .toggle-btn {
          padding: 0.5rem;
          background: none;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }
        .toggle-btn.active {
          background: var(--primary);
          color: white;
        }
        .results-info {
          font-size: 0.813rem;
          color: var(--text-muted);
          margin-bottom: var(--space-md);
        }

        .empty-state {
          background: white;
          border: 2px dashed var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-4xl);
          text-align: center;
          color: var(--text-muted);
        }
        .empty-icon { font-size: 3rem; margin-bottom: var(--space-md); }

        /* Grid View */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: var(--space-lg);
        }
        .project-card-grid {
          background: white;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-light);
          overflow: hidden;
          transition: all var(--transition-normal);
        }
        .project-card-grid:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
        }
        .project-card-preview {
          height: 160px;
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .project-card-emoji { font-size: 4rem; }
        .status-badge {
          font-size: 0.688rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .status-badge.completed {
          background: rgba(0, 184, 148, 0.1);
          color: var(--success);
        }
        .status-badge.draft {
          background: rgba(253, 203, 110, 0.2);
          color: #D68910;
        }
        .project-card-preview .status-badge {
          position: absolute;
          top: var(--space-sm);
          right: var(--space-sm);
        }
        .project-card-body {
          padding: var(--space-md);
        }
        .project-card-body h3 {
          font-size: 0.938rem;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .project-card-date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .project-card-footer {
          display: flex;
          gap: 4px;
          padding: var(--space-sm) var(--space-md);
          border-top: 1px solid var(--border-light);
        }

        /* List View */
        .projects-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        .project-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-md) var(--space-lg);
          background: white;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          transition: all var(--transition-normal);
        }
        .project-row:hover {
          box-shadow: var(--shadow-md);
        }
        .project-row-left {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        .project-row-icon {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        .project-row-info h3 {
          font-size: 0.875rem;
          font-weight: 600;
        }
        .project-row-date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .project-row-right {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        @media (max-width: 768px) {
          .filters-bar { flex-direction: column; align-items: stretch; }
          .search-box { min-width: auto; }
          .filter-group { flex-wrap: wrap; }
          .projects-grid { grid-template-columns: 1fr; }
          .project-row { flex-direction: column; gap: var(--space-sm); align-items: flex-start; }
          .project-row-right { width: 100%; justify-content: flex-end; }
        }
      `}</style>
    </div>
  );
}
