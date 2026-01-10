import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import { supabase } from "./supabaseClient.js";

dotenv.config();

const app = express();

// Render / reverse proxy mögött (HTTPS, secure cookie-k miatt hasznos)
app.set("trust proxy", 1);

/**
 * GitHub Pages + local dev origin engedélyezés
 * Állítsd be Renderen env-ben is:
 * FRONTEND_ORIGIN=https://<felhasznalo>.github.io
 * (és ha több kell, vesszővel: https://a.github.io,https://b.github.io)
 */
const DEFAULT_ALLOWED = ["http://localhost:5173", "http://localhost:5500"];

const envOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...DEFAULT_ALLOWED, ...envOrigins])];

app.use(
  cors({
    origin(origin, cb) {
      // pl. Postman / curl esetén origin lehet undefined
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());

// ---------- SESSION (memóriában) ----------
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const sessions = new Map();

function getCookie(req, name) {
  const raw = req.headers.cookie;
  if (!raw) return null;
  const parts = raw.split(";").map((item) => item.trim());
  for (const part of parts) {
    if (part.startsWith(`${name}=`)) {
      return decodeURIComponent(part.slice(name.length + 1));
    }
  }
  return null;
}

function getSession(req) {
  const sid = getCookie(req, "sid");
  if (!sid) return null;
  const session = sessions.get(sid);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(sid);
    return null;
  }
  return { sid, ...session };
}

// ✅ GitHub Pages (cross-site) miatt: SameSite=None + Secure kötelező
function setSessionCookie(res, sid) {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);

  // Render + GitHub Pages = HTTPS -> Secure ok
  res.setHeader(
    "Set-Cookie",
    `sid=${encodeURIComponent(
      sid
    )}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=None`
  );
}

function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    "sid=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=None"
  );
}

function requireSessionUser(req, res) {
  const session = getSession(req);
  if (!session) {
    res.status(401).json({ error: "Not authenticated" });
    return null;
  }
  return session;
}

// ----- a route-jaid innen mehetnek tovább változtatás nélkül -----

app.get("/api/status", (req, res) => {
  res.json({
    app: "budget-tracker",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));
