import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

async function recalcUserTotals(userId) {
  const { data: allTx, error: allError } = await supabase
    .from("transactions")
    .select("id, user_id, datum, osszeg, tipus")
    .eq("user_id", userId)
    .order("datum", { ascending: true })
    .order("id", { ascending: true });

  if (allError) {
    return { error: allError };
  }

  let runningTotal = 0;
  for (const tx of allTx) {
    const delta = tx.tipus === "Bevétel" ? tx.osszeg : -tx.osszeg;
    runningTotal += delta;
    const { error: recalError } = await supabase
      .from("transactions")
      .update({ akt_osszpenz: runningTotal })
      .eq("id", tx.id)
      .eq("user_id", userId);
    if (recalError) {
      return { error: recalError };
    }
  }

  return { data: allTx };
}

/**
 * GET /api/users/transactions
 * Minden user + hozzatartozo tranzakciok + kategoriak (goals nelkul)
 */

app.get("/api/allcategories", async (req, res) => {
  const { data, error } = await supabase
    .from("categories")
    .select(`*`)
    .order("id", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

app.get("/api/users/transactions", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
      id,
      first_name,
      last_name,
      email,
      transactions (
        id,
        category_id,
        datum,
        osszeg,
        tipus,
        akt_osszpenz,
        categories (
          id,
          kat_nev,
          icons,
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

  if (!userId) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const { data, error } = await supabase
    .from("users")
    .select(
      `
      id,
      first_name,
      last_name,
      email,
      transactions (
        id,
        category_id,
        datum,
        osszeg,
        tipus,
        akt_osszpenz,
        categories ( id, kat_nev, icons )
      )
    `
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json(data);
});

/**
 * POST /api/users/:id/transactions
 * Új tranzakció mentése
 */
app.post("/api/users/:id/transactions", async (req, res) => {
  const userId = Number(req.params.id);
  const { type, amount, date, categoryId } = req.body ?? {};

  if (!userId) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const parsedAmount = Number(amount);
  const parsedCategoryId = Number(categoryId);
  const allowedTypes = new Set(["Bevétel", "Kiadás"]);

  if (
    !allowedTypes.has(type) ||
    !Number.isFinite(parsedAmount) ||
    parsedAmount <= 0 ||
    !parsedCategoryId ||
    !date
  ) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const { data: latest, error: latestError } = await supabase
    .from("transactions")
    .select("akt_osszpenz, datum, id")
    .eq("user_id", userId)
    .order("datum", { ascending: false })
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestError) {
    return res.status(500).json({ error: latestError.message });
  }

  const prevTotal = latest?.akt_osszpenz ?? 0;
  const delta = type === "Bevétel" ? parsedAmount : -parsedAmount;
  const nextTotal = prevTotal + delta;

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      category_id: parsedCategoryId,
      datum: date,
      osszeg: parsedAmount,
      tipus: type,
      akt_osszpenz: nextTotal,
    })
    .select("id, user_id, category_id, datum, osszeg, tipus, akt_osszpenz")
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(data);
});

/**
 * PUT /api/users/:id/transactions/:transactionId
 * Tranzakció frissítése + akt_osszpenz újraszámolás
 */
app.put("/api/users/:id/transactions/:transactionId", async (req, res) => {
  const userId = Number(req.params.id);
  const transactionId = Number(req.params.transactionId);
  const { type, amount, date, categoryId } = req.body ?? {};

  if (!userId || !transactionId) {
    return res.status(400).json({ error: "Invalid user id or transaction id" });
  }

  const parsedAmount = Number(amount);
  const parsedCategoryId = Number(categoryId);
  const allowedTypes = new Set(["Bevétel", "Kiadás"]);

  if (
    !allowedTypes.has(type) ||
    !Number.isFinite(parsedAmount) ||
    parsedAmount <= 0 ||
    !parsedCategoryId ||
    !date
  ) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const { data: updated, error: updateError } = await supabase
    .from("transactions")
    .update({
      category_id: parsedCategoryId,
      datum: date,
      osszeg: parsedAmount,
      tipus: type,
    })
    .eq("id", transactionId)
    .eq("user_id", userId)
    .select("id, user_id, category_id, datum, osszeg, tipus, akt_osszpenz")
    .single();

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }

  const { error: recalcError } = await recalcUserTotals(userId);
  if (recalcError) {
    return res.status(500).json({ error: recalcError.message });
  }

  return res.json(updated);
});

/**
 * DELETE /api/users/:id/transactions/:transactionId
 * Tranzakció törlése + akt_osszpenz újraszámolás
 */
app.delete("/api/users/:id/transactions/:transactionId", async (req, res) => {
  const userId = Number(req.params.id);
  const transactionId = Number(req.params.transactionId);

  if (!userId || !transactionId) {
    return res.status(400).json({ error: "Invalid user id or transaction id" });
  }

  const { data: deleted, error: delError } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transactionId)
    .eq("user_id", userId)
    .select("id, user_id")
    .maybeSingle();

  if (delError) {
    return res.status(500).json({ error: delError.message });
  }

  const { error: recalcError } = await recalcUserTotals(userId);
  if (recalcError) {
    return res.status(500).json({ error: recalcError.message });
  }

  return res.json({ ok: true, deleted });
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
