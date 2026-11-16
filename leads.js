// Painel: lista leads (GET) e atualiza status/observações (PATCH). Exige a senha do painel.
export default async function handler(req, res) {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass || req.headers["x-admin-password"] !== pass) return res.status(401).json({ error: "senha inválida" });
  const base = process.env.SUPABASE_URL + "/rest/v1/leads";
  const h = { apikey: process.env.SUPABASE_SERVICE_KEY, Authorization: "Bearer " + process.env.SUPABASE_SERVICE_KEY, "Content-Type": "application/json" };
  if (req.method === "GET") {
    const r = await fetch(base + "?select=*&order=created_at.desc&limit=1000", { headers: h });
    return res.status(r.ok ? 200 : 502).json(r.ok ? await r.json() : { error: "falha ao consultar" });
  }
  if (req.method === "PATCH") {
    let b = req.body; if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = {}; } }
    if (!/^[0-9a-f-]{36}$/.test(String((b || {}).id))) return res.status(400).json({ error: "id inválido" });
    const upd = {};
    if (typeof b.status === "string") upd.status = b.status.slice(0, 40);
    if (typeof b.notas === "string") upd.notas = b.notas.slice(0, 2000);
    const r = await fetch(base + "?id=eq." + b.id, { method: "PATCH", headers: h, body: JSON.stringify(upd) });
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  }
  return res.status(405).json({ error: "método não permitido" });
}
