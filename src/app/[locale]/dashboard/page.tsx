"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { BarChart3, Target, FolderOpen, Gem, Inbox, Pencil, Shirt, Coffee, Crown, GlassWater, ShoppingBag } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

interface ProjectItem {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  template?: { category: string };
}

const categoryIconComponents: Record<string, any> = {
  TSHIRT: Shirt, HOODIE: Shirt,
  HAT: Crown, MUG: Coffee, TUMBLER: GlassWater,
  TOTEBAG: ShoppingBag,
};

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const locale = pathname.startsWith("/en") ? "en" : "id";

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [stats, setStats] = useState({ mockupsUsed: 0, mockupsLeft: 3, projectsSaved: 0, plan: "FREE" });
  const [loading, setLoading] = useState(true);

  const userName = session?.user?.name || "User";
  const isPro = stats.plan !== "FREE";

  useEffect(() => {
    if (status !== "authenticated") return;
    const fetchData = async () => {
      try {
        const [subsRes, projRes] = await Promise.all([
          fetch("/api/subscription").then(r => r.ok ? r.json() : null),
          fetch("/api/projects").then(r => r.ok ? r.json() : null),
        ]);
        if (subsRes) {
          const plan = subsRes.subscription?.plan || "FREE";
          const mockupsUsed = subsRes.usage?.mockupsUsed || 0;
          const mockupsLimit = subsRes.usage?.mockupsLimit;
          setStats({
            mockupsUsed,
            mockupsLeft: mockupsLimit != null ? Math.max(0, mockupsLimit - mockupsUsed) : Infinity,
            projectsSaved: subsRes.usage?.projectCount || 0,
            plan,
          });
        }
        if (projRes?.projects) {
          setProjects(projRes.projects.slice(0, 3));
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchData();
  }, [status]);

  return (
    <div className="dashboard-main">
      {/* Welcome Banner */}
      <motion.div
        className="welcome-banner"
        initial="hidden" animate="visible"
        variants={fadeInUp} custom={0}
      >
        <div className="welcome-text">
          <h1>{t("welcome")}, {userName.split(" ")[0]}!</h1>
          <p>
            {locale === "id"
              ? "Siap membuat mockup baru hari ini?"
              : "Ready to create new mockups today?"}
          </p>
        </div>
        <br />
        {/* <Link href={`/${locale}/templates`} className="btn btn-primary">
          + {t("createNew")}
        </Link> */}
      </motion.div>

      {/* Stats */}
      <div className="stats-grid">
        <motion.div className="stat-card" initial="hidden" animate="visible" variants={fadeInUp} custom={1}>
          <div className="stat-icon" style={{ background: "rgba(108, 92, 231, 0.1)" }}><BarChart3 size={20} color="#6C5CE7" /></div>
          <div className="stat-info">
            <span className="stat-value">{isPro ? "∞" : `${stats.mockupsUsed} / 3`}</span>
            <span className="stat-label">{t("mockupsUsed")}</span>
          </div>
        </motion.div>

        <motion.div className="stat-card" initial="hidden" animate="visible" variants={fadeInUp} custom={2}>
          <div className="stat-icon" style={{ background: "rgba(0, 184, 148, 0.1)" }}><Target size={20} color="#00B894" /></div>
          <div className="stat-info">
            <span className="stat-value">{isPro ? t("unlimited") : String(stats.mockupsLeft)}</span>
            <span className="stat-label">{t("mockupsLeft")}</span>
          </div>
        </motion.div>

        <motion.div className="stat-card" initial="hidden" animate="visible" variants={fadeInUp} custom={3}>
          <div className="stat-icon" style={{ background: "rgba(253, 203, 110, 0.15)" }}><FolderOpen size={20} color="#F39C12" /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.projectsSaved}</span>
            <span className="stat-label">{t("projectsSaved")}</span>
          </div>
        </motion.div>

        <motion.div className="stat-card" initial="hidden" animate="visible" variants={fadeInUp} custom={4}>
          <div className="stat-icon" style={{ background: "rgba(108, 92, 231, 0.1)" }}><Gem size={20} color="#6C5CE7" /></div>
          <div className="stat-info">
            <span className="stat-value plan-value">{stats.plan === "FREE" ? "Free" : stats.plan === "PRO_MONTHLY" ? "Pro" : "Pro Yearly"}</span>
            <span className="stat-label">{t("currentPlan")}</span>
          </div>
        </motion.div>
      </div>

      {/* Recent Projects */}
      <motion.div className="recent-section" initial="hidden" animate="visible" variants={fadeInUp} custom={5}>
        <div className="section-header">
          <h2>{t("recentProjects")}</h2>
          <Link href={`/${locale}/dashboard/projects`} className="view-all-link">
            {t("viewAll")}
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Inbox size={40} /></div>
            <p>{t("noProjects")}</p>
            <Link href={`/${locale}/templates`} className="btn btn-primary btn-sm">
              {t("createNew")}
            </Link>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial="hidden" animate="visible"
                variants={fadeInUp} custom={6 + i}
              >
                <div className="project-preview">
                  <span className="project-emoji">{(() => { const Icon = categoryIconComponents[project.template?.category || "TSHIRT"] || Shirt; return <Icon size={24} />; })()}</span>
                </div>
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <div className="project-meta">
                    <span className={`project-status ${project.status.toLowerCase()}`}>
                      {project.status === "COMPLETED"
                        ? (locale === "id" ? "Selesai" : "Completed")
                        : (locale === "id" ? "Draft" : "Draft")}
                    </span>
                    <span className="project-date">{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="project-actions">
                  <Link href={`/${locale}/editor/${project.id}`} className="btn btn-ghost btn-sm">
                    <Pencil size={14} style={{ marginRight: 4 }} /> Edit
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      
      {/* Quick Start */}
      {/* {!isPro && (
        <motion.div className="upgrade-banner" initial="hidden" animate="visible" variants={fadeInUp} custom={9}>
          <div className="upgrade-content">
            <h3>{locale === "id" ? "🚀 Upgrade ke Pro" : "🚀 Upgrade to Pro"}</h3>
            <p>{locale === "id"
              ? "Dapatkan akses unlimited mockup, 50+ template premium, dan export Full HD tanpa watermark."
              : "Get unlimited mockups, 50+ premium templates, and Full HD export without watermark."}</p>
          </div>
          <Link href={`/${locale}/pricing`} className="btn btn-primary">
            {t("upgrade")}
          </Link>
        </motion.div>
      )} */}

      <style jsx>{`
        .dashboard-main {
          max-width: 960px;
        }
        .welcome-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--primary-gradient);
          border-radius: var(--radius-2xl);
          padding: var(--space-2xl) var(--space-2xl);
          margin-bottom: var(--space-2xl);
          color: white;
          position: relative;
          overflow: hidden;
        }
        .welcome-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 25px 25px;
        }
        .welcome-text {
          position: relative;
          z-index: 1;
        }
        .welcome-text h1 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: var(--space-xs);
        }
        .welcome-text p {
          opacity: 0.9;
          font-size: 0.938rem;
        }
        .welcome-banner :global(.btn) {
          position: relative;
          z-index: 1;
          background: white;
          color: var(--primary);
          font-weight: 700;
        }
        .welcome-banner :global(.btn:hover) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-lg);
          margin-bottom: var(--space-2xl);
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-lg);
          background: white;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-light);
          transition: all var(--transition-normal);
        }
        .stat-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        .stat-value {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text);
        }
        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .plan-value {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .recent-section {
          margin-bottom: var(--space-2xl);
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-lg);
        }
        .section-header h2 {
          font-size: 1.25rem;
          font-weight: 700;
        }
        .view-all-link {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--primary);
          transition: opacity var(--transition-fast);
        }
        .view-all-link:hover {
          opacity: 0.7;
        }

        .empty-state {
          background: white;
          border: 2px dashed var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-4xl);
          text-align: center;
          color: var(--text-muted);
        }
        .empty-icon {
          font-size: 3rem;
          margin-bottom: var(--space-md);
        }
        .empty-state p {
          margin-bottom: var(--space-lg);
        }

        .projects-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .project-card {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md) var(--space-lg);
          background: white;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-light);
          transition: all var(--transition-normal);
        }
        .project-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .project-preview {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .project-emoji {
          font-size: 1.75rem;
        }
        .project-info {
          flex: 1;
        }
        .project-info h3 {
          font-size: 0.938rem;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .project-meta {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        .project-status {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.125rem 0.5rem;
          border-radius: var(--radius-full);
        }
        .project-status.completed {
          background: rgba(0, 184, 148, 0.1);
          color: var(--success);
        }
        .project-status.draft {
          background: rgba(253, 203, 110, 0.15);
          color: #D68910;
        }
        .project-date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .project-actions {
          flex-shrink: 0;
        }

        .upgrade-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-xl);
          background: white;
          border: 2px solid var(--primary-light);
          border-radius: var(--radius-2xl);
          padding: var(--space-xl) var(--space-2xl);
        }
        .upgrade-content h3 {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: var(--space-xs);
        }
        .upgrade-content p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          max-width: 500px;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .welcome-banner {
            flex-direction: column;
            gap: var(--space-lg);
            text-align: center;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .upgrade-banner {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
