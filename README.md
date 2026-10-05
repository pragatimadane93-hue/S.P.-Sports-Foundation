# S.P. Sports Foundation, Kolhapur

React + Vite website. No backend, no paid services.

## Run locally
1. Install Node.js (v18 or newer) from https://nodejs.org
2. In this folder run:
   npm install
   npm run dev
3. Open the address shown (usually http://localhost:5173)

## Update content
- Academy details, programs, contacts: top of `src/App.jsx`
- Gallery photos: put images in `public/gallery/` and add them to the `GALLERY` list in `src/App.jsx`
- Colors and fonts: top of `src/index.css`

## Deploy free (GitHub + Vercel)
1. Create a GitHub repo and upload this folder (everything except node_modules).
2. Go to https://vercel.com, sign in with GitHub, click "Add New > Project", pick the repo.
3. Vercel detects Vite automatically. Click Deploy.


## Phase 1: Database, Registration & Student Login
This project now includes a real (free) database via Supabase, student registration,
and student login. See **SETUP.md** for the full setup steps — you must create a free
Supabase project and add its keys before registration/login will work.

Without completing SETUP.md, the Admission, Student Login and Latest Updates pages will
show a message that the database isn't connected yet (the rest of the site works as before).
