# User Profile & Registration System — Improvements

## Summary

Improve the existing registration, profile, and auth system:

1. Registration: add confirm password + better error display
2. Profile editing: settings page with bio/website/avatar + password change
3. Navbar: add logout to user dropdown
4. Public profile: show edit link when viewing own profile

---

## Tasks

### 1. Registration — confirm password (`src/app/register/page.tsx`)

- Add `confirmPassword` state
- Add confirm password input below password
- Validate passwords match client-side before submit
- Display "Passwords do not match" error when they differ

### 2. Profile Update API — `PUT /api/auth/me`

- New file: `src/app/api/auth/me/route.ts` (add PUT handler to existing file)
- Zod schema: `bio` (optional string, max 500), `website` (optional url), `avatar` (optional url)
- Require bearer token auth via `getUserFromToken`
- Update user record, return updated user
- Skip unchanged fields

### 3. Password Change API — `PUT /api/auth/password`

- New file: `src/app/api/auth/password/route.ts`
- Zod schema: `currentPassword`, `newPassword` (min 8)
- Verify current password with `verifyPassword`
- Hash and store new password
- Return success/error

### 4. Settings page — `src/app/dashboard/settings/page.tsx`

- "use client" page with two sections:
  - **Profile Info**: form to edit bio (textarea), website (url input), avatar (url input)
  - **Change Password**: current password, new password, confirm new password
- Fetch current user from AuthContext, pre-populate form
- Submit profile updates to `PUT /api/auth/me`
- Submit password change to `PUT /api/auth/password`
- On profile update, refresh user in AuthContext (re-fetch `/api/auth/me` and update localStorage)
- Success/error feedback per form

### 5. Dashboard — link to settings

- In `src/app/dashboard/page.tsx`, add an "Account Settings" link/button next to the sign out button

### 6. Navbar — logout button

- In `src/components/layout/Navbar.tsx`, add a "Sign Out" item in the user dropdown (between Profile and end of dropdown)
- Call `logout()` from useAuth, close dropdown

### 7. Profile page — edit link for own profile

- In `src/app/profile/[username]/page.tsx`, check if viewer is the profile owner
- This is a server component currently — the link can be added by reading auth cookies, OR we can create a client wrapper component
- **Approach**: create a small client component `ProfileActions` that checks AuthContext and renders an "Edit Profile" link pointing to `/dashboard/settings`

### 8. AuthContext — update user method

- Add `updateUser(user: AuthUser)` method to AuthContext
- Updates both state and localStorage

---

## Files to create

- `src/app/dashboard/settings/page.tsx` — settings/account page
- `src/app/api/auth/password/route.ts` — password change API
- `src/components/profile/ProfileActions.tsx` — client component for edit link on public profile

## Files to modify

- `src/app/register/page.tsx` — confirm password
- `src/app/api/auth/me/route.ts` — add PUT handler
- `src/app/dashboard/page.tsx` — link to settings
- `src/components/layout/Navbar.tsx` — logout in dropdown
- `src/lib/AuthContext.tsx` — add updateUser method
- `src/app/profile/[username]/page.tsx` — add ProfileActions component
