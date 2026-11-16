# Site Kalu Dornela: como publicar e guardar os leads

## 1. Banco de dados (Supabase, plano gratuito)
Crie um projeto em supabase.com. No "SQL Editor", rode:

```sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  nome text, whatsapp text, email text, tipo text, detalhes text, origem text,
  status text default 'Novo contato', notas text
);
alter table leads enable row level security;
```
(Sem políticas: ninguém acessa pelo navegador; só o servidor, com a chave de serviço.)

## 2. Vercel
Suba esta pasta inteira para o GitHub (arraste os arquivos; não cole código) e importe o repositório na Vercel.
Em Settings > Environment Variables, crie:
- `SUPABASE_URL`: URL do projeto (Supabase > Project Settings > API)
- `SUPABASE_SERVICE_KEY`: chave "service_role" (nunca coloque no site)
- `ADMIN_PASSWORD`: uma senha forte, só da proprietária

Faça "Redeploy" depois de criar as variáveis.

## 3. Usar
- Site: `seudominio.vercel.app`
- Painel de leads: `seudominio.vercel.app/admin.html` (senha = ADMIN_PASSWORD)
- Cada formulário e o Assistente Kalu gravam o lead (nome, WhatsApp, e-mail, detalhes, origem) e abrem o WhatsApp com a mensagem pronta.
