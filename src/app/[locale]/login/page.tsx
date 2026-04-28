"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { LayoutGrid, Eye, Zap } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("login");
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "id";

  return (
    <div className="login-page">
      <div className="login-visual">
        <div className="login-visual-content">
          <div className="login-orb login-orb-1" />
          <div className="login-orb login-orb-2" />
          <div className="visual-text">
            <h2>MockupForge</h2>
            <p>{locale === "id"
              ? "Buat mockup produk profesional dalam hitungan detik"
              : "Create professional product mockups in seconds"}</p>
            <div className="visual-features">
              <div className="visual-feature"><LayoutGrid size={14} style={{ marginRight: 4 }} /> 50+ Templates</div>
              <div className="visual-feature"><Eye size={14} style={{ marginRight: 4 }} /> 2D Preview</div>
              <div className="visual-feature"><Zap size={14} style={{ marginRight: 4 }} /> Instant Export</div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-form-side">
        <motion.div
          className="login-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href={`/${locale}`} className="login-back">
            ← {t("backHome")}
          </Link>

          <div className="login-header">
            <h1>{t("title")}</h1>
            <p>{t("subtitle")}</p>
          </div>

          <button
            className="google-btn"
            onClick={() => signIn("google", { callbackUrl: `/${locale}/dashboard` })}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {t("google")}
          </button>

          <p className="login-terms">
            {t("terms")} <a href="#">{t("termsLink")}</a> {t("and")} <a href="#">{t("privacyLink")}</a>
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        .login-page {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }
        .login-visual {
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .login-visual-content {
          position: relative;
          z-index: 1;
          padding: var(--space-3xl);
        }
        .login-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
        }
        .login-orb-1 {
          width: 400px;
          height: 400px;
          background: rgba(255, 255, 255, 0.15);
          top: -100px;
          right: -100px;
          animation: float 8s ease-in-out infinite;
        }
        .login-orb-2 {
          width: 300px;
          height: 300px;
          background: rgba(0, 210, 255, 0.2);
          bottom: -50px;
          left: -50px;
          animation: float 10s ease-in-out infinite reverse;
        }
        .visual-text {
          color: white;
          text-align: center;
        }
        .visual-text h2 {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: var(--space-md);
        }
        .visual-text p {
          font-size: 1.125rem;
          opacity: 0.9;
          margin-bottom: var(--space-2xl);
        }
        .visual-features {
          display: flex;
          gap: var(--space-md);
          justify-content: center;
          flex-wrap: wrap;
        }
        .visual-feature {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 600;
        }
        .login-form-side {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-3xl);
          background: var(--bg);
        }
        .login-form-container {
          width: 100%;
          max-width: 400px;
        }
        .login-back {
          display: inline-block;
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-bottom: var(--space-2xl);
          transition: color var(--transition-fast);
        }
        .login-back:hover {
          color: var(--primary);
        }
        .login-header {
          margin-bottom: var(--space-2xl);
        }
        .login-header h1 {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: var(--space-sm);
        }
        .login-header p {
          color: var(--text-secondary);
        }
        .google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-md);
          width: 100%;
          padding: 0.875rem;
          background: white;
          border: 2px solid var(--border);
          border-radius: var(--radius-lg);
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
          transition: all var(--transition-normal);
        }
        .google-btn:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .login-terms {
          margin-top: var(--space-xl);
          font-size: 0.813rem;
          color: var(--text-muted);
          text-align: center;
        }
        .login-terms :global(a) {
          color: var(--primary);
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .login-page {
            grid-template-columns: 1fr;
          }
          .login-visual {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
