# Sri Amman Builders - Codebase & Deployment Guide

This guide describes the structural architecture of the fully functional Sri Amman Builders platform, along with instructions to deploy it to **Netlify** with a **PostgreSQL Database** (e.g., Neon or Supabase) and **Cloudinary** media storage.

---

## 1. Directory Structure

```text
/
├── prisma/
│   └── schema.prisma        # Database models designed for Prisma ORM
├── src/
│   ├── components/
│   │   ├── Navbar.tsx       # Navigation bar with blinking company title logo
│   │   ├── HeroSection.tsx  # Dynamic banner block with admin edit capabilities
│   │   ├── LandsPage.tsx    # Gated plot listings with detail view and CRUD forms
│   │   ├── BuildingsPage.tsx# Beautiful residential complexes with CRUD managers
│   │   ├── ProjectsPage.tsx # Completed engineering landmarks and specifications
│   │   ├── AboutUsPage.tsx  # Brand heritage dashboard with quick contact editor
│   │   ├── AdminPanel.tsx   # Secure username/password control, session, metrics
│   │   └── ImageUploader.tsx# Base64 image processor with drag & drop handling
│   ├── types.ts             # TypeScript entity interface mappings
│   ├── App.tsx              # React UI routing system and fetch actions
│   ├── index.css            # Tailwind CSS importing and blinking typography custom rules
│   └── main.tsx             # Standard entry point file
├── server.ts                # Express server handling static assets and API requests 
├── netlify.toml             # Redirect configurations and serverless functions paths
├── package.json             # Build commands, scripts, and runtime dependencies
└── .env.example             # Safe environment variable templates
```

---

## 2. Relational Database Design (SQL & Prisma)

### Complete Prisma Schema (`prisma/schema.prisma`)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Land {
  id          String   @id @default(uuid())
  title       String
  price       String
  size        String
  location    String
  description String   @db.Text
  imageUrl    String   @db.Text
  createdAt   DateTime @default(now())
}

model Building {
  id          String   @id @default(uuid())
  title       String
  price       String
  size        String
  location    String
  description String   @db.Text
  imageUrl    String   @db.Text
  createdAt   DateTime @default(now())
}

model Project {
  id             String   @id @default(uuid())
  title          String
  location       String
  specification  String   @db.Text
  description    String   @db.Text
  imageUrl       String   @db.Text
  completionDate String
  createdAt      DateTime @default(now())
}

model About {
  id             String   @id @default(uuid())
  companyHistory String   @db.Text
  mission        String   @db.Text
  vision         String   @db.Text
  achievements   String   @db.Text
  address        String
  email          String
  phone          String
}

model Hero {
  id        String   @id @default(uuid())
  imageUrl  String   @db.Text
}

model Admin {
  id           String   @id @default(uuid())
  username     String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}
```

### Raw PostgreSQL SQL Commands Script
Should you configure standard Postgres clients directly, run:
```sql
CREATE TABLE "Land" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "price" TEXT NOT NULL,
  "size" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now()
);

CREATE TABLE "Building" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "price" TEXT NOT NULL,
  "size" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now()
);

CREATE TABLE "Project" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "specification" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "completionDate" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now()
);

CREATE TABLE "About" (
  "id" TEXT PRIMARY KEY,
  "companyHistory" TEXT NOT NULL,
  "mission" TEXT NOT NULL,
  "vision" TEXT NOT NULL,
  "achievements" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL
);

CREATE TABLE "Hero" (
  "id" TEXT PRIMARY KEY,
  "imageUrl" TEXT NOT NULL
);

CREATE TABLE "Admin" (
  "id" TEXT PRIMARY KEY,
  "username" TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now()
);
```

---

## 3. Serverless API Integration (Netlify Functions Route handler)

When you deploy containing serverless architectures, create a Netlify function handler under `/netlify/functions/api.ts` (or CJS based `/netlify/functions/api.js`) using a framework adapter such as `serverless-http`.

Example of Netlify Function integration wrapper:
```typescript
import express from 'express';
import serverless from 'serverless-http';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const app = express();
const prisma = new PrismaClient();

// Your routing routes (GET /api/content, POST /api/lands etc.)
// ... (directly maps to server.ts routing engine)

export const handler = serverless(app);
```

---

## 4. Production Deployment Checklist on Netlify

### Step A: Configure External Media Engine (Cloudinary)
1. Sign up on [Cloudinary](https://cloudinary.com/).
2. Copy your **Cloud Name**, **API Key**, and **API Secret** credentials from your dashboard.
3. Once configured in Netlify ambient variables, all images uploaded through our premium drag & drop uploader will instantly host permanently in your Cloudinary cloud!

### Step B: Provision Relational Database
1. Go to [Neon.tech](https://neon.tech/) or [Supabase](https://supabase.com/).
2. Set up a free/hobby PostgreSQL database cluster.
3. Grab the secure connection string mapping. E.g., `postgresql://...`

### Step C: Configure Netlify Environment Settings
When triggering a deploy on Netlify UI, configure under **Site Settings > Environment Variables**:
- `DATABASE_URL` = (Your Neon Connection String URL)
- `CLOUDINARY_CLOUD_NAME` = (Your Cloudinary Cloud Name)
- `CLOUDINARY_API_KEY` = (Your Cloudinary API key)
- `CLOUDINARY_API_SECRET` = (Your Cloudinary Secret passcode)

---

## 5. Build Commands
```bash
# Install local packages
npm install

# Build static assets & bundle server
npm run build
```
The application will bundle perfectly for deployment.
