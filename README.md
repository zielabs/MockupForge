# MockupForge 🎨

> Platform mockup produk profesional #1 di Indonesia. Buat mockup dalam hitungan detik — tanpa software desain mahal.

**MockupForge** is a SaaS platform that lets designers and businesses create professional product mockups instantly. Upload your design, place it on a product template, customize colors, and export in high resolution.

## ✨ Features

- **11 Product Categories** — T-Shirt, Polo, Hoodie, Jersey, Hat, Snapback, Mug, Tumbler, Tote Bag, Poster, Phone Case
- **SVG Product Shapes** — Realistic vector-based product rendering with dynamic color changes
- **Interactive Editor** — Tabbed sidebar (Design/Color/Export), zoom controls, drag positioning
- **Export Options** — PNG (free), JPG/WebP (Pro), with 720p or 1920p resolution
- **Bilingual** — Full Indonesian (ID) and English (EN) localization
- **Auth & Dashboard** — Google OAuth login, project management, subscription tracking
- **Freemium Model** — 3 free mockups, unlimited with Pro subscription
- **Payment Integration** — Mayar.id webhook handler for Indonesian payments

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Vanilla CSS (custom design system) |
| Auth | NextAuth.js v5 (Google OAuth) |
| Database | MySQL / MariaDB |
| ORM | Prisma 7 (MariaDB adapter) |
| Canvas | Fabric.js |
| Animation | Framer Motion |
| i18n | next-intl |
| State | Zustand |
| Image Processing | Sharp |
| Payments | Mayar.id |

## 📁 Project Structure

```
mockupforge/
├── prisma/
│   ├── schema.prisma          # Database schema (11 models)
│   ├── seed.ts                # 15 template seeds
│   └── migrations/            # Auto-generated migrations
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── templates/         # Template gallery
│   │   │   ├── pricing/           # Pricing page
│   │   │   ├── login/             # Google OAuth login
│   │   │   ├── editor/[templateId]/ # Mockup editor
│   │   │   └── dashboard/        # Dashboard, Projects, Settings
│   │   └── api/
│   │       ├── templates/         # GET templates
│   │       ├── projects/          # CRUD projects
│   │       ├── subscription/      # Subscription info
│   │       └── webhooks/mayar/    # Payment webhooks
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   ├── providers/         # SessionProvider
│   │   └── editor/            # ProductShape (SVG)
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   └── prisma.ts          # Prisma client
│   └── messages/
│       ├── en.json            # English translations
│       └── id.json            # Indonesian translations
├── prisma.config.ts           # Prisma v7 config
├── next.config.ts             # Next.js config
└── .env                       # Environment variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MySQL / MariaDB (via XAMPP, Laragon, or standalone)

### Installation

```bash
# Clone and install
cd mockupforge
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL and API keys

# Setup database
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

```env
# Database
DATABASE_URL="mysql://root:@localhost:3306/mockupforge"

# Auth (Google OAuth)
AUTH_SECRET="your-secret-key"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Payments (Mayar.id)
MAYAR_API_KEY="your-mayar-api-key"
MAYAR_WEBHOOK_SECRET="your-webhook-secret"
MAYAR_BASE_URL="https://api.mayar.id/hl/v1"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run seed` | Seed database with templates |
| `npm run lint` | Run ESLint |

## 🗄 Database Schema

```
User ─── Account (OAuth)
  │  └── Session
  ├── Subscription ─── Payment
  ├── Project ─── MockupTemplate
  └── MockupUsage
```

**Enums:** Role, SubscriptionPlan, SubscriptionStatus, PaymentStatus, ProductCategory, ProjectStatus

## 🎯 Subscription Plans

| Feature | Free | Pro Monthly | Pro Yearly |
|---|---|---|---|
| Mockup limit | 3 | Unlimited | Unlimited |
| Templates | 5 basic | 50+ premium | 50+ premium |
| Export resolution | 720p | 1920p Full HD | 1920p Full HD |
| Watermark | Yes | No | No |
| Export formats | PNG only | PNG, JPG, WebP | PNG, JPG, WebP |
| Price | Rp 0 | Rp 49.000/mo | Rp 399.000/yr |

## 📄 License

This project is private and proprietary.

---

Built with ❤️ by the MockupForge team for TEFA PPLG.
