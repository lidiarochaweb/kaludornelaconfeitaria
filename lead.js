// Recebe um lead do site e grava no Supabase (chaves só no servidor).
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "método não permitido" });
  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = {}; } }
  b = b || {};
  const cut = (v, n) => String(v || "").trim().slice(0, n);
  const row = {
    nome: cut(b.nome, 120), whatsapp: cut(b.whatsapp, 30), email: cut(b.email, 160) || null,
    tipo: cut(b.tipo, 30) || "contato", detalhes: cut(b.detalhes, 2000), origem: cut(b.origem, 40) || "site",
    status: "Novo contato",
  };
  if (!row.nome || (!row.whatsapp && !row.email)) return res.status(400).json({ error: "dados insuficientes" });
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) return res.status(500).json({ error: "servidor não configurado" });
  const r = await fetch(process.env.SUPABASE_URL + "/rest/v1/leads", {
    method: "POST",
    headers: { apikey: process.env.SUPABASE_SERVICE_KEY, Authorization: "Bearer " + process.env.SUPABASE_SERVICE_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
  return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
}
