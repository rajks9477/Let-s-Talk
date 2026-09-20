# LOCAL SETUP & DEVELOPMENT GUIDE

## Project: Let's Talk - Next-Generation Unified Communication Super App

---

## 1. System Requirements
- **Node.js**: `v18.17.0` or higher
- **npm**: `v9.0.0` or higher
- **Database**: PostgreSQL 14+ or Docker
- **Memory**: Minimum 4GB RAM

---

## 2. Step-by-Step Installation

### Step A: Clone & Setup Environment
```bash
git clone https://github.com/your-org/lets-talk.git
cd "Let's Talk"

cp .env.example .env
```

### Step B: Install All Dependencies
```bash
npm install
cd apps/server && npm install
cd ../web && npm install
cd ../..
```

### Step C: Database Setup
```bash
# Generate Prisma Client code
npx prisma generate --schema=prisma/schema.prisma

# Push schema to your PostgreSQL instance
npx prisma db push --schema=prisma/schema.prisma
```

### Step D: Launch Local Development Servers
```bash
npm run dev
```

The backend server will run on `http://localhost:5000` and the web frontend on `http://localhost:3000`.
