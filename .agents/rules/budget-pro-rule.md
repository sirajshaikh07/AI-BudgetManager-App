---
trigger: always_on
---

# Budget Pro Manager — Agent Rules

## PROJECT CONTEXT
You are building "Budget Pro Manager" — a React Native + Node.js personal 
finance app with an AI assistant (Anthropic Claude + RAG via pgvector).
Full architecture is documented in `docs/BudgetPro_ProductionDoc.docx`.
The approved UI design is in `docs/ui-prototype.html`.

## MANDATORY BEHAVIOUR
- ALWAYS read `docs/BudgetPro_ProductionDoc.docx` before making 
  architectural decisions.
- Reference the UI prototype at `docs/ui-prototype.html` for all 
  design decisions — dark theme, purple/indigo palette, Syne font.
- Follow the phased roadmap: DO NOT build Phase 2 features while 
  Phase 1 is incomplete.
- Before writing any code, create an Artifact plan in `artifacts/` 
  showing what you will build and why.

## TECH STACK (STRICT)
- Mobile: React Native with Expo SDK 51, Expo Router v3
- State: Zustand (NOT Redux, NOT Context API)
- Backend: Node.js with NestJS framework (NOT Express directly)
- Database: PostgreSQL 16 with TypeORM
- Cache: Redis 7 via ioredis
- AI: Anthropic Claude API (model: claude-sonnet-4-20250514)
- Embeddings: OpenAI text-embedding-3-small via pgvector
- Auth: JWT (RS256), bcrypt cost factor 12

## CODE STANDARDS
- TypeScript strict mode on ALL files — no `any` types
- All API inputs validated with class-validator DTOs
- All DB queries via TypeORM — NEVER raw string SQL
- Every new file needs a matching unit test file
- NestJS services follow: Controller → Service → Repository pattern
- Naming: camelCase for variables, PascalCase for classes, 
  kebab-case for filenames

## PHASE 1 SCOPE ONLY (Current Phase)
Build ONLY these features right now:
1. Auth Service — register, login, refresh token, JWT guards
2. User model and PostgreSQL migration
3. Account CRUD (Cash, Bank, UPI, Credit Card types)
4. Category model (load default 14 categories from seed)
5. Transaction CRUD (Income, Expense, Transfer)
6. Basic Home screen in React Native (balance card + recent transactions)
7. Add Transaction bottom sheet UI

DO NOT build: AI chat, RAG, analytics charts, bank sync, or exports yet.

## SAFETY RULES
- NEVER run `rm -rf` or any destructive filesystem commands
- NEVER commit `.env` files or API keys
- NEVER write passwords or tokens in any source file
- Always use `pnpm` (NOT npm or yarn) for package management
- Always run `pnpm typecheck` before marking a task complete