-- Execute este SQL no Supabase > SQL Editor
create table if not exists produtos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  nome text not null,
  categoria text not null,
  descricao text,
  preco text default 'Consulte',
  imagem_url text,
  destaque boolean default false,
  ativo boolean default true
);

alter table produtos enable row level security;

create policy "Produtos públicos podem ser vistos"
on produtos for select
using (ativo = true);

create policy "Usuários autenticados podem inserir produtos"
on produtos for insert
to authenticated
with check (true);

create policy "Usuários autenticados podem editar produtos"
on produtos for update
to authenticated
using (true)
with check (true);

-- Storage:
-- Crie um bucket público chamado: produtos
