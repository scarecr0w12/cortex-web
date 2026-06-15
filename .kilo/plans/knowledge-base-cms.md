# Knowledge Base CMS — Implementation Plan

## Overview

Replace the file-based knowledge base (`content/knowledge-base/*.mdx`) with a database-driven CMS that admins can manage through the admin panel. Articles remain at the same URLs (`/docs/knowledge-base/<slug>`), rendered with the same Markdown pipeline.

---

## 1. Database Schema

Add `KnowledgeBaseArticle` model to `prisma/schema.prisma`:

```prisma
model KnowledgeBaseArticle {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String                        // Markdown content
  description String?                       // Short description for listing/index pages
  published   Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdBy   String?
  author      User?    @relation(fields: [createdBy], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("KnowledgeBaseArticle")
}
```

Run `npx prisma db push` to apply.

---

## 2. Shared Library

Create `src/lib/knowledge-base.ts` with functions:

```
getKbArticleBySlug(slug)
getAllKbArticles(publishedOnly?, page?, limit?, search?)
getKbArticleById(id)
getKbSlugs()
getKbStats()
```

Used by both the public docs page (SSR) and admin API routes.

---

## 3. API Routes

### Public API (`src/app/api/knowledge-base/`)

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/knowledge-base` | List published articles (for sidebar) |
| `GET` | `/api/knowledge-base/[slug]` | Get single article by slug |

### Admin API (`src/app/api/admin/knowledge-base/`)

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/admin/knowledge-base` | List all articles (paginated, searchable, includes unpublished) |
| `POST` | `/api/admin/knowledge-base` | Create article (title, slug, content, description, published) |
| `GET` | `/api/admin/knowledge-base/[id]` | Get single article by ID |
| `PUT` | `/api/admin/knowledge-base/[id]` | Update article |
| `DELETE` | `/api/admin/knowledge-base/[id]` | Delete article |

All admin routes use `getAuthUser` + `requireAdmin` from `@/lib/auth-middleware`. All mutations log to `AuditLog` via `createAuditLog()`.

Zod schemas for validation on POST/PUT.

---

## 4. Frontend Rendering Changes

### `src/app/docs/[[...slug]]/page.tsx`

When `params.slug[0] === "knowledge-base"`:
- Read article from `getKbArticleBySlug(fileSlug)` instead of `getContentBySlug("knowledge-base", fileSlug)`
- For the index page (`/docs/knowledge-base`): render a list of all published articles from DB instead of the static `content/knowledge-base/index.mdx`
- Keep all other sections (cli, architecture, developer-guide, design-docs) unchanged — they still read from filesystem

### `src/components/layout/Sidebar.tsx`

Replace the hardcoded "Knowledge Base" section links with a dynamic fetch from `/api/knowledge-base`. Use `useEffect` + `useState` to fetch the list on mount. Show a loading skeleton while fetching.

**Consideration**: Since the sidebar is a client component, fetching on mount is acceptable. The public API returns published articles sorted by `sortOrder`.

### `src/components/docs/DocSearch.tsx`

Update the Fuse.js search index to include knowledge base articles from the API (add a dynamic fetch or keep static for now — static search is fine since Fuse.js runs client-side).

### `src/app/sitemap.ts`

Replace `getContentSlugs("knowledge-base")` with `getKbSlugs()` which queries `prisma.knowledgeBaseArticle.findMany()`.

---

## 5. Admin UI

### `src/app/admin/knowledge-base/page.tsx`

Client component with:

**List View (default)**:
- Table/grid of all articles with columns: Title, Slug, Status (published/draft), Updated
- Search bar (searches title + content)
- Pagination (20 per page)
- Action buttons per row: Edit, Delete (with confirmation dialog)
- "New Article" button

**Create/Edit Form** (modal or inline panel):
- **Left pane**: Form fields
  - Title (input)
  - Slug (auto-generated from title, editable)
  - Description (textarea, optional)
  - Published (toggle/checkbox)
  - Sort Order (number input)
- **Right pane**: Markdown content editor (textarea, full height)
- **Bottom pane**: Markdown preview (rendered with `react-markdown` + `remark-gfm`, same as `MdxContent` component)

Split view layout: a resizable or flex-based 50/50 split between the markdown textarea and the rendered preview. The preview updates as the user types (useState). The form + editor layout uses the full admin content area width.

Form actions: Save (POST for create, PUT for update), Cancel

### `src/app/admin/layout.tsx`

Add nav item:
```ts
{ href: "/admin/knowledge-base", label: "Knowledge Base", icon: BookOpen },
```

Add `BookOpen` to lucide imports.

---

## 6. Migration Script

Create `scripts/migrate-knowledge-base.ts`:

```
tsx scripts/migrate-knowledge-base.ts
```

Logic:
1. Read all `.mdx` files from `content/knowledge-base/`
2. Parse frontmatter + content from each (reuse logic from `getContentBySlug`)
3. Insert into `KnowledgeBaseArticle` table via Prisma
   - Extract `title` from the first `# heading` in content
   - Use filename as `slug`
   - Set `description` from frontmatter or first paragraph
   - Set `published = true`
   - Set `sortOrder` based on a predefined order matching current sidebar
4. Skip if slug already exists
5. Log results

---

## 7. Data Flow Summary

```
Admin creates/edits article
  → Admin UI form (client)
    → POST/PUT /api/admin/knowledge-base
      → Prisma write to KnowledgeBaseArticle table
        → AuditLog entry

Visitor views /docs/knowledge-base/<slug>
  → Docs page (server component)
    → Direct Prisma query via getKbArticleBySlug(slug)
      → Renders with MdxContent (react-markdown)

Sidebar loads on any /docs or /getting-started page
  → Client fetch GET /api/knowledge-base
    → Renders KB section links dynamically
```

---

## 8. Files to Create

| File | Purpose |
|------|---------|
| `src/lib/knowledge-base.ts` | Shared DB query helpers |
| `src/app/api/knowledge-base/route.ts` | Public list endpoint |
| `src/app/api/knowledge-base/[slug]/route.ts` | Public single article endpoint |
| `src/app/api/admin/knowledge-base/route.ts` | Admin list + create |
| `src/app/api/admin/knowledge-base/[id]/route.ts` | Admin get/update/delete |
| `src/app/admin/knowledge-base/page.tsx` | Admin CRUD UI |
| `scripts/migrate-knowledge-base.ts` | Content migration script |

## 9. Files to Modify

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Add `KnowledgeBaseArticle` model |
| `src/app/docs/[[...slug]]/page.tsx` | Route KB section to DB instead of filesystem |
| `src/components/layout/Sidebar.tsx` | Dynamic KB links from API |
| `src/app/sitemap.ts` | KB slugs from DB |
| `src/app/admin/layout.tsx` | Add KB nav item |
| `src/components/docs/DocSearch.tsx` | Include KB articles in search index (optional, static fallback is fine) |

---

## 10. Edge Cases & Considerations

- **Slug conflicts**: Slug is unique in DB. Auto-generate from title, allow manual override. Validate no conflicts on create/update.
- **Draft articles**: Only `published = true` articles appear on the public site and sidebar. Admins see all in the admin panel.
- **Empty state**: If no KB articles exist yet, `/docs/knowledge-base` shows a fallback message.
- **Migration idempotency**: Script checks for existing slugs before inserting.
- **Existing MDX files**: After migration, the `content/knowledge-base/` directory can remain for reference but is no longer read by the app (the docs page routes KB through DB). The `sectionMap` in `sitemap.ts` is updated to query DB for KB slugs.
- **Audit logging**: All create/update/delete operations log to `AuditLog` with entity `"knowledge_base"`.
