document.addEventListener("DOMContentLoaded", () => {
  // ===== elementos principais =====
  const tabButtons = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll(".tab-content");

  // Forms
  const formProduto = document.getElementById("form-produto");
  const formEntrada = document.getElementById("form-entrada");
  const formSaida = document.getElementById("form-saida");
  const formCliente = document.getElementById("form-cliente");

  // Limpar tudo (opcional)
  const limparProdutosBtn = document.getElementById("limpar-produtos");
  const limparClientesBtn = document.getElementById("limpar-clientes");

  // ===== utilitárias localStorage =====
  const salvarDados = (chave, dados) => {
    localStorage.setItem(chave, JSON.stringify(dados));
  };

  const carregarDados = (chave) => {
    const raw = localStorage.getItem(chave);
    return raw ? JSON.parse(raw) : [];
  };

  // ===== abas =====
  function esconderAbas() {
    sections.forEach(s => s.classList.remove("active"));
    tabButtons.forEach(b => b.classList.remove("active"));
  }

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      esconderAbas();
      const target = btn.dataset.target;
      btn.classList.add("active");
      const sec = document.getElementById(target);
      if (sec) sec.classList.add("active");
      atualizarTabelas();
    });
  });


  // Produtos
  formProduto.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(formProduto);
    const produto = {
      id: Date.now(),
      nome: fd.get("nome").trim(),
      quantidade: Number(fd.get("quantidade")),
      codigo: fd.get("codigo").trim(),
      preco: Number(fd.get("preco"))
    };

    const lista = carregarDados("produtos");
    lista.push(produto);
    salvarDados("produtos", lista);

    formProduto.reset();
    alert("✅ Produto cadastrado!");
    atualizarTabelas();
  });

  // Limpar produtos (apaga todos)
  limparProdutosBtn.addEventListener("click", () => {
    if (confirm("Deseja realmente apagar TODOS os produtos salvos?")) {
      localStorage.removeItem("produtos");
      atualizarTabelas();
    }
  });

  // Entradas
  formEntrada.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(formEntrada);
    const entrada = {
      id: Date.now(),
      codigo: fd.get("codigo").trim(),
      quantidade: Number(fd.get("quantidade")),
      data: new Date().toLocaleString()
    };\

    const lista = carregarDados("entradas");
    lista.push(entrada);
    salvarDados("entradas", lista);

    formEntrada.reset();
    alert("📦 Entrada registrada!");
    atualizarTabelas();
  });

  // Saídas
  formSaida.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(formSaida);
    const saida = {
      id: Date.now(),
      codigo: fd.get("codigo").trim(),
      quantidade: Number(fd.get("quantidade")),
      preco: fd.get("preco") ? Number(fd.get("preco")) : null,
      data: new Date().toLocaleString()
    };

    const lista = carregarDados("saidas");
    lista.push(saida);
    salvarDados("saidas", lista);

    formSaida.reset();
    alert("📤 Saída registrada!");
    atualizarTabelas();
  });

  // Clientes
  formCliente.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(formCliente);
    const cliente = {
      id: Date.now(),
      nome: fd.get("nome").trim(),
      email: fd.get("email")?.trim() || "",
      telefone: fd.get("telefone")?.trim() || "",
      endereco: fd.get("endereco")?.trim() || ""
    };

    const lista = carregarDados("clientes");
    lista.push(cliente);
    salvarDados("clientes", lista);

    formCliente.reset();
    alert("✅ Cliente cadastrado!");
    atualizarTabelas();
  });

  limparClientesBtn.addEventListener("click", () => {
    if (confirm("Deseja apagar TODOS os clientes?")) {
      localStorage.removeItem("clientes");
      atualizarTabelas();
    }
  });

  // ===== criar tabela + botões de excluir =====
  function criarTabela(lista, colunas, containerId, keys) {
    // containerId é a seção onde a tabela será anexada
    const container = document.getElementById(containerId);
    if (!container) return;

    // remove tabela antiga
    const antiga = container.querySelector(".tabela-lista");
    if (antiga) antiga.remove();

    if (!lista || lista.length === 0) return;

    const table = document.createElement("table");
    table.className = "tabela-lista";

    const thead = document.createElement("thead");
    const trh = document.createElement("tr");
    colunas.forEach(c => {
      const th = document.createElement("th");
      th.textContent = c;
      trh.appendChild(th);
    });
    thExtra = document.createElement("th");
    thExtra.textContent = "Ações";
    trh.appendChild(thExtra);
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    lista.forEach(item => {
      const tr = document.createElement("tr");
      keys.forEach(k => {
        const td = document.createElement("td");
        td.textContent = item[k] !== undefined && item[k] !== null ? item[k] : "";
        tr.appendChild(td);
      });

      // ações
      const tdAcoes = document.createElement("td");
      // botão excluir
      const btnExcluir = document.createElement("button");
      btnExcluir.className = "btn-excluir";
      btnExcluir.textContent = "Excluir";
      btnExcluir.addEventListener("click", () => {
        if (confirm("Deseja excluir este registro?")) {
          excluirRegistro(containerId, item.id);
        }
      });
      tdAcoes.appendChild(btnExcluir);
      tr.appendChild(tdAcoes);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  }

  // excluir por id conforme a "chave" (containerId)
  function excluirRegistro(containerId, id) {
    let chave = null;
    if (containerId === "cadastro") chave = "produtos";
    else if (containerId === "entrada") chave = "entradas";
    else if (containerId === "saida") chave = "saidas";
    else if (containerId === "clientes") chave = "clientes";
    if (!chave) return;

    let lista = carregarDados(chave);
    lista = lista.filter(item => item.id !== id);
    salvarDados(chave, lista);
    atualizarTabelas();
  }

  // ===== atualizar todas as tabelas =====
  function atualizarTabelas() {
    // Produtos
    const produtos = carregarDados("produtos");
    criarTabela(
      produtos,
      ["Nome", "Quantidade", "Código", "Preço"],
      "cadastro",
      ["nome", "quantidade", "codigo", "preco"]
    );

    // Entradas
    const entradas = carregarDados("entradas");
    criarTabela(
      entradas,
      ["Código", "Quantidade", "Data"],
      "entrada",
      ["codigo", "quantidade", "data"]
    );

    // Saídas
    const saidas = carregarDados("saidas");
    criarTabela(
      saidas,
      ["Código", "Quantidade", "Preço", "Data"],
      "saida",
      ["codigo", "quantidade", "preco", "data"]
    );

    // Clientes
    const clientes = carregarDados("clientes");
    criarTabela(
      clientes,
      ["Nome", "E-mail", "Telefone", "Endereço"],
      "clientes",
      ["nome", "email", "telefone", "endereco"]
    );
  }

  // Inicializa UI
  atualizarTabelas();

  // Se quiser abrir uma aba específica via hash na URL
  const hash = window.location.hash.replace("#", "");
  if (hash) {
    const btn = [...tabButtons].find(b => b.dataset.target === hash);
    if (btn) btn.click();
  } else {
    // deixar a primeira aba ativa
    tabButtons[0].classList.add("active");
    sections[0].classList.add("active");
  }
});
