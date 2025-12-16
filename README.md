# YouTube Keyword Analyzer

Vite + React + TypeScript single-page app that surfaces quick insights for a YouTube search term. Enter a keyword and your YouTube Data API v3 key to fetch top results, compute simple volume/competition scores, suggest related keywords, and list the top videos with basic stats.

## Features
- Keyword input panel with API key field and one-click analyze action
- Volume and competition scores derived from search results
- Related keyword suggestions pulled from video titles
- Top video table showing title, channel, published date, views, likes, and thumbnail
- Dark/light theme toggle with preference persisted to localStorage
- Graceful fallback to mock data when the API fails (keeps the UI demoable)

## Getting Started
### Prerequisites
- Node.js 18+ and npm or Yarn
- YouTube Data API v3 key

### Install
```bash
yarn install
```
(You can use `npm install` if you prefer.)

### Run Dev Server
```bash
yarn dev
```
Then open the printed local URL (Vite defaults to http://localhost:5173).

### Build & Preview
```bash
yarn build
yarn preview
```

## How to Use
1) Start the dev server.  
2) In the sidebar, paste your YouTube Data API key and enter a keyword.  
3) Click **Analyze**. The app fetches search results, derives metrics, and shows summary cards plus a detailed table.  
4) If the API call fails or no key is provided, the app auto-loads mock data so you can still see the UI flow.

## Configuration Notes
- Environment files are ignored (`.env`, `.env.*`). The app reads the API key from the input field rather than from an env variable.
- Debug logging: `src/services/youtubeApi.ts` posts a lightweight log to `http://127.0.0.1:7242/...` when `analyzeKeyword` starts. If that endpoint is absent, the request is silently ignored.

## Tech Stack
- React 18, TypeScript, Vite
- Vanilla CSS (see `src/index.css` for layout and theming)

## Scripts
- `yarn dev` — run locally
- `yarn build` — production build
- `yarn preview` — preview the production build locally
- `yarn lint` — type-check via `tsc --noEmit`

## Repository
- GitHub: https://github.com/dasom222g/learn-vibecoding

