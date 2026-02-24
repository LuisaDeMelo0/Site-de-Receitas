window.apiUrl = "http://localhost:3000/receitas";

function criarCard(receita) {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4";

    col.innerHTML = `
      <div class="card h-100 shadow-sm position-relative">
        <img src="${receita.imageUrl}" class="card-img-top" alt="${receita.title}">
        
        <button class="btnFav btn btn-light position-absolute top-0 end-0 m-2 rounded-circle" data-id="${receita.id}" title="Favoritar" style="z-index: 10;">
            <i class="fa-regular fa-heart icon-fav text-danger"></i>
        </button>

        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${receita.title}</h5>
          <p class="card-text mb-4">${receita.description}</p>

          <div class="mt-auto">
            <div class="text-center">
              <a href="detalhes.html?id=${receita.id}" class="btn btn-warning w-100">Ver Receita</a>
            </div>
          </div>
        </div>
      </div>
    `;
    return col;
}

function criarSlide(receita) {
    const slide = document.createElement("div");
    slide.className = "slide";

    slide.innerHTML = `
        <a href="detalhes.html?id=${receita.id}" class="text-decoration-none text-dark"> 
          <div class="card h-100 shadow-sm">
            <img src="${receita.imageUrl}" class="card-img-top" alt="${receita.title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${receita.title}</h5>
              <p class="card-text mb-4">${receita.description}</p>
            </div>
          </div>
        </a>
    `;
    return slide;
}

function renderizarReceitas(todasAsReceitas) {
    const populares = todasAsReceitas.filter(r => r.categoria === "Populares");
    const sobremesas = todasAsReceitas.filter(r => r.categoria === "Melhores Sobremesas");
    const vegetarianas = todasAsReceitas.filter(r => r.categoria === "Receitas Vegetarianas");

    const carouselInner = document.getElementById("carouselInner");
    const containerPopulares = document.getElementById("cardsPopulares");
    const containerSobremesas = document.getElementById("cardsSobremesas");
    const containerVegetarianas = document.getElementById("cardsVegetarianas");

    if (carouselInner) {
        carouselInner.innerHTML = '';
        const primeirasReceitas = [
            populares[0],
            sobremesas[0],
            vegetarianas[0],
        ].filter(r => r !== undefined);

        primeirasReceitas.forEach((r, i) => {
            const slide = document.createElement("div");
            slide.classList.add("carousel-item");
            if (i === 0) slide.classList.add("active");

            slide.innerHTML = `
                <a href="detalhes.html?id=${r.id}" class="text-decoration-none text-dark"> 
                  <img src="${r.imageUrl}" class="d-block w-100" alt="${r.title}">
                  <div class="carousel-caption d-none d-md-block">
                    <h5>${r.title}</h5>
                    <p>${r.description}</p>
                  </div>
                </a>
            `;
            carouselInner.appendChild(slide);
        });
    }

    if (containerPopulares) { containerPopulares.innerHTML = ''; populares.forEach(r => containerPopulares.appendChild(criarCard(r))); }
    if (containerSobremesas) { containerSobremesas.innerHTML = ''; sobremesas.forEach(r => containerSobremesas.appendChild(criarCard(r))); }
    if (containerVegetarianas) { containerVegetarianas.innerHTML = ''; vegetarianas.forEach(r => containerVegetarianas.appendChild(criarCard(r))); }
}

async function buscarReceitas() {
  try {
    const resposta = await fetch(apiUrl);
    const receitas = await resposta.json();
    if (document.getElementById("cardsPopulares")) {
      renderizarReceitas(receitas);
      configurarFavoritosHome();
    }
  } catch (error) {
    console.error("ERRO:", error);
  }
}

function usuarioAdmin() {
    return localStorage.getItem("isAdmin") === "true";
}

async function excluirReceitaAPI(id) {
    if (!usuarioAdmin()) {
        alert("Apenas administradores podem excluir receitas!");
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:3000/receitas/${id}`, {
            method: 'DELETE'
        });

        if (resposta.ok) {
            alert("Receita excluída com sucesso!");
            window.location.href = "index.html";
        } else {
            alert("Falha ao excluir a receita no servidor.");
        }
    } catch (error) {
        alert("Erro de rede ao excluir.");
    }
}

function atualizarBotaoExcluir(receitaId) {
    const botoesAcao = document.getElementById("botoes-acao");
    if (!botoesAcao) return;

    const btnExistente = document.getElementById("btnExcluir");
    if (btnExistente) btnExistente.remove();

    if (localStorage.getItem("isAdmin") === "true") {
        const btnExcluir = document.createElement("button");
        btnExcluir.id = "btnExcluir";
        btnExcluir.className = "btn btn-danger";
        btnExcluir.innerHTML = '<i class="fa-solid fa-trash"></i> Excluir Receita';
        btnExcluir.onclick = () => window.confirmarExclusao(receitaId);
        botoesAcao.appendChild(btnExcluir);
    }
}

function confirmarExclusao(idReceita) {
    if (!confirm("Tem certeza que deseja excluir esta receita?")) return;

    fetch(`${DETAIL_API_URL}/${idReceita}`, {
        method: "DELETE"
    })
    .then(response => {
        alert("Receita excluída com sucesso!");
        window.location.href = "index.html";
    })
    .catch(() => alert("Não foi possível excluir a receita."));
}

async function preencherFormulario(id) {
    try {
        const resposta = await fetch(`${apiUrl}/${id}`);
        const receita = await resposta.json();
        
        document.getElementById('formTitle').textContent = `Editar Receita: ${receita.title}`;
        document.getElementById('submitButton').textContent = 'Atualizar Receita';
        
        document.getElementById('title').value = receita.title || '';
        document.getElementById('description').value = receita.description || '';
        document.getElementById('imageUrl').value = receita.imageUrl || '';
        document.getElementById('tempo').value = receita.tempo || '';
        document.getElementById('porcoes').value = receita.porcoes || '';
        document.getElementById('categoria').value = receita.categoria || '';
        document.getElementById('ingredientes').value = receita.ingredientes || '';
        document.getElementById('modoPreparo').value = receita.modoPreparo || '';
        
    } catch (error) {
        alert("Não foi possível carregar a receita para edição.");
    }
}

async function salvarReceita(event) {
    event.preventDefault(); 

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const isEditing = id !== null;

    const receitaData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        imageUrl: document.getElementById('imageUrl').value,
        tempo: document.getElementById('tempo').value, 
        porcoes: document.getElementById('porcoes').value,
        categoria: document.getElementById('categoria').value,
        ingredientes: document.getElementById('ingredientes').value,
        modoPreparo: document.getElementById('modoPreparo').value
    };

    let method = isEditing ? 'PUT' : 'POST';
    let url = isEditing ? `${apiUrl}/${id}` : apiUrl;

    try {
        const resposta = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(receitaData)
        });

        alert(`Receita ${isEditing ? 'atualizada' : 'cadastrada'} com sucesso!`);
        window.location.href = 'index.html';

    } catch (error) {
        alert(`Erro ao salvar a receita`);
    }
}

const API_FAVORITOS = "http://localhost:3000/favoritos";

function getUsuario() {
  return JSON.parse(sessionStorage.getItem("usuarioCorrente"));
}

async function verificarFavorito(userId, receitaId) {
  const resp = await fetch(`${API_FAVORITOS}?userId=${userId}&receitaId=${receitaId}`);
  const data = await resp.json();
  return data.length > 0 ? data[0] : null;
}

async function favoritarReceita(receitaId, iconElement = null) {
  const usuario = getUsuario();
  if (!usuario) {
    alert("Você precisa estar logado para favoritar.");
    return;
  }

  const favoritoExistente = await verificarFavorito(usuario.id, receitaId);

  if (favoritoExistente) {
    const resp = await fetch(`${API_FAVORITOS}/${favoritoExistente.id}`, { method: "DELETE" });
    if (resp.ok && iconElement) {
      iconElement.classList.remove("fa-solid");
      iconElement.classList.add("fa-regular");
    }
    return;
  }

  const resp = await fetch(API_FAVORITOS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: usuario.id, receitaId })
  });

  if (resp.ok && iconElement) {
    iconElement.classList.remove("fa-regular");
    iconElement.classList.add("fa-solid");
  }
}

async function configurarFavoritosHome() {
    const usuario = getUsuario();
    const botoes = document.querySelectorAll(".btnFav");

    if (!usuario) {
        botoes.forEach(b => b.style.display = "none");
        return;
    }

    for (const btn of botoes) {
        btn.style.display = "";
        const receitaId = btn.getAttribute("data-id");
        const icon = btn.querySelector(".icon-fav");

        try {
            const fav = await verificarFavorito(usuario.id, receitaId);

            if (fav) {
                icon.classList.remove("fa-regular");
                icon.classList.add("fa-solid");
            } else {
                icon.classList.remove("fa-solid");
                icon.classList.add("fa-regular");
            }

            btn.onclick = async (e) => {
                e.preventDefault();
                await favoritarReceita(receitaId, icon);
            };
        } catch (err) {}
    }
}

function mostrarBotaoExcluir() {
    const btnExcluir = document.getElementById("btnExcluir");
    if (!btnExcluir) return;
    btnExcluir.style.display = usuarioAdmin() ? "block" : "none";
}

async function pesquisarReceitas() {
    const termo = document.getElementById("search-input").value.toLowerCase().trim();

    const carousel = document.getElementById("carouselReceitas");
    const titulos = document.querySelectorAll("main h2");
    const container = document.querySelector(".cards-container");

    const divResultados = document.getElementById("resultadosBusca");
    if (divResultados) divResultados.remove();

    if (termo === "") {
        if (carousel) carousel.style.display = "block";
        titulos.forEach(t => t.style.display = "block");
        const categorias = document.querySelectorAll(".categoria");
        categorias.forEach(c => c.style.display = "block");
        buscarReceitas();
        return;
    }

    try {
        const resposta = await fetch(apiUrl);
        const receitas = await resposta.json();

        const resultados = receitas.filter(r => 
            r.title.toLowerCase().includes(termo) ||
            r.description.toLowerCase().includes(termo)
        );

        if (carousel) carousel.style.display = "none";
        titulos.forEach(t => t.style.display = "none");
        const categorias = document.querySelectorAll(".categoria");
        categorias.forEach(c => c.style.display = "none");

        const divBusca = document.createElement("div");
        divBusca.id = "resultadosBusca";
        divBusca.className = "row g-4 mb-5";
        resultados.forEach(r => divBusca.appendChild(criarCard(r)));

        container.appendChild(divBusca);
        configurarFavoritosHome();
    } catch (error) {}
}

document.addEventListener("DOMContentLoaded", () => {
    const formBusca = document.getElementById("headerSearchForm");
    if (formBusca) {
        formBusca.addEventListener("submit", (e) => {
            e.preventDefault();
            pesquisarReceitas();
        });
    }

    const inputBusca = document.getElementById("search-input");
    if (inputBusca) {
        inputBusca.addEventListener("input", pesquisarReceitas);
    }
});

document.addEventListener("DOMContentLoaded", mostrarBotaoExcluir);

document.addEventListener("DOMContentLoaded", () => {    
    if (document.getElementById("cardsPopulares")) {
        buscarReceitas();
    }
    
    if (document.getElementById('formReceita')) {
        document.getElementById('formReceita').addEventListener('submit', salvarReceita);
        
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id) {
            preencherFormulario(id);
        }
    }

    if (document.getElementById("btnFavorito")) {
        configurarBotaoFavorito();
    }
});
