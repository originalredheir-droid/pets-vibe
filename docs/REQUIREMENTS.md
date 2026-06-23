# PetVibe — Requirements (MVP)

## Purpose
Define the functional and non-functional requirements for the PetVibe MVP so development stays focused and measurable.

## Scope (MVP)
- User sign-up and sign-in (email + Google)
- Create and manage owner profile
- Create and manage pet profiles (name, species, breed, age, photos, short vibe description)
- Discovery feed: browse nearby pet cards filtered by location
- Like / swipe → mutual match detection
- Contact options modal after match showing only user-approved contact methods (WhatsApp, Instagram, Telegram, email, profile link)
- Basic trust & safety: user reporting and simple vaccination verification upload (manual review)

## Functional requirements
1. Authentication
   - Users can sign up with email or sign in using Google OAuth.
   - Auth state persisted in session.
2. Profiles
   - Owner profile with display name, city, optional bio.
   - Pet profile with required fields and up to 3 photos.
3. Discovery Feed
   - Feed shows image cards for pets in the same city (or short radius).
   - Cards show pet name, species, age, tag, and short vibe.
4. Matching
   - Owner can like a pet. If both owners like each other's pets, a match is created.
   - On match, display a `Contact options` modal listing the matched user's chosen contact methods (if they opted to share on match).
5. Contact privacy
   - Contacts are never displayed before a match and mutual consent where applicable.
   - Users can set preferred contact methods and opt-in for each.
6. Reporting & Blocking
   - Users can report or block other users/pets.
7. Admin
   - Admin can view reports and user profiles for manual moderation.

## Non-functional requirements
- Performance: initial P95 page load <1s on local network; use edge caching for media.
- Scalability: design DB for many profiles; start with Supabase free-tier-friendly schema.
- Security: store contact info securely; do not leak phone numbers pre-match.
- Privacy: explicit consent must be required before revealing personal contact details.

## Acceptance criteria (MVP)
- A user can sign up, create a pet, see other pets, like, and match.
- On match, contact options appear per privacy rules.
- Admin user can view reports.

## Metrics to track
- Sign-up conversion rate
- Match rate (likes → matches)
- Time-to-first-match
- Reports per 1,000 users

## Open questions / deferred
- In-app messaging (deferred to Phase 2)
- Masked-phone relay (defer to when usage requires it)
- Video reels (deferred)
