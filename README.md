# Lucky Kumar — MERN Stack Developer Portfolio

A full-stack portfolio with a React/Vite public website, protected admin dashboard, Express REST API, MongoDB/Mongoose content storage, and optional Cloudinary project-image uploads.

## Requirements

- Node.js 20.19+ (or 22.12+) and npm
- MongoDB locally or a MongoDB Atlas connection string
- Cloudinary account for image uploads (optional; projects can use a direct image URL)

## Setup

1. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`, a random `JWT_SECRET` of at least 32 characters, and the admin account values. Set Cloudinary credentials if uploads are needed.
2. Copy `frontend/.env.example` to `frontend/.env`. Change `VITE_API_URL` only if the API is not at `http://localhost:5000/api`.
3. Install dependencies from the repository root and both app folders:

   ```sh
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```

4. Create or update the administrator account (the command hashes `ADMIN_PASSWORD` with bcrypt):

   ```sh
   npm run seed:admin
   ```

5. Start frontend and backend together:

   ```sh
   npm run dev
   ```

   The website is at `http://localhost:5173`, and the API is at `http://localhost:5000`. Visit `/admin/login` to access the CMS.

For production, build the frontend using `npm run build`; serve `frontend/dist` using your chosen static host and run the backend with `npm start` from the root (or `npm start --prefix backend`). Configure `CLIENT_URL` to the deployed frontend origin(s), and set the environment variables in the hosting provider rather than committing `.env` files.

## API

| Method | Route | Access | Purpose |
|---|---|---|---|
| POST | `/api/admin/login` | Public, rate-limited | Issue a signed JWT |
| GET | `/api/admin/me` | Admin | Validate session |
| GET/POST | `/api/projects` | Public read / admin write | List published projects / create |
| GET/PATCH/DELETE | `/api/projects/:id` | Public read / admin write | Read, update, delete project |
| GET/POST | `/api/skills` | Public read / admin write | List published skills / create |
| GET/PATCH/DELETE | `/api/skills/:id` | Public read / admin write | Read, update, delete skill |
| GET/POST | `/api/services` | Public read / admin write | List published services / create |
| GET/PATCH/DELETE | `/api/services/:id` | Public read / admin write | Read, update, delete service |
| POST | `/api/contact` | Public, rate-limited | Save contact message |
| GET | `/api/contact` | Admin | List messages |
| PATCH/DELETE | `/api/contact/:id` | Admin | Mark read/unread or delete message |
| POST | `/api/upload` | Admin | Upload one image (multipart field `image`, max 5 MB) |
| GET | `/api/health` | Public | API health check |

Include `Authorization: Bearer <token>` for admin APIs. Public project, skill, and service reads only return published records. Admins are provisioned with the seed script; there is no public registration endpoint.

## Content management

Add/edit/delete projects and upload images at `/admin/projects`. Manage skills and services at their dashboard sections. Contact form messages are saved to MongoDB and can be marked read or deleted under Messages. Public pages fetch their content from the API; no portfolio project, skill, or service records are seeded or hardcoded.

## Validation notes

Run `npm run build` at the repository root for the frontend production build. Live API integration requires a reachable MongoDB instance, and upload testing additionally requires Cloudinary credentials. Never commit `.env` files or use the example admin password in production.
