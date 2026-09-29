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
