# Theory Buddy

A personal Western music theory and vocal technique tutor, built for a Hindustani classical musician who also plays harmonica. It ships with a seeded 12-module curriculum, generates lessons on demand with Claude, finds matching YouTube videos via web search, and lets you ask Claude any music question — it answers and then files the answer into the right spot in your curriculum.

## Stack

- **Vite + React 18** for the frontend
- **Tailwind CSS** for styling
- **Vercel serverless function** (`api/claude.js`) that proxies requests to the Anthropic API, keeping the API key server-side
- **localStorage** for persisting curriculum progress and question history (no backend database)

## Project structure

```
api/claude.js     Vercel serverless function — proxies POST /api/claude to Anthropic's Messages API
src/App.jsx        Main app: curriculum state, lesson view, Ask Buddy chat, markdown renderer
src/index.css      Tailwind entrypoint + font import
vercel.json        SPA + API routing rewrites for Vercel
```

## Local development

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
vercel dev                   # runs both the Vite app and the /api functions locally
```

`npm run dev` alone will start Vite but **not** the `/api/claude` function — use `vercel dev` if you need working API calls locally.

## Environment variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key, used only by `api/claude.js` server-side. Never exposed to the client. |

Set it locally in `.env.local`, and in Vercel via:

```bash
vercel env add ANTHROPIC_API_KEY
```

## Deployment

The app is deployed on Vercel and connected to GitHub for auto-deploy on push to `master`:

```bash
git push origin master
```

To deploy manually:

```bash
vercel --prod
```

## Notes

- Progress, generated lessons, and question history are stored in the browser's `localStorage` — clearing site data resets everything (the in-app "Reset curriculum" button does this intentionally).
- The "Find videos" feature uses Anthropic's `web_search` server tool (`web_search_20260209`) — no special headers required.
- Ask Buddy filters out non-music meta-commands (e.g. "clear chat") so they aren't filed as curriculum lessons.
