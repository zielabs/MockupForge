"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shirt, Crown, Coffee, GlassWater, ShoppingBag, MousePointerClick, Palette, Download, MousePointer, Eye, Package, Zap, Save, Sparkles, LayoutGrid } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const categoryIconMap: Record<string, any> = {
  tshirt: Shirt, hoodie: Shirt,
  hat: Crown, mug: Coffee, tumbler: GlassWater, totebag: ShoppingBag,
};

const categories = [
  { key: "tshirt", count: 55 },
  { key: "hoodie", count: 25 },

  { key: "hat", count: 30 },
  { key: "mug", count: 35 },
  { key: "tumbler", count: 12 },
  { key: "totebag", count: 22 },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function LandingPage() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "id";

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid-pattern" />
        </div>
        <div className="container hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="badge badge-primary">{t("hero.badge")}</span>
            <h1 className="hero-title">{t("hero.title")}</h1>
            <p className="hero-subtitle">{t("hero.subtitle")}</p>
            <br />
            <div className="hero-cta-group">
              <Link href={`/${locale}/templates`} className="btn btn-primary btn-lg">
                {t("hero.cta")}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href={`/${locale}/templates`} className="btn btn-secondary btn-lg">
                {t("hero.ctaSecondary")}
              </Link>
            </div>
            {/* <p className="hero-trust">{t("hero.trustedBy")}</p> */}
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-mockup-showcase">
              <div className="mockup-card mockup-card-1">
                <div className="mockup-preview"><Shirt size={32} /></div>
                <span>T-Shirt Mockup</span>
              </div>
              <div className="mockup-card mockup-card-2">
                <div className="mockup-preview"><Coffee size={32} /></div>
                <span>Mug Mockup</span>
              </div>
              <div className="mockup-card mockup-card-3">
                <div className="mockup-preview"><Crown size={32} /></div>
                <span>Hat Mockup</span>
              </div>
              <div className="floating-badge floating-badge-1"><Eye size={14} style={{ marginRight: 4 }} /> 2D Preview</div>
              <div className="floating-badge floating-badge-2"><LayoutGrid size={14} style={{ marginRight: 4 }} /> 50+ Templates</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how-it-works">
        <div className="container" style={{ textAlign: "center" }}>
          <motion.h2
            className="section-title"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeInUp} custom={0}
          >
            {t("howItWorks.title")}
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeInUp} custom={1}
          >
            {t("howItWorks.subtitle")}
          </motion.p>

          <div className="steps-grid">
            {[1, 2, 3].map((step, i) => (
              <motion.div
                key={step}
                className="step-card"
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeInUp} custom={i + 2}
              >
                <div className="step-number">{step}</div>
                <div className="step-icon">
                  {step === 1 ? <MousePointerClick size={28} /> : step === 2 ? <Palette size={28} /> : <Download size={28} />}
                </div>
                <h3>{t(`howItWorks.step${step}Title`)}</h3>
                <p>{t(`howItWorks.step${step}Desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section categories-section">
        <div className="container" style={{ textAlign: "center" }}>
          <motion.h2
            className="section-title"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeInUp} custom={0}
          >
            {t("categories.title")}
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeInUp} custom={1}
          >
            {t("categories.subtitle")}
          </motion.p>

          <div className="categories-grid">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.key}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeInUp} custom={i * 0.5}
              >
                <Link href={`/${locale}/templates?category=${cat.key}`} className="category-card">
                  <span className="category-icon">{(() => { const Icon = categoryIconMap[cat.key]; return Icon ? <Icon size={28} /> : null; })()}</span>
                  <span className="category-name">{t(`categories.${cat.key}`)}</span>
                  {/* <span className="category-count">{cat.count}+</span> */}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section features-section">
        <div className="container" style={{ textAlign: "center" }}>
          <motion.h2
            className="section-title"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeInUp} custom={0}
          >
            {t("features.title")}
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeInUp} custom={1}
          >
            {t("features.subtitle")}
          </motion.p>

          <div className="features-grid">
            {[1, 2, 3, 4, 5, 6].map((f, i) => (
              <motion.div
                key={f}
                className="feature-card card"
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeInUp} custom={i}
              >
                <div className="feature-icon-wrapper">
                  {f === 1 ? <MousePointer size={24} /> : f === 2 ? <Eye size={24} /> : f === 3 ? <Download size={24} /> : f === 4 ? <Package size={24} /> : f === 5 ? <Zap size={24} /> : <Save size={24} />}
                </div>
                <h3>{t(`features.feature${f}Title`)}</h3>
                <p>{t(`features.feature${f}Desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="section pricing-section" id="pricing">
        <div className="container" style={{ textAlign: "center", overflow: "visible" }}>
          <motion.h2
            className="section-title"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeInUp} custom={0}
          >
            {t("pricing.title")}
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeInUp} custom={1}
          >
            {t("pricing.subtitle")}
          </motion.p>

          <div className="pricing-grid" style={{ paddingTop: 20 }}>
            {/* Free */}
            <motion.div className="pricing-card card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} custom={2}>
              <div className="pricing-header">
                <h3>{t("pricing.free")}</h3>
                <div className="pricing-price">
                  <span className="price-amount">{t("pricing.freePrice")}</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>✓ {t("pricing.features.mockupLimit3")}</li>
                <li>✓ {t("pricing.features.basicProducts")}</li>
                <li>✓ {t("pricing.features.export720")}</li>
                <li>✓ {t("pricing.features.formatPng")}</li>
                <li>✓ {t("pricing.features.templates5")}</li>
                <li className="disabled">✗ {t("pricing.features.noSave")}</li>
              </ul>
              <Link href={`/${locale}/login`} className="btn btn-secondary" style={{ width: "100%" }}>
                {t("pricing.getStarted")}
              </Link>
            </motion.div>

            {/* Pro Monthly */}
            <motion.div className="pricing-card pricing-card-popular card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} custom={3}>
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <span style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
                  color: "white",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "5px 18px",
                  borderRadius: 20,
                }}>{t("pricing.popular")}</span>
              </div>
              <div className="pricing-header">
                <h3>{t("pricing.proMonthly")}</h3>
                <div className="pricing-price">
                  <span className="price-amount">{t("pricing.proMonthlyPrice")}</span>
                  <span className="price-period">{t("pricing.perMonth")}</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>✓ {t("pricing.features.mockupUnlimited")}</li>
                <li>✓ {t("pricing.features.allProducts")}</li>
                <li>✓ {t("pricing.features.exportHD")}</li>
                <li>✓ {t("pricing.features.formatAll")}</li>
                <li>✓ {t("pricing.features.templates50")}</li>
                <li>✓ {t("pricing.features.save50")}</li>
                <li>✓ {t("pricing.features.batchExport")}</li>
                <li>✓ {t("pricing.features.priorityRender")}</li>
                <li>✓ {t("pricing.features.emailSupport")}</li>
              </ul>
              <Link href={`/${locale}/login`} className="btn btn-primary" style={{ width: "100%" }}>
                {t("pricing.choosePlan")}
              </Link>
            </motion.div>

            {/* Pro Yearly */}
            <motion.div className="pricing-card card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} custom={4}>
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <span style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #00B894, #00D2FF)",
                  color: "white",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "5px 18px",
                  borderRadius: 20,
                }}>{t("pricing.save")}</span>
              </div>
              <div className="pricing-header">
                <h3>{t("pricing.proYearly")}</h3>
                <div className="pricing-price">
                  <span className="price-amount">{t("pricing.proYearlyPrice")}</span>
                  <span className="price-period">{t("pricing.perYear")}</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>✓ {t("pricing.features.mockupUnlimited")}</li>
                <li>✓ {t("pricing.features.allProducts")}</li>
                <li>✓ {t("pricing.features.exportHD")}</li>
                <li>✓ {t("pricing.features.formatAll")}</li>
                <li>✓ {t("pricing.features.templates50")}</li>
                <li>✓ {t("pricing.features.save200")}</li>
                <li>✓ {t("pricing.features.batchExport")}</li>
                <li>✓ {t("pricing.features.priorityRender")}</li>
                <li>✓ {t("pricing.features.prioritySupport")}</li>
              </ul>
              <Link href={`/${locale}/login`} className="btn btn-secondary" style={{ width: "100%" }}>
                {t("pricing.choosePlan")}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container" style={{ textAlign: "center" }}>
          <motion.div
            className="cta-box"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeInUp} custom={0}
          >
            <h2 className="section-title" style={{ color: "white" }}>{t("cta.title")}</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "var(--space-xl)", fontSize: "1.125rem" }}>
              {t("cta.subtitle")}
            </p>
            <Link href={`/${locale}/login`} className="btn btn-lg cta-btn">
              {t("cta.button")}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding-top: var(--header-height);
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
        }
        .hero-orb-1 {
          width: 600px;
          height: 600px;
          background: rgba(108, 92, 231, 0.3);
          top: -200px;
          right: -100px;
          animation: float 8s ease-in-out infinite;
        }
        .hero-orb-2 {
          width: 400px;
          height: 400px;
          background: rgba(0, 210, 255, 0.2);
          bottom: -100px;
          left: -50px;
          animation: float 10s ease-in-out infinite reverse;
        }
        .hero-orb-3 {
          width: 300px;
          height: 300px;
          background: rgba(162, 155, 254, 0.25);
          top: 50%;
          left: 50%;
          animation: float 12s ease-in-out infinite;
        }
        .hero-grid-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(108, 92, 231, 0.08) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3xl);
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .hero-text {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }
        .hero-title {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, var(--text) 0%, var(--primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: 1.188rem;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 520px;
        }
        .hero-cta-group {
          display: flex;
          gap: var(--space-md);
          flex-wrap: wrap;
        }
        .hero-trust {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .hero-mockup-showcase {
          position: relative;
          width: 420px;
          height: 420px;
        }
        .mockup-card {
          position: absolute;
          background: white;
          border-radius: var(--radius-xl);
          padding: var(--space-lg);
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
          transition: transform 0.3s ease;
        }
        .mockup-card:hover {
          transform: scale(1.05);
        }
        .mockup-card span {
          font-size: 0.813rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .mockup-preview {
          font-size: 4rem;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
        }
        .mockup-card-1 {
          top: 20px;
          left: 0;
          animation: float 6s ease-in-out infinite;
        }
        .mockup-card-2 {
          top: 40px;
          right: 0;
          animation: float 7s ease-in-out infinite 1s;
        }
        .mockup-card-3 {
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          animation: float 8s ease-in-out infinite 2s;
        }
        .floating-badge {
          position: absolute;
          background: white;
          border-radius: var(--radius-full);
          padding: 0.5rem 1rem;
          font-size: 0.813rem;
          font-weight: 600;
          box-shadow: var(--shadow-md);
          white-space: nowrap;
        }
        .floating-badge-1 {
          top: 0;
          right: 30px;
          color: var(--primary);
          animation: float 5s ease-in-out infinite 0.5s;
        }
        .floating-badge-2 {
          bottom: 40px;
          left: 20px;
          color: var(--accent-dark);
          animation: float 6s ease-in-out infinite 1.5s;
        }

        /* Steps */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-xl);
        }
        .step-card {
          padding: var(--space-2xl);
          text-align: center;
          position: relative;
        }
        .step-number {
          position: absolute;
          top: var(--space-md);
          right: var(--space-md);
          font-size: 4rem;
          font-weight: 900;
          color: rgba(108, 92, 231, 0.06);
          line-height: 1;
        }
        .step-icon {
          font-size: 3rem;
          margin-bottom: var(--space-md);
        }
        .step-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: var(--space-sm);
        }
        .step-card p {
          color: var(--text-secondary);
          font-size: 0.938rem;
        }

        /* Categories */
        .categories-section {
          background: var(--bg-secondary);
        }
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: var(--space-md);
          max-width: 900px;
          margin: 0 auto;
        }
        .category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-lg);
          background: white;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-light);
          transition: all var(--transition-normal);
          cursor: pointer;
        }
        .category-card:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow-md);
          transform: translateY(-4px);
        }
        .category-icon {
          font-size: 2.5rem;
        }
        .category-name {
          font-weight: 600;
          font-size: 0.875rem;
        }
        .category-count {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Features */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-xl);
          text-align: left;
        }
        .feature-card {
          padding: var(--space-2xl);
        }
        .feature-icon-wrapper {
          font-size: 2.5rem;
          margin-bottom: var(--space-md);
        }
        .feature-card h3 {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: var(--space-sm);
        }
        .feature-card p {
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.6;
        }

        /* Pricing */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-xl);
          align-items: start;
          max-width: 1000px;
          margin: 0 auto;
        }
        .pricing-card {
          padding: var(--space-2xl);
          text-align: left;
          position: relative;
          overflow: hidden;
        }
        .pricing-card-popular {
          border: 2px solid var(--primary);
          box-shadow: var(--shadow-glow);
          transform: scale(1.05);
        }
        .pricing-card-popular:hover {
          transform: scale(1.07);
        }
        .pricing-header {
          margin-bottom: var(--space-xl);
        }
        .pricing-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: var(--space-sm);
        }
        .price-amount {
          font-size: 2rem;
          font-weight: 900;
        }
        .price-period {
          font-size: 0.938rem;
          color: var(--text-muted);
        }
        .pricing-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          margin-bottom: var(--space-xl);
        }
        .pricing-features li {
          font-size: 0.875rem;
          color: var(--text-secondary);
          padding: 0.25rem 0;
        }
        .pricing-features li.disabled {
          color: var(--text-muted);
          text-decoration: line-through;
        }

        /* CTA */
        .cta-box {
          background: var(--primary-gradient);
          border-radius: var(--radius-2xl);
          padding: var(--space-4xl) var(--space-2xl);
          position: relative;
          overflow: hidden;
        }
        .cta-box::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .cta-btn {
          background: white;
          color: var(--primary);
          font-weight: 700;
          position: relative;
          z-index: 1;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        }

        @media (max-width: 1024px) {
          .hero-title { font-size: 2.5rem; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .pricing-grid { grid-template-columns: 1fr; max-width: 400px; }
          .pricing-card-popular { transform: scale(1); }
          .pricing-card-popular:hover { transform: translateY(-4px); }
        }
        @media (max-width: 768px) {
          .hero-content { grid-template-columns: 1fr; text-align: center; }
          .hero-text { align-items: center; }
          .hero-subtitle { max-width: 100%; }
          .hero-visual { display: none; }
          .hero-title { font-size: 2rem; }
          .steps-grid { grid-template-columns: 1fr; }
          .features-grid { grid-template-columns: 1fr; }
          .categories-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </>
  );
}
