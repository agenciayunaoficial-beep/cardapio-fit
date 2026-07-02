/* ===================================================================
   MACEIÓ DETOX — admin.js
   Painel 100% no navegador (sem servidor). Edita os dados em memória
   e gera um novo arquivo data/menu.js para você reenviar por FTP.
=================================================================== */

(function () {
  // -------------------------------------------------------------
  // SENHA DO PAINEL — troque aqui quando quiser.
  // Isso é só uma barreira simples para afastar curiosos: como o site
  // é 100% estático, não existe autenticação real de servidor.
  // A segurança de verdade é o seu acesso FTP à hospedagem.
  // -------------------------------------------------------------
  const ADMIN_PASSWORD = "maceiodetox2026";

  const gate = document.getElementById("gate");
  const gateError = document.getElementById("gateError");
  const adminApp = document.getElementById("adminApp");

  document.getElementById("gateBtn").addEventListener("click", checkPassword);
  document.getElementById("gatePassword").addEventListener("keydown", e => {
    if (e.key === "Enter") checkPassword();
  });
  function checkPassword() {
    const val = document.getElementById("gatePassword").value;
    if (val === ADMIN_PASSWORD) {
      gate.style.display = "none";
      adminApp.style.display = "block";
      initAdmin();
    } else {
      gateError.textContent = "Senha incorreta.";
    }
  }

  // -------------------------------------------------------------
  // estado do painel (começa com o que veio de data/menu.js)
  // -------------------------------------------------------------
  let DATA = JSON.parse(JSON.stringify(window.MENU_DATA));
  let editingId = null;

  function initAdmin() {
    fillStoreForm();
    renderDishList();
    populateCategorySelect();

    document.getElementById("importFile").addEventListener("change", handleImport);
    document.getElementById("newDishBtn").addEventListener("click", () => openDishForm(null));
    document.getElementById("cancelDishBtn").addEventListener("click", closeDishForm);
    document.getElementById("saveDishBtn").addEventListener("click", saveDish);
    document.getElementById("fPhoto").addEventListener("change", handlePhotoUpload);
    document.getElementById("downloadBtn").addEventListener("click", downloadMenu);

    ["storeName", "storeSlogan", "storeWhatsapp", "storeAddress", "storeHours"].forEach(id => {
      document.getElementById(id).addEventListener("input", syncStoreForm);
    });
  }

  // -------------------------------------------------------------
  // importar um menu.js existente do computador
  // -------------------------------------------------------------
  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result;
        const jsonPart = text
          .replace(/^\s*window\.MENU_DATA\s*=\s*/, "")
          .replace(/;\s*$/, "");
        const parsed = JSON.parse(jsonPart);
        DATA = parsed;
        document.getElementById("importStatus").textContent = `Cardápio carregado de: ${file.name}`;
        fillStoreForm();
        renderDishList();
        populateCategorySelect();
      } catch (err) {
        alert("Não consegui ler esse arquivo. Confirme se é o data/menu.js original, sem edições que quebrem o formato.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  }

  // -------------------------------------------------------------
  // dados da loja
  // -------------------------------------------------------------
  function fillStoreForm() {
    document.getElementById("storeName").value = DATA.loja.nome || "";
    document.getElementById("storeSlogan").value = DATA.loja.slogan || "";
    document.getElementById("storeWhatsapp").value = DATA.loja.whatsapp || "";
    document.getElementById("storeAddress").value = DATA.loja["endereçoResumo"] || "";
    document.getElementById("storeHours").value = DATA.loja.horario || "";
  }
  function syncStoreForm() {
    DATA.loja.nome = document.getElementById("storeName").value;
    DATA.loja.slogan = document.getElementById("storeSlogan").value;
    DATA.loja.whatsapp = document.getElementById("storeWhatsapp").value.replace(/\D/g, "");
    DATA.loja["endereçoResumo"] = document.getElementById("storeAddress").value;
    DATA.loja.horario = document.getElementById("storeHours").value;
  }

  // -------------------------------------------------------------
  // lista de pratos
  // -------------------------------------------------------------
  function categoryName(id) {
    const cat = DATA.categorias.find(c => c.id === id);
    return cat ? cat.nome : id;
  }

  function renderDishList() {
    const list = document.getElementById("dishList");
    if (DATA.pratos.length === 0) {
      list.innerHTML = `<p style="color:var(--ink-soft);font-size:0.85rem;">Nenhum prato cadastrado ainda.</p>`;
      return;
    }
    list.innerHTML = DATA.pratos.map(dish => `
      <div class="dish-row">
        ${dish.foto
          ? `<img class="thumb-preview" src="${dish.foto}" alt="${dish.nome}">`
          : `<div class="thumb-preview" style="display:grid;place-items:center;color:var(--ink-soft);font-size:0.7rem;">sem foto</div>`}
        <div class="name">${dish.nome}</div>
        <div class="cat">${categoryName(dish.categoria)}</div>
        <div class="price">R$ ${Number(dish.preco).toFixed(2).replace(".", ",")}</div>
        <div></div>
        <div class="row-actions">
          <button data-action="edit" data-id="${dish.id}">Editar</button>
          <button class="danger" data-action="delete" data-id="${dish.id}">Remover</button>
        </div>
      </div>`).join("");

    list.querySelectorAll("[data-action]").forEach(btn => {
      const id = btn.dataset.id;
      btn.addEventListener("click", () => {
        if (btn.dataset.action === "edit") openDishForm(id);
        if (btn.dataset.action === "delete") deleteDish(id);
      });
    });
  }

  function deleteDish(id) {
    const dish = DATA.pratos.find(p => p.id === id);
    if (!confirm(`Remover "${dish.nome}" do cardápio?`)) return;
    DATA.pratos = DATA.pratos.filter(p => p.id !== id);
    renderDishList();
  }

  // -------------------------------------------------------------
  // formulário de prato (criar / editar)
  // -------------------------------------------------------------
  function populateCategorySelect() {
    const sel = document.getElementById("fCategory");
    sel.innerHTML = DATA.categorias.map(c => `<option value="${c.id}">${c.nome}</option>`).join("");
  }

  function openDishForm(id) {
    editingId = id;
    const section = document.getElementById("dishFormSection");
    section.style.display = "block";
    section.scrollIntoView({ behavior: "smooth" });

    if (id) {
      const dish = DATA.pratos.find(p => p.id === id);
      document.getElementById("dishFormTitle").textContent = "Editar prato";
      document.getElementById("fName").value = dish.nome;
      document.getElementById("fCategory").value = dish.categoria;
      document.getElementById("fDescription").value = dish.descricao;
      document.getElementById("fPrice").value = dish.preco;
      document.getElementById("fTags").value = (dish.tags || []).join(", ");
      showPhotoPreview(dish.foto);
    } else {
      document.getElementById("dishFormTitle").textContent = "Novo prato";
      document.getElementById("fName").value = "";
      document.getElementById("fCategory").selectedIndex = 0;
      document.getElementById("fDescription").value = "";
      document.getElementById("fPrice").value = "";
      document.getElementById("fTags").value = "";
      showPhotoPreview("");
    }
  }

  function closeDishForm() {
    document.getElementById("dishFormSection").style.display = "none";
    editingId = null;
  }

  function showPhotoPreview(base64) {
    const preview = document.getElementById("photoPreview");
    preview.innerHTML = base64 ? `<img src="${base64}" alt="Foto do prato">` : "Sem foto";
    preview.dataset.value = base64 || "";
  }

  function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 900 * 1024) {
      alert("Essa imagem é muito grande. Use uma foto de até ~900KB para o site carregar rápido.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => showPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  }

  function saveDish() {
    const name = document.getElementById("fName").value.trim();
    const price = parseFloat(document.getElementById("fPrice").value);

    if (!name) { alert("Digite o nome do prato."); return; }
    if (isNaN(price) || price <= 0) { alert("Digite um preço válido."); return; }

    const dishData = {
      id: editingId || "p" + Date.now(),
      categoria: document.getElementById("fCategory").value,
      nome: name,
      descricao: document.getElementById("fDescription").value.trim(),
      preco: price,
      foto: document.getElementById("photoPreview").dataset.value || "",
      tags: document.getElementById("fTags").value
        .split(",").map(t => t.trim()).filter(Boolean)
    };

    if (editingId) {
      const idx = DATA.pratos.findIndex(p => p.id === editingId);
      DATA.pratos[idx] = dishData;
    } else {
      DATA.pratos.push(dishData);
    }

    closeDishForm();
    renderDishList();
  }

  // -------------------------------------------------------------
  // baixar o menu.js atualizado
  // -------------------------------------------------------------
  function downloadMenu() {
    syncStoreForm();
    const content = "window.MENU_DATA = " + JSON.stringify(DATA, null, 2) + ";\n";
    const blob = new Blob([content], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "menu.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("Arquivo menu.js baixado! Agora envie ele por FTP para dentro da pasta /data do site, substituindo o arquivo antigo.");
  }
})();
