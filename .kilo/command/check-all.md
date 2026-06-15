---
description: Run lint, typecheck, and build sequentially
agent: code-reviewer
---
Run all quality checks in sequence:
1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`
