# Smart Public Issue Reporting System (Mini Project)

Current status: Initial setup completed with internal actor login page.

## Tech
- Next.js 16
- React 19
- JavaScript (React JSX)
- Tailwind CSS
- Zod (request validation)

## Setup
```bash
npm install
copy .env.example .env.local
npm run dev
```

Open: `http://localhost:3000`

## Implemented in Step 1
- Role-based login page for:
  - Admin
  - Panchayath Secretary
  - Section Clerk / Engineer
- Login API endpoint: `POST /api/auth/login`
- Environment-driven demo credentials

## Demo Credentials
- Admin: `admin@panchayath.gov` / `Admin@123`
- Secretary: `secretary@panchayath.gov` / `Secretary@123`
- Engineer: `engineer@panchayath.gov` / `Engineer@123`

Update these in `.env.local` for local testing.

## Design Documentation
Full design and schema are available at:
- [docs/system-design.md](docs/system-design.md)

## Next Step Suggestion
Implement database models with Prisma (`users`, `roles`, `issues`, `issue_status_history`) and connect login to real user records.
