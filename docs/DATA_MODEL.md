# PetVibe — Data Model & Database Schema

This document defines the canonical data model, table relations, constraints, and example SQL for the PetVibe MVP using PostgreSQL (Supabase).

Purpose
- Provide an authoritative reference for developers and AI agents to avoid schema drift.
- Include SQL-ready DDL and notes on indexes, uniqueness, and privacy-sensitive fields.

ER Summary (high level)
- `profiles` 1 — * N `pets`
- `pets` N — * `likes` (from_pet -> to_pet)
- `pets` N — * `matches` (pairing table)
- `profiles` 1 — * `reports`
- `matches` 1 — * `contact_requests`

## Tables and DDL

-- profiles: owner accounts
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid UNIQUE NOT NULL,
  display_name text NOT NULL,
  city text,
  bio text,
  contact_methods jsonb DEFAULT '{}'::jsonb,
  handles jsonb DEFAULT '{}'::jsonb,
  share_on_match boolean DEFAULT false,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_profiles_city ON profiles(city);
```

Notes:
- `auth_id` maps to Supabase Auth user ID.
- `contact_methods` example: {"whatsapp": true, "instagram": false, "telegram": true, "email": false}
- `handles` example: {"instagram":"insta_handle","telegram":"@tg","whatsapp_number":null,"email":null}

-- pets: pet profiles
```sql
CREATE TABLE pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  species text NOT NULL,
  breed text,
  age_text text,
  vibe_description text,
  photo_urls jsonb DEFAULT '[]'::jsonb,
  location text,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_pets_profile ON pets(profile_id);
CREATE INDEX idx_pets_location ON pets(location);
```

-- likes: directed like actions
```sql
CREATE TABLE likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  to_pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(from_pet_id, to_pet_id)
);
CREATE INDEX idx_likes_from ON likes(from_pet_id);
CREATE INDEX idx_likes_to ON likes(to_pet_id);
```

-- matches: created when reciprocal likes exist
```sql
CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_a_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  pet_b_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'active',
  UNIQUE (LEAST(pet_a_id, pet_b_id), GREATEST(pet_a_id, pet_b_id))
);
CREATE INDEX idx_matches_pet ON matches(pet_a_id);
CREATE INDEX idx_matches_pet_b ON matches(pet_b_id);
```

Notes:
- Use the LEAST/GREATEST uniqueness trick to keep one match row per unordered pair.

-- reports: user reports for moderation
```sql
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  target_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  target_pet_id uuid REFERENCES pets(id) ON DELETE SET NULL,
  reason text,
  details text,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_reports_target ON reports(target_profile_id);
```

-- contact_requests: request/approve flow for phone sharing
```sql
CREATE TABLE contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  responder_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  match_id uuid REFERENCES matches(id) ON DELETE SET NULL,
  message text,
  status text DEFAULT 'pending', -- pending, approved, denied
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_contact_requests_responder ON contact_requests(responder_profile_id);
```

-- audit_logs (optional)
```sql
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_profile_id uuid,
  action text,
  resource jsonb,
  created_at timestamptz DEFAULT now()
);
```

## Relations & Access patterns
- Discovery feed: query `pets` by `location` and join to `profiles` to get public owner info. Select only public pet fields and exclude `handles` and `contact_methods`.
- Like flow: insert into `likes`; on insert, check for reciprocal like (query `likes` where from=to_pet and to=from_pet). If exists, insert `matches` row using normalized pair ordering.
- Match -> contact modal: on match, query `profiles.handles` and `contact_methods` for the matched `profile`; return only fields where the matched profile enabled a method and `share_on_match` is true (or after explicit approval flow).

## Constraints & privacy
- Never return `handles.whatsapp_number` in feed queries. Return only on match and only if `contact_methods.whatsapp` is true and `share_on_match` is true (or if responder approved a contact request).
- Consider encrypting `handles` column at rest in production or storing sensitive fields in a separate encrypted table.

## Indexing & performance
- Indexes suggested above (city, profile, likes, matches) are tuned for small-scale MVP. For geo-based queries, later add PostGIS/geography columns and spatial indexes.
- Use pagination (limit/offset or cursor) for feeds.

## Sample queries
- Find pets in a city:
```sql
SELECT p.id, p.name, p.species, p.photo_urls, p.tags, pr.display_name, pr.city
FROM pets p
JOIN profiles pr ON p.profile_id = pr.id
WHERE p.location = 'Bhopal'
ORDER BY p.created_at DESC
LIMIT 24;
```

- Create match when reciprocal like exists (pseudo):
```sql
-- after inserting like (from A -> B):
WITH reciprocal AS (
  SELECT id FROM likes WHERE from_pet_id = :to_pet AND to_pet_id = :from_pet
)
INSERT INTO matches (pet_a_id, pet_b_id)
SELECT LEAST(:from_pet, :to_pet), GREATEST(:from_pet, :to_pet)
WHERE EXISTS (SELECT 1 FROM reciprocal)
ON CONFLICT DO NOTHING;
```

## Migration and seeds
- Keep migrations idempotent and small.
- Seed a few sample `profiles` and `pets` to test discovery UX.

## Versioning and frequent updates
- Put schema migrations in `supabase/migrations/` or `db/migrations/` and update `docs/DATA_MODEL.md` on each migration.
- Add a small section at the top of this file with the `schema_version` and `last_updated` timestamp whenever you change tables.

```md
schema_version: 2026-06-23-v1
last_updated: 2026-06-23
```

## Next steps I can do for you
- Generate SQL migration files in `db/migrations/` matching the DDL above.
- Create seed data SQL.
- Wire Supabase client and a small admin script to apply migrations.


