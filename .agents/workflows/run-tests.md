---
description: Run all tests and type-checking for Budget Pro monorepo
---

1. From the repo root, run type checking across all workspaces:
   ```
   pnpm typecheck
   ```
2. Run all unit tests across all workspaces:
   ```
   pnpm test
   ```
3. To run only API tests:
   ```
   cd apps/api && pnpm test
   ```
4. To run only with coverage:
   ```
   pnpm test --coverage
   ```
5. Fix any TypeScript errors reported by `pnpm typecheck` before committing.
6. All tests must pass (0 failures) before marking any task complete.
