"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, FolderOpen, Settings, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("dashboard");
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const locale = pathname.startsWith("/en") ? "en" : "id";
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLocale = () => {
    const newLocale = locale === "id" ? "en" : "id";
    const pathWithoutLocale = pathname.replace(/^\/(id|en)/, "") || "/";
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  if (status === "loading") {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>{locale === "id" ? "Memuat..." : "Loading..."}</p>
        <style jsx>{`
          .dashboard-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            gap: var(--space-md);
            color: var(--text-muted);
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const sidebarItems = [
    { href: `/${locale}/dashboard`, icon: <LayoutDashboard size={18} />, label: locale === "id" ? "Dasbor" : "Dashboard" },
    { href: `/${locale}/dashboard/projects`, icon: <FolderOpen size={18} />, label: locale === "id" ? "Proyek Saya" : "My Projects" },
    { href: `/${locale}/dashboard/settings`, icon: <Settings size={18} />, label: locale === "id" ? "Pengaturan" : "Settings" },
  ];

  const isActive = (href: string) => {
    // Exact match for dashboard, startsWith for sub-pages
    if (href.endsWith("/dashboard")) {
      return pathname === href || pathname === `${href}/`;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="dashboard-layout">
      {/* Top bar */}
      <header className="dashboard-topbar">
        <div className="topbar-left">
          <Link href={`/${locale}`} className="topbar-logo">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#dbLogoGrad)" />
              <path d="M7 14L11 10L15 14L19 10L23 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 19L11 15L15 19L19 15L23 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
              <defs>
                <linearGradient id="dbLogoGrad" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#6C5CE7" />
                  <stop offset="1" stopColor="#A29BFE" />
                </linearGradient>
              </defs>
            </svg>
            <span>MockupForge</span>
          </Link>
        </div>
        <div className="topbar-right">
          <button onClick={switchLocale} className="btn-ghost btn-sm locale-btn" title={locale === "id" ? "Ganti Bahasa" : "Switch Language"}>
            {locale === "id" ? "🇮🇩 ID" : "🇬🇧 EN"}
          </button>

          {session?.user && (
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User menu"
              >
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || ""} className="user-avatar" />
                ) : (
                  <div className="user-avatar-placeholder">
                    {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <p className="user-dropdown-name">{session.user.name}</p>
                    <p className="user-dropdown-email">{session.user.email}</p>
                  </div>
                  <div className="user-dropdown-divider" />
                  <button
                    className="user-dropdown-item user-dropdown-logout"
                    onClick={() => signOut({ callbackUrl: `/${locale}` })}
                  >
                    <LogOut size={16} /> {locale === "id" ? "Keluar" : "Logout"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive(item.href) ? "active" : ""}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="sidebar-plan-card">
            <div className="plan-info">
              <span className="plan-badge">
                {(session?.user as any)?.subscription?.plan === "FREE" || !session ? "Free" : "Pro"}
              </span>
              <p className="plan-desc">
                {locale === "id" ? "Upgrade untuk fitur lengkap" : "Upgrade for full features"}
              </p>
            </div>
            <Link href={`/${locale}/pricing`} className="btn btn-primary btn-sm" style={{ width: "100%" }}>
              {locale === "id" ? "Upgrade Pro" : "Upgrade to Pro"}
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="dashboard-content">
          {children}
        </main>
      </div>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: var(--bg);
        }
        .dashboard-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          padding: 0 var(--space-lg);
          background: white;
          border-bottom: 1px solid var(--border-light);
          flex-shrink: 0;
          z-index: 100;
        }
        .topbar-left {
          display: flex;
          align-items: center;
        }
        .topbar-logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-weight: 800;
          font-size: 1.125rem;
          color: var(--text);
        }
        .topbar-logo span {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .topbar-right {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        .locale-btn {
          font-size: 0.813rem;
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-full);
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .locale-btn:hover {
          border-color: var(--primary);
          background: rgba(108, 92, 231, 0.05);
        }
        .user-menu-wrapper {
          position: relative;
        }
        .user-avatar-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--border);
          cursor: pointer;
          transition: all var(--transition-fast);
          padding: 0;
          background: none;
        }
        .user-avatar-btn:hover {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.15);
        }
        .user-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .user-avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-gradient);
          color: white;
          font-weight: 700;
          font-size: 0.938rem;
        }
        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 260px;
          background: white;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
          animation: slideDown 0.2s var(--ease-out);
          z-index: 100;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .user-dropdown-header {
          padding: var(--space-md) var(--space-lg);
        }
        .user-dropdown-name {
          font-weight: 700;
          font-size: 0.938rem;
          color: var(--text);
        }
        .user-dropdown-email {
          font-size: 0.813rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .user-dropdown-divider {
          height: 1px;
          background: var(--border-light);
        }
        .user-dropdown-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 0.625rem var(--space-lg);
          font-size: 0.875rem;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          width: 100%;
          text-align: left;
          background: none;
          cursor: pointer;
          border: none;
        }
        .user-dropdown-item:hover {
          background: var(--bg-secondary);
          color: var(--primary);
        }
        .user-dropdown-logout {
          color: var(--error);
        }
        .user-dropdown-logout:hover {
          background: rgba(255, 107, 107, 0.06);
          color: var(--error);
        }
        .dashboard-body {
          display: flex;
          flex: 1;
        }
        .dashboard-sidebar {
          width: 260px;
          background: white;
          border-right: 1px solid var(--border-light);
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-lg);
          font-size: 0.938rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        .sidebar-link:hover {
          background: var(--bg-secondary);
          color: var(--primary);
        }
        .sidebar-link.active {
          background: rgba(108, 92, 231, 0.1);
          color: var(--primary);
          font-weight: 600;
        }
        .sidebar-icon {
          font-size: 1.125rem;
        }
        .sidebar-plan-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: var(--space-lg);
        }
        .plan-info {
          margin-bottom: var(--space-md);
        }
        .plan-badge {
          display: inline-block;
          padding: 0.25rem 0.625rem;
          background: var(--primary-gradient);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-xs);
        }
        .plan-desc {
          font-size: 0.813rem;
          color: var(--text-muted);
          margin-top: var(--space-xs);
        }
        .dashboard-content {
          flex: 1;
          padding: var(--space-2xl);
          overflow-y: auto;
        }

        @media (max-width: 1024px) {
          .dashboard-sidebar {
            width: 220px;
          }
        }
        @media (max-width: 768px) {
          .dashboard-body {
            flex-direction: column;
          }
          .dashboard-sidebar {
            width: 100%;
            flex-direction: row;
            padding: var(--space-md);
            border-right: none;
            border-bottom: 1px solid var(--border-light);
            overflow-x: auto;
          }
          .sidebar-nav {
            flex-direction: row;
            gap: var(--space-sm);
          }
          .sidebar-link {
            white-space: nowrap;
            font-size: 0.813rem;
            padding: 0.5rem 0.75rem;
          }
          .sidebar-plan-card {
            display: none;
          }
          .dashboard-content {
            padding: var(--space-lg);
          }
        }
      `}</style>
    </div>
  );
}
