# PetVibe — Architecture Overview

This document describes the high-level architecture for the PetVibe MVP.

## Goals
- Simple, low-cost, fast-to-iterate architecture
- Support for privacy-by-default contact sharing
- Clear separation between frontend, backend, and storage

## Components
1. Frontend (Next.js App)
   - App Router pages in `src/app`
   - Responsible for auth UI, profile and pet CRUD, discovery feed, and match UI
   - Deployed to Vercel as a PWA for fast edge delivery
2. Backend-as-a-Service (Supabase)
   - Auth (email + Google OAuth)
   - PostgreSQL database for core tables
   - Storage for pet images
   - Optional serverless functions (Edge Functions or Supabase Functions) for masked-phone relay later
3. Edge / CDN
   - Vercel/CDN for caching static assets and images
4. Optional Services
   - Analytics: Vercel Analytics or Plausible
   - Notifications: push/email (deferred)
   - Masked relays / phone proxy: Twilio (deferred)

## Data flow (high level)
- User signs up on the frontend → Supabase Auth issues session
- Frontend calls Supabase APIs to create `profiles` and `pets` rows
- Images uploaded to Supabase Storage; served via signed URLs or CDN
- Discovery feed queries `pets` filtered by location and shows results
- Likes insert into `likes` table; match created when reciprocal like exists; match triggers UI state change

## Deployment
- Frontend: Vercel (recommended) or any static hosting supporting Next.js App Router
- Database + Auth + Storage: Supabase (managed)

## Security and Privacy
- No phone numbers or direct contact stored in plaintext for public reading; only returned when allowed by privacy settings and after match
- Images are stored in Supabase Storage with access rules; public thumbnails for feed, higher-resolution signed URLs when viewing full profile

## Architecture diagram (text)

 [Browser] <---> [Next.js (Vercel edge)] <---> [Supabase Auth & Postgres]
                                     |--> [Supabase Storage (images)]
                                     |--> [Edge Functions / Serverless (optional)]

## Reasoning for choices
- Supabase reduces backend engineering overhead (auth, storage, DB) and fits a low-cost MVP
- Next.js gives PWA capabilities and is developer-friendly for rapid UI iteration

## Future additions (phase 2+)
- Edge functions for masked-phone relay / lightweight messaging
- Recommendation engine (ML) for better match quality
- Marketplace microservice for local partners
