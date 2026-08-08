# AGENTS.md

User-management app ("Sistema para app") — two npm projects that must both run:

- `backend/` — Node.js Express 5 + MySQL API (CommonJS, no build step)
- `frontend/` — Angular 22 app (standalone components, no NgModules)

Code, comments, and commit messages are in Spanish — match that convention.

## Backend (`backend/`)

- Run with `npm start` (node `index.js`), default port `3000`.
- **Requires `backend/.env`** (gitignored): `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`. Without it the DB pool fails on startup. Copy `backend/.env.example` and fill the values. No commit-worthy secrets live in the repo.
- **Schema lives in `backend/schema.sql`** (tables `usuarios` and `clientes`, matching the real MySQL structure). A clone must run it against MySQL and set `DB_NAME` (currently `SA`). `CREATE DATABASE` requires privileges; the tables themselves are `IF NOT EXISTS`.
- Routes mounted in `index.js`: `/api/auth` (register, login), `/api/usuarios`, `/api/clientes`, and `/api` (forgot-password, reset-password/:token).
- JWT middleware `verificarToken` lives in `middleware/verificar-token.js` and is imported by `routes/usuarios.js` and `routes/clientes.js`. There is no fallback secret: it uses `process.env.JWT_SECRET` directly (login too in `routes/auth.js`), so `.env` must provide it.
- No tests (`npm test` just echoes an error).

## Frontend (`frontend/`)

- `npm start` (ng serve → http://localhost:4200), `npm run build`, `npm test` (Vitest via the `@angular/build:unit-test` builder).
- **There is no lint script** — `npm run lint` doesn't exist. Prettier is configured (`.prettierrc`: printWidth 100, singleQuote) but nothing runs it.
- All services hardcode `http://localhost:3000` as the API base — the backend must be running, and there's no env-based API URL.
- Auth: JWT stored in localStorage (`token`, `usuario` keys). `interceptors/auth.interceptor.ts` adds the Bearer header, but `clientes.service.ts` and `usuarios.service.ts` also set headers manually (duplicated).
- `guards/auth.guard.ts` is wired via `canActivate` on the `dashboard` and `users` routes in `app.routes.ts`. The `login` and `reset-password/:token` routes are unguarded.
- Known failing test: `app.spec.ts` expects `<h1>Hello, frontend</h1>`, but `app.html` is just `<router-outlet>`. Don't "fix" it by editing app.html.
- Component filenames are inconsistent: some use `.component.*` (login, dashboard, users, reset-password), others plain `.ts/.html/.css` (agregar-*-modal, eliminar-*). Check the folder before assuming a filename.
