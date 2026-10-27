# Srijal Gupta Portfolio

A single-page React portfolio built with Vite and lightweight custom CSS. Project copy, education, skills, hackathons, and profile links live in `src/data.js`. The supplied profile photo and resume are in `public/`; the site uses reduced-motion-aware scroll reveals, a reading-progress line, an interactive theme toggle, and a small rotating JavaScript editor preview in the hero.

## Run locally

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create and preview a production build:

```bash
npm run build
npm run preview
```

## Personalize

- Edit the portfolio content in `src/data.js`.
- Replace `public/resume.pdf` whenever you update your resume; the resume buttons already link to that path.
- Replace `public/srijal-gupta.jpg` to update your profile picture.
- Add GitHub and live demo URLs to each project's `github` and `demo` properties in `src/data.js`. Empty links stay hidden.
- The contact form opens the visitor's email app with a prefilled message. To collect submissions without relying on an email app, replace `sendMessage` in `src/main.jsx` with your Formspree endpoint.
- Update the page title and description in `index.html` before publishing.

## Deploy free on Vercel

1. Create a GitHub repository and push this project to it. Do not commit `node_modules` or `dist`.
2. Sign in to [Vercel](https://vercel.com/) and choose **Add New → Project**.
3. Import the GitHub repository and allow Vercel to detect Vite.
4. Confirm the settings: **Framework Preset: Vite**, **Build Command: `npm run build`**, **Output Directory: `dist`**. No environment variables are needed.
5. Choose **Deploy**. Vercel will build the page and provide a public `vercel.app` URL.
6. For later updates, push commits to the connected repository. Vercel will create a deployment automatically. Add a custom domain in the project settings if you have one.

## Five useful next improvements

1. Add real GitHub repositories and live demos to the project cards.
2. Replace project descriptions with concise notes on your role, implementation choices, and lessons learned.
3. Add original project screenshots with descriptive alt text once you have them.
4. Link a polished, current resume at `public/resume.pdf`.
5. Set up Formspree or another form endpoint if you want messages delivered without the visitor's email app.
