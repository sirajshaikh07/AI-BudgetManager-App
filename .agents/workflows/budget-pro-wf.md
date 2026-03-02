---
description: Implement a new Budget Pro feature end-to-end (API + Mobile screen)
---

1. Ask the user: "Which feature and which phase does it belong to?"
2. Read `docs/BudgetPro_ProductionDoc.docx` for the relevant API endpoints 
   and DB schema for this feature.
3. Create an artifact plan at `artifacts/plan_[feature-name].md` with:
   - DB migration needed (if any)
   - NestJS module/service/controller to create
   - React Native screen/component to create
   - Test cases to write
4. Wait for user approval on the plan artifact.
5. Run DB migration first: `cd apps/api && pnpm migration:run`
6. Implement NestJS: module → entity → DTO → service → controller (in order)
7. Write unit tests for the service layer
8. Implement the React Native screen referencing `docs/ui-prototype.html` 
   for design
9. Run `pnpm typecheck` and `pnpm test` — fix all errors
10. Show a summary of all files created/modified