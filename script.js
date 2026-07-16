import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const WHATSAPP = "5583987807909";
const produtosEl = document.getElementById("produtos");
const buscaEl = document.getElementById("busca");
const categoriaEl = document.getElementById("categoria");

const url = window.SUPABASE_URL;
const key = window.SUPABASE_ANON_KEY;

const supabase = createClient(url, key);
let produtos = [];

async function carregarProdutos() {
  const { data, error } = await supabase
    .from("armações")
    .select("*")
    .eq("ativo", true)
    .order("criado_em", { ascending: false });

  if (error) {
    console.error("Erro ao carregar armações:", error);
    produtosEl.innerHTML =
      "<p>Não foi possível carregar as armações agora.</p>";
    return;
  }

  produtos = data || [];
  renderizar();
}

function renderizar() {
  const termo = (buscaEl?.value || "").toLowerCase();
  const categoriaSelecionada = categoriaEl?.value || "Todos";

  const filtrados = produtos.filter((produto) => {
    const categoria =
      produto.categoria || produto.timpano || produto.marca || "";

    const texto =
      `${produto.nome || ""} ${produto.descrição || ""} ${categoria}`
        .toLowerCase();

    return (
      texto.includes(termo) &&
      (categoriaSelecionada === "Todos" ||
        categoria === categoriaSelecionada)
    );
  });

  if (!filtrados.length) {
    produtosEl.innerHTML = "<p>Nenhuma armação encontrada.</p>";
    return;
  }

  produtosEl.innerHTML = filtrados
    .map((produto) => {
      const mensagem = encodeURIComponent(
        `Olá, tenho interesse na armação ${
          produto.nome || "do catálogo"
        } da Ótica 083.`
      );

      const link = `https://wa.me/${WHATSAPP}?text=${mensagem}`;

      const imagem = produto.imagem
        ? `<img src="${produto.imagem}" alt="${produto.nome || "Armação"}">`
        : `<span>Ótica 083</span>`;

      return `
        <article class="produto">
          <div class="produto-img">${imagem}</div>
          ${produto.destaque ? '<span class="badge">Destaque</span>' : ""}
          <h3>${produto.nome || "Armação Ótica 083"}</h3>
          <p>${produto.descrição || ""}</p>
          <strong class="preco">
            ${produto.preço ? `R$ ${produto.preço}` : "Consulte"}
          </strong>
          <a href="${link}" target="_blank">
            Consultar no WhatsApp
          </a>
        </article>
      `;
    })
    .join("");
}

buscaEl?.addEventListener("input", renderizar);
categoriaEl?.addEventListener("change", renderizar);

carregarProdutos();
