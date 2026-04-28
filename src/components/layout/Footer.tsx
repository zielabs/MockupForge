"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "id";

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="url(#footerLogoGrad)" />
                <path d="M7 14L11 10L15 14L19 10L23 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 19L11 15L15 19L19 15L23 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                <defs>
                  <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="28" y2="28">
                    <stop stopColor="#6C5CE7" />
                    <stop offset="1" stopColor="#A29BFE" />
                  </linearGradient>
                </defs>
              </svg>
              <span>MockupForge</span>
            </div>
            <p className="footer-desc">{t("description")}</p>
          </div>

          <div className="footer-links-group">
            <h4>{t("product")}</h4>
            <Link href={`/${locale}/templates`}>Templates</Link>
            <Link href={`/${locale}/pricing`}>{t("support")}</Link>
          </div>

          <div className="footer-links-group">
            <h4>{t("company")}</h4>
            <Link href="#">{t("about")}</Link>
            <Link href="#">{t("blog")}</Link>
            <Link href="#">{t("careers")}</Link>
          </div>

          <div className="footer-links-group">
            <h4>{t("support")}</h4>
            <Link href="#">{t("help")}</Link>
            <Link href="#">{t("contact")}</Link>
            <Link href="#">{t("privacy")}</Link>
            <Link href="#">{t("terms")}</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} MockupForge. {t("rights")}</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--bg-dark);
          color: rgba(255, 255, 255, 0.7);
          padding: var(--space-4xl) 0 var(--space-xl);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: var(--space-3xl);
          margin-bottom: var(--space-3xl);
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-weight: 800;
          font-size: 1.25rem;
          color: white;
          margin-bottom: var(--space-md);
        }
        .footer-desc {
          font-size: 0.875rem;
          line-height: 1.7;
          max-width: 300px;
        }
        .footer-links-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        .footer-links-group h4 {
          color: white;
          font-weight: 600;
          margin-bottom: var(--space-sm);
          font-size: 0.938rem;
        }
        .footer-links-group :global(a) {
          font-size: 0.875rem;
          transition: color var(--transition-fast);
        }
        .footer-links-group :global(a:hover) {
          color: var(--primary-light);
        }
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: var(--space-xl);
          text-align: center;
          font-size: 0.813rem;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: var(--space-xl);
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </footer>
  );
}
