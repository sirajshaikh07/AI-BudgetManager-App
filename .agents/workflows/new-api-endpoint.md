---
description: Add a new REST endpoint to the NestJS API
---

1. Ask: "What entity and what HTTP method/action?"
2. Check `docs/BudgetPro_ProductionDoc.docx` Section 4 for the spec
3. Create DTO with class-validator decorators
4. Add method to service with full TypeORM query
5. Add route to controller with @UseGuards(JwtAuthGuard)
6. Write unit test mocking the repository
7. Run `pnpm typecheck` — zero errors required

## STEP 6 — Extensions to Install

In Antigravity (it supports VS Code marketplace), install these:
```
Essential:
✅ Prettier — code formatter
✅ ESLint — linting
✅ TypeScript + JavaScript — language support
✅ REST Client — test API endpoints from .http files
✅ PostgreSQL (by Chris Kolkman) — DB explorer sidebar
✅ Thunder Client — lightweight Postman alternative
✅ GitLens — git history in editor

React Native:
✅ React Native Tools (Microsoft)
✅ Expo Tools
✅ React Native Snippets

NestJS:
✅ NestJS Files — generate boilerplate fast
✅ NestJS Snippets