import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/**
 * GET /api/users/transactions
 * Minden user + hozzatartozo tranzakciok + kategoriak (goals nelkul)
 */
app.get("/api/users/transactions", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
      id,
      nev,
      email,
      transactions (
        id,
        datum,
        osszeg,
        tipus,
        akt_osszpenz,
        categories (
          id,
          kat_nev
        )
      )
    `
    )
    .order("id", { ascending: true })
    .order("datum", { foreignTable: "transactions", ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

/**
 * GET /api/users/:id/transactions
 * Egy user + tranzakcioi + kategoriak
 */
app.get("/api/users/:id/transactions", async (req, res) => {
  const userId = Number(req.params.id);

  const { data, error } = await supabase
    .from("users")
    .select(
      `
      id,
      nev,
      email,
      transactions (
        id,
        datum,
        osszeg,
        tipus,
        akt_osszpenz,
        categories ( id, kat_nev )
      )
    `
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "User not found" });
  return res.json(data);
});

app.get("/api/status", (req, res) => {
  res.json({
    app: "budget-tracker",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`));
