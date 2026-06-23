# PetVibe — System Design (MVP)

This document contains concrete design details for the MVP: database schema, API patterns, and contact/privacy flow designs.

## Recommended schema (Supabase / Postgres)

- `profiles`
  - `id` (uuid, PK)
  - `auth_id` (uuid) — FK to Supabase auth
  - `display_name` (text)
  - `city` (text)
  - `bio` (text, nullable)
  - `contact_methods` (jsonb) — e.g. { "whatsapp": true, "instagram": false, "telegram": true, "email": false }
  - `handles` (jsonb) — e.g. { "instagram": "insta_handle", "telegram": "@tg", "whatsapp_number": null, "email": null }
  - `share_on_match` (boolean) — default false
  - `created_at`, `updated_at`

- `pets`
  - `id` (uuid, PK)
  - `profile_id` (uuid, FK -> profiles.id)
  - `name`, `species`, `breed`, `age`, `vibe_description`
  - `photo_urls` (jsonb array)
  - `location` (geography or text city)
  - `tags` (text[])
  - `created_at`, `updated_at`

- `likes`
  - `id` (uuid, PK)
  - `from_pet_id` (uuid)
  - `to_pet_id` (uuid)
  - `created_at`

- `matches`
  - `id` (uuid, PK)
  - `pet_a_id`, `pet_b_id` (uuid)
  - `created_at`
  - `status` (enum: active, resolved)

- `reports`
  - `id` (uuid)
  - `reporter_profile_id`
  - `target_profile_id`
  - `reason` (text)
  - `created_at`

## API patterns
- Use Supabase client directly from frontend for most actions (auth, simple CRUD, storage).
- Use server-side Edge Functions for:
  - Actions requiring secret keys (Twilio relay, admin moderation, email sending)
  - Masked-phone setup and rate-limiting

### Example endpoints (Edge Functions)
- `POST /api/request-contact` — user A requests contact with user B (creates a request row and optionally sends a notification)
- `POST /api/approve-contact` — user B approves a request and the system returns allowed contact handles or issues a masked relay
- `POST /api/report` — create a report for moderation

## Contact & privacy flow
1. Users set their `contact_methods` and `handles` in profile settings.
2. By default, `share_on_match` is false. Contacts are hidden even after a match unless the owner opts in.
3. On mutual match, show a `Contact options` modal with buttons for each method the matched user has enabled:
   - External handle: open Instagram/Telegram profile in new tab
   - Email: open mailto: link (if provided)
   - WhatsApp: open `https://wa.me/<number>` only if user allowed and number present
   - Request Phone: if phone not shared, send a contact request; the recipient sees a pending request and can approve to reveal or to use a masked relay
4. Masked relay (deferred): when implemented, backend issues ephemeral proxy numbers and short-living tokens to connect users without revealing real numbers

## Data privacy & security
- Ensure contact fields are not returned by public list queries (select only public pet fields for feeds).
- Store contact handles encrypted at rest where possible; limit access by roles.

## Frontend structure (recommended)
- `src/features/auth` — auth pages and hooks
- `src/features/profile` — owner profile and settings
- `src/features/pets` — pet profile CRUD
- `src/features/discovery` — feed and swipe UI
- `src/features/matches` — matches UI and contact modal
- `src/lib` — shared utilities and supabase client

## Moderation and admin
- Admin dashboard (protected via role claim in Supabase auth) to view reports and suspend accounts
- Keep an audit log for reported events

## Scaling considerations
- Use pagination and geo-indexing for discovery queries
- Cache images via CDN and use optimized thumbnails
- Move heavy logic (matching heuristics, recommendations) to edge functions when needed

## Testing
- Unit tests for UI components
- Integration tests for auth and CRUD flows (playwright or Cypress for end-to-end)


