"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, CreditCard } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function SettingsPage() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const locale = pathname.startsWith("/en") ? "en" : "id";

  const plan = (session?.user as any)?.subscription?.plan || "FREE";
  const isPro = plan !== "FREE";

  return (
    <div className="settings-page">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {locale === "id" ? "Pengaturan Akun" : "Account Settings"}
      </motion.h1>

      {/* Profile Section */}
      <motion.section className="settings-section" initial="hidden" animate="visible" variants={fadeInUp} custom={1}>
        <h2>{locale === "id" ? "Profil" : "Profile"}</h2>
        <div className="settings-card">
          <div className="profile-row">
            <div className="profile-avatar-wrapper">
              {session?.user?.image ? (
                <img src={session.user.image} alt="" className="profile-avatar" />
              ) : (
                <div className="profile-avatar-placeholder">
                  {(session?.user?.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
              {/* <button className="avatar-edit-btn" title={locale === "id" ? "Ubah foto" : "Change photo"}>📷</button> */}
            </div>
            <div className="profile-info">
              <p className="profile-name">{session?.user?.name || "User"}</p>
              <p className="profile-email">{session?.user?.email}</p>
              {/* <span className="profile-since">
                {locale === "id" ? "Bergabung sejak April 2024" : "Member since April 2024"}
              </span> */}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>{locale === "id" ? "Nama Lengkap" : "Full Name"}</label>
              <input type="text" defaultValue={session?.user?.name || ""} className="form-input" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" defaultValue={session?.user?.email || ""} className="form-input" disabled />
              <span className="form-hint">{locale === "id" ? "Email tidak dapat diubah (menggunakan Google)" : "Email cannot be changed (Google account)"}</span>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary btn-sm">
              {locale === "id" ? "Simpan Perubahan" : "Save Changes"}
            </button>
          </div>
        </div>
      </motion.section>

      {/* Subscription Section */}
      <motion.section className="settings-section" initial="hidden" animate="visible" variants={fadeInUp} custom={2}>
        <h2>{locale === "id" ? "Langganan" : "Subscription"}</h2>
        <div className="settings-card">
          <div className="subscription-info">
            <div className="sub-plan-header">
              <div>
                <span className={`sub-plan-badge ${isPro ? "pro" : "free"}`}>
                  {plan === "FREE" ? "Free" : plan === "PRO_MONTHLY" ? "Pro Monthly" : "Pro Yearly"}
                </span>
                <p className="sub-status">
                  {isPro
                    ? (locale === "id" ? "Aktif — berlaku hingga 27 Mei 2024" : "Active — valid until May 27, 2024")
                    : (locale === "id" ? "Fitur terbatas" : "Limited features")}
                </p>
              </div>
              {!isPro && (
                <Link href={`/${locale}/pricing`} className="btn btn-primary btn-sm">
                  {locale === "id" ? "Upgrade ke Pro" : "Upgrade to Pro"}
                </Link>
              )}
            </div>

            <div className="sub-features-summary">
              <div className="sub-feature">
                <span className="sub-feature-icon">{isPro ? "Unlimited" : "3"}</span>
                <span>{locale === "id" ? "Mockup" : "Mockups"}</span>
              </div>
              <div className="sub-feature">
                <span className="sub-feature-icon">{isPro ? "50+" : "5"}</span>
                <span>Templates</span>
              </div>
              <div className="sub-feature">
                <span className="sub-feature-icon">{isPro ? <Check size={18} color="#00B894" /> : <X size={18} color="#FF6B6B" />}</span>
                <span>{locale === "id" ? "Simpan Proyek" : "Save Projects"}</span>
              </div>
              <div className="sub-feature">
                <span className="sub-feature-icon">{isPro ? "HD" : "720p"}</span>
                <span>Export</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Payment History */}
      <motion.section className="settings-section" initial="hidden" animate="visible" variants={fadeInUp} custom={3}>
        <h2>{locale === "id" ? "Riwayat Pembayaran" : "Payment History"}</h2>
        <div className="settings-card">
          {isPro ? (
            <table className="payment-table">
              <thead>
                <tr>
                  <th>{locale === "id" ? "Tanggal" : "Date"}</th>
                  <th>{locale === "id" ? "Paket" : "Plan"}</th>
                  <th>{locale === "id" ? "Jumlah" : "Amount"}</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>27 Apr 2024</td>
                  <td>Pro Monthly</td>
                  <td>Rp 49,000</td>
                  <td><span className="payment-status success">{locale === "id" ? "Berhasil" : "Paid"}</span></td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="empty-payments">
              <p><CreditCard size={18} style={{ marginRight: 6, verticalAlign: "middle" }} /> {locale === "id" ? "Belum ada riwayat pembayaran" : "No payment history yet"}</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Danger Zone */}
      <motion.section className="settings-section danger-zone" initial="hidden" animate="visible" variants={fadeInUp} custom={4}>
        <h2>{locale === "id" ? "Zona Berbahaya" : "Danger Zone"}</h2>
        <div className="settings-card danger-card">
          <div className="danger-row">
            <div>
              <h4>{locale === "id" ? "Hapus Akun" : "Delete Account"}</h4>
              <p>{locale === "id"
                ? "Menghapus akun akan menghilangkan semua data Anda secara permanen."
                : "Deleting your account will permanently remove all your data."}</p>
            </div>
            <button className="btn btn-sm danger-btn">
              {locale === "id" ? "Hapus Akun" : "Delete Account"}
            </button>
          </div>
        </div>
      </motion.section>

      <style jsx>{`
        .settings-page { max-width: 720px; }
        .settings-page h1 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: var(--space-2xl);
        }
        .settings-section {
          margin-bottom: var(--space-2xl);
        }
        .settings-section h2 {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: var(--space-md);
        }
        .settings-card {
          background: white;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-light);
          padding: var(--space-xl);
        }

        /* Profile */
        .profile-row {
          display: flex;
          align-items: center;
          gap: var(--space-xl);
          margin-bottom: var(--space-xl);
          padding-bottom: var(--space-xl);
          border-bottom: 1px solid var(--border-light);
        }
        .profile-avatar-wrapper {
          position: relative;
          flex-shrink: 0;
        }
        .profile-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--border-light);
        }
        .profile-avatar-placeholder {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-gradient);
          color: white;
          font-size: 1.5rem;
          font-weight: 800;
        }
        .avatar-edit-btn {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          border: 2px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .avatar-edit-btn:hover {
          border-color: var(--primary);
        }
        .profile-name {
          font-size: 1.125rem;
          font-weight: 700;
        }
        .profile-email {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        .profile-since {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: var(--space-xs);
          display: block;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-lg);
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }
        .form-group label {
          font-size: 0.813rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .form-input {
          padding: 0.625rem 0.875rem;
          border: 2px solid var(--border);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          color: var(--text);
          transition: border-color var(--transition-fast);
          background: white;
        }
        .form-input:focus {
          border-color: var(--primary);
        }
        .form-input:disabled {
          background: var(--bg-secondary);
          color: var(--text-muted);
          cursor: not-allowed;
        }
        .form-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .form-actions {
          margin-top: var(--space-xl);
          display: flex;
          justify-content: flex-end;
        }

        /* Subscription */
        .sub-plan-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-lg);
        }
        .sub-plan-badge {
          display: inline-block;
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.813rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .sub-plan-badge.free {
          background: var(--bg-secondary);
          color: var(--text-secondary);
        }
        .sub-plan-badge.pro {
          background: var(--primary-gradient);
          color: white;
        }
        .sub-status {
          font-size: 0.813rem;
          color: var(--text-muted);
          margin-top: var(--space-xs);
        }
        .sub-features-summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-md);
        }
        .sub-feature {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: var(--space-md);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          text-align: center;
        }
        .sub-feature-icon {
          font-size: 1.25rem;
          font-weight: 800;
        }
        .sub-feature span:last-child {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Payment History */
        .payment-table {
          width: 100%;
          border-collapse: collapse;
        }
        .payment-table th,
        .payment-table td {
          text-align: left;
          padding: 0.75rem;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--border-light);
        }
        .payment-table th {
          font-weight: 600;
          color: var(--text-muted);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .payment-status {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-full);
        }
        .payment-status.success {
          background: rgba(0, 184, 148, 0.1);
          color: var(--success);
        }
        .empty-payments {
          text-align: center;
          padding: var(--space-xl);
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        /* Danger Zone */
        .danger-zone h2 {
          color: var(--error);
        }
        .danger-card {
          border-color: rgba(255, 107, 107, 0.3);
        }
        .danger-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-xl);
        }
        .danger-row h4 {
          font-size: 0.938rem;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .danger-row p {
          font-size: 0.813rem;
          color: var(--text-muted);
        }
        .danger-btn {
          background: var(--error);
          color: white;
          flex-shrink: 0;
        }
        .danger-btn:hover {
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .profile-row { flex-direction: column; text-align: center; }
          .form-grid { grid-template-columns: 1fr; }
          .sub-features-summary { grid-template-columns: repeat(2, 1fr); }
          .danger-row { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
}
