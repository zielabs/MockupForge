"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function PricingPage() {
  const t = useTranslations("pricing");
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  
  const locale = pathname.startsWith("/en") ? "en" : "id";

  const handleCheckout = async (planKey: string) => {
    if (planKey === "free") {
      router.push(`/${locale}/dashboard`);
      return;
    }

    if (status !== "authenticated") {
      router.push(`/${locale}/login`);
      return;
    }

    try {
      setLoadingPlan(planKey);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initiate checkout");
      }
    } catch (error) {
      console.error(error);
      alert("Checkout error");
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      key: "free",
      name: t("free"),
      price: t("freePrice"),
      period: "",
      badge: null,
      highlight: false,
      features: [
        { text: t("features.mockupLimit3"), included: true },
        { text: t("features.basicProducts"), included: true },
        { text: t("features.export720"), included: true },
        { text: t("features.formatPng"), included: true },
        { text: t("features.templates5"), included: true },
        { text: t("features.noSave"), included: false },
        { text: t("features.batchExport"), included: false },
        { text: t("features.priorityRender"), included: false },
      ],
      cta: t("getStarted"),
      ctaStyle: "btn-secondary",
    },
    {
      key: "monthly",
      name: t("proMonthly"),
      price: t("proMonthlyPrice"),
      period: t("perMonth"),
      badge: t("popular"),
      highlight: true,
      features: [
        { text: t("features.mockupUnlimited"), included: true },
        { text: t("features.allProducts"), included: true },
        { text: t("features.exportHD"), included: true },
        { text: t("features.formatAll"), included: true },
        { text: t("features.templates50"), included: true },
        { text: t("features.save50"), included: true },
        { text: t("features.batchExport"), included: true },
        { text: t("features.priorityRender"), included: true },
        { text: t("features.emailSupport"), included: true },
      ],
      cta: t("choosePlan"),
      ctaStyle: "btn-primary",
    },
    {
      key: "yearly",
      name: t("proYearly"),
      price: t("proYearlyPrice"),
      period: t("perYear"),
      badge: t("save"),
      highlight: false,
      features: [
        { text: t("features.mockupUnlimited"), included: true },
        { text: t("features.allProducts"), included: true },
        { text: t("features.exportHD"), included: true },
        { text: t("features.formatAll"), included: true },
        { text: t("features.templates50"), included: true },
        { text: t("features.save200"), included: true },
        { text: t("features.batchExport"), included: true },
        { text: t("features.priorityRender"), included: true },
        { text: t("features.prioritySupport"), included: true },
      ],
      cta: t("choosePlan"),
      ctaStyle: "btn-secondary",
    },
  ];

  return (
    <>
      <Header />
      <main className="pricing-page section">
        <div className="container" style={{ textAlign: "center" }}>
          <motion.h1 className="section-title" initial="hidden" animate="visible" variants={fadeInUp} custom={0}>
            {t("title")}
          </motion.h1>
          <motion.p className="section-subtitle" initial="hidden" animate="visible" variants={fadeInUp} custom={1}>
            {t("subtitle")}
          </motion.p>

          <div className="pricing-cards">
            {plans.map((plan, i) => (
              <motion.div key={plan.key} className={`p-card card ${plan.highlight ? "p-card-highlight" : ""}`}
                initial="hidden" animate="visible" variants={fadeInUp} custom={i + 2}>
                {plan.badge && (
                  <div style={{ textAlign: "center", marginBottom: 12 }}>
                    <span style={{
                      display: "inline-block",
                      background: plan.highlight
                        ? "linear-gradient(135deg, #6C5CE7, #A29BFE)"
                        : "linear-gradient(135deg, #00B894, #00D2FF)",
                      color: "white",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "5px 18px",
                      borderRadius: 20,
                    }}>{plan.badge}</span>
                  </div>
                )}
                <div className="p-header">
                  <h3>{plan.name}</h3>
                  <div className="p-price">
                    <span className="p-amount">{plan.price}</span>
                    {plan.period && <span className="p-period">{plan.period}</span>}
                  </div>
                </div>
                <ul className="p-features">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className={f.included ? "" : "disabled"}>
                      <span className="check">{f.included ? "✓" : "✗"}</span>
                      {f.text}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handleCheckout(plan.key)} 
                  className={`btn ${plan.ctaStyle}`} 
                  style={{ width: "100%", opacity: loadingPlan === plan.key ? 0.7 : 1 }}
                  disabled={loadingPlan === plan.key}
                >
                  {loadingPlan === plan.key ? "Loading..." : plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        .pricing-page {
          padding-top: calc(var(--header-height) + var(--space-3xl));
        }
        .pricing-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-xl);
          max-width: 1000px;
          margin: 0 auto;
          align-items: start;
        }
        .p-card {
          padding: var(--space-2xl);
          text-align: left;
          position: relative;
          overflow: hidden;
        }
        .p-card-highlight {
          border: 2px solid var(--primary);
          box-shadow: var(--shadow-glow);
          transform: scale(1.05);
        }
        .p-card-highlight:hover {
          transform: scale(1.07);
        }
        .p-header { margin-bottom: var(--space-xl); }
        .p-header h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-sm); }
        .p-amount { font-size: 2.25rem; font-weight: 900; }
        .p-period { font-size: 0.938rem; color: var(--text-muted); margin-left: 4px; }
        .p-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          margin-bottom: var(--space-xl);
        }
        .p-features li {
          font-size: 0.875rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        .p-features li.disabled {
          color: var(--text-muted);
          text-decoration: line-through;
        }
        .check {
          font-weight: 700;
          font-size: 0.75rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .p-features li:not(.disabled) .check {
          background: rgba(0, 184, 148, 0.1);
          color: var(--success);
        }
        .p-features li.disabled .check {
          background: rgba(255, 107, 107, 0.1);
          color: var(--error);
        }

        @media (max-width: 1024px) {
          .pricing-cards { grid-template-columns: 1fr; max-width: 420px; }
          .p-card-highlight { transform: none; }
          .p-card-highlight:hover { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}
