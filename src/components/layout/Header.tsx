"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LayoutDashboard, FolderOpen, Settings, LogOut } from "lucide-react";

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const currentLocale = pathname.startsWith("/en") ? "en" : "id";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    const newLocale = currentLocale === "id" ? "en" : "id";
    const pathWithoutLocale = pathname.replace(/^\/(id|en)/, "") || "/";
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const isAuthenticated = status === "authenticated" && session?.user;

  return (
    <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
      <div className="header-inner container">
        <Link href={`/${currentLocale}`} className="logo">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#logoGrad)" />
              <path d="M7 14L11 10L15 14L19 10L23 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 19L11 15L15 19L19 15L23 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#6C5CE7" />
                  <stop offset="1" stopColor="#A29BFE" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">MockupForge</span>
        </Link>

        <nav className={`nav ${mobileOpen ? "nav-open" : ""}`}>
          <Link href={`/${currentLocale}`} className="nav-link">{t("home")}</Link>
          <Link href={`/${currentLocale}/templates`} className="nav-link">{t("templates")}</Link>
          <Link href={`/${currentLocale}/pricing`} className="nav-link">{t("pricing")}</Link>
          {isAuthenticated && (
            <Link href={`/${currentLocale}/dashboard`} className="nav-link">{t("dashboard")}</Link>
          )}
        </nav>

        <div className="header-actions">
          <button onClick={switchLocale} className="btn-ghost btn-sm locale-btn" title={t("language")}>
            {currentLocale === "id" ? "🇮🇩 ID" : "🇬🇧 EN"}
          </button>

          {isAuthenticated ? (
            (() => {
              const user = session!.user!;
              return (
                <div className="user-menu-wrapper" ref={userMenuRef}>
                  <button
                    className="user-avatar-btn"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-label="User menu"
                  >
                    {user.image ? (
                      <img src={user.image} alt={user.name || ""} className="user-avatar" />
                    ) : (
                      <div className="user-avatar-placeholder">
                        {(user.name || user.email || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {userMenuOpen && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <p className="user-dropdown-name">{user.name}</p>
                        <p className="user-dropdown-email">{user.email}</p>
                      </div>
                      <div className="user-dropdown-divider" />
                      <Link href={`/${currentLocale}/dashboard`} className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard size={16} /> {t("dashboard")}
                      </Link>
                      <br />
                      <Link href={`/${currentLocale}/dashboard/projects`} className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <FolderOpen size={16} /> {currentLocale === "id" ? "Proyek Saya" : "My Projects"}
                      </Link>
                      <br />
                      <Link href={`/${currentLocale}/dashboard/settings`} className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <Settings size={16} /> {currentLocale === "id" ? "Pengaturan" : "Settings"}
                      </Link>
                      <br />
                      <div className="user-dropdown-divider" />
                      <button
                        className="user-dropdown-item user-dropdown-logout"
                        onClick={() => signOut({ callbackUrl: `/${currentLocale}` })}
                      >
                        <LogOut size={16} /> {t("logout")}
                      </button>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <Link href={`/${currentLocale}/login`} className="btn btn-primary btn-sm">
              {t("getStarted")}
            </Link>
          )}

          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <span className={`hamburger ${mobileOpen ? "active" : ""}`} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: var(--header-height);
          transition: all var(--transition-normal);
        }
        .header-scrolled {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-weight: 800;
          font-size: 1.25rem;
          z-index: 10;
        }
        .logo-text {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .nav {
          display: flex;
          align-items: center;
          gap: var(--space-xl);
        }
        .nav-link {
          font-weight: 500;
          font-size: 0.938rem;
          color: var(--text-secondary);
          transition: color var(--transition-fast);
          position: relative;
        }
        .nav-link:hover {
          color: var(--primary);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--primary-gradient);
          border-radius: 1px;
          transition: width var(--transition-normal);
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          z-index: 10;
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

        /* User Menu */
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

        .mobile-toggle {
          display: none;
          width: 36px;
          height: 36px;
          align-items: center;
          justify-content: center;
          background: none;
        }
        .hamburger,
        .hamburger::before,
        .hamburger::after {
          display: block;
          width: 20px;
          height: 2px;
          background: var(--text);
          border-radius: 1px;
          transition: all var(--transition-normal);
          position: relative;
        }
        .hamburger::before,
        .hamburger::after {
          content: '';
          position: absolute;
          left: 0;
        }
        .hamburger::before { top: -6px; }
        .hamburger::after { top: 6px; }
        .hamburger.active { background: transparent; }
        .hamburger.active::before { top: 0; transform: rotate(45deg); }
        .hamburger.active::after { top: 0; transform: rotate(-45deg); }

        @media (max-width: 768px) {
          .nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            justify-content: center;
            gap: var(--space-2xl);
            opacity: 0;
            pointer-events: none;
            transition: opacity var(--transition-normal);
          }
          .nav-open {
            opacity: 1;
            pointer-events: all;
          }
          .nav-link {
            font-size: 1.5rem;
            font-weight: 600;
          }
          .mobile-toggle {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}
