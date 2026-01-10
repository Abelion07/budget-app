# Budget App

[![status](https://img.shields.io/badge/status-active-success)](https://img.shields.io/)
[![node](https://img.shields.io/badge/node-18%2B-brightgreen)](https://nodejs.org/)
[![license](https://img.shields.io/badge/license-ISC-blue)](https://opensource.org/licenses/ISC)

Personal portfolio + product card in one place. Built for clear focus: ship fast, track money, stay on top.

## About
Hi, I build practical web apps with clean UI, simple flows, and reliable data.  
GitHub: https://github.com/Abelion07/

## Budget App (Product)
Minimal budget tracker with session-based auth and a Supabase-backed data layer.

### Highlights
- Quick login, fast client rendering
- Protected API routes with cookie sessions
- Supabase data access via server
- Clean UI with focused, distraction-free layout

## Tech Stack
- Frontend: Vanilla JS + CSS
- Backend: Node.js (Express)
- Database: Supabase (Postgres)
- Auth: Cookie sessions + Supabase OAuth

## Structure
```
.
├── api/                       # Client API helpers
├── components/                # UI components
├── render/                    # UI binding modules
├── store/                     # App state
├── server.js                  # Express API
├── supabaseClient.js          # Server Supabase client
├── supabaseBrowserClient.js   # Browser Supabase client (OAuth)
├── script.js                  # Client bootstrapping
├── style.css                  # Styles
└── index.html                 # Entry
```

## Local Setup
```
npm install
npm start
```

The API listens on `http://localhost:3001`.

## Environment
Create a `.env` in the project root:
```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

## Auth Flow (Short)
1) Login via email/password -> `/api/login`
2) Server sets `sid` cookie
3) Client uses `/api/me` to confirm session

## API Quick Check
```
curl https://<your-render-url>/api/status
```

Protected endpoints (need cookie):
```
GET /api/allcategories
GET /api/users/:id/transactions
POST /api/users/:id/transactions
PUT /api/users/:id/transactions/:transactionId
DELETE /api/users/:id/transactions/:transactionId
```

## Deployment Notes
Github Pages + Render setup:
- Frontend: Github Pages
- Backend: Render


## License

© 2026 Ábel Csukás. All rights reserved.
No part of this project may be copied, distributed, or used without the prior written permission of the author.
