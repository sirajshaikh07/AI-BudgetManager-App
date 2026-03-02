---
name: budget-pro-context
description: Load when asked about Budget Pro architecture, database schema, 
API endpoints, or project structure. Also load for any feature implementation.
---

# Budget Pro — Project Knowledge

## Current Phase: 1 (Auth + Transactions Core)

## Key File Locations
- API entry: apps/api/src/main.ts
- Mobile entry: apps/mobile/app/_layout.tsx
- Shared types: packages/shared/src/types/
- DB migrations: apps/api/src/database/migrations/
- Environment template: .env.example

## Database Connection
PostgreSQL on localhost:5432, db: budget_pro_dev
Redis on localhost:6379

## Port Map
- NestJS API: 3000
- React Native Metro: 8081
- PostgreSQL: 5432
- Redis: 6379

## Important Patterns
- Auth guard: @UseGuards(JwtAuthGuard) on protected routes
- Current user: @CurrentUser() decorator injects user from JWT
- All monetary values: DECIMAL(15,2), stored in user's currency
- Soft deletes: set deleted_at, never hard DELETE