# Author Blog

A lightweight author-focused blog app built with React, Vite, and React Router. It lets authors create accounts, write and manage posts, publish drafts, and interact with comments on their content.

## Features

- Author sign up and log in
- Protected dashboard for signed-in authors
- Create, edit, view, and delete blog posts
- Publish or unpublish posts from the dashboard
- Comments on posts with edit/delete permissions for the author who wrote them
- Client-side routing and authenticated access control

## Tech stack

- React 19
- Vite
- React Router DOM
- ESLint

## Project structure

- `src/App.jsx` — route setup and protected access
- `src/pages/` — dashboard, auth, editor, post view, and 404 pages
- `src/components/` — shared UI for layout, forms, and comments
- `src/context/` — auth context/provider
- `src/api/client.js` — API wrapper and token handling
- `src/utils/` — date and ownership helpers

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the local Vite URL printed in the terminal (typically `http://localhost:5173`).

## Environment configuration

The app expects a backend API at `VITE_API_URL`.

- Default behavior: `/api`
- Example override:

  ```bash
  VITE_API_URL=https://your-api.example.com
  ```

This repo already includes a production value for deployment:

```env
VITE_API_URL=https://blogs-8po6.onrender.com
```

## Available scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Notes

- Auth tokens are stored in `localStorage` under the `blog_token` key.
- The app uses protected routes so only authenticated authors can access post management screens.
- Draft posts are saved and can be published later from the dashboard.

## License

This project is currently configured as a private app and does not include a license file.
