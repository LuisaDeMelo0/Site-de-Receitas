const JSON_SERVER_BASE_URL = 'http://localhost:3000';
const API_URL_USUARIOS = '/usuarios';
const HOME_URL = "index.html";
const LOGIN_URL = "login.html";
const CADASTRO_URL = "cadastro_usuario.html";

var usuarioCorrente = {};
var db_usuarios = [];

function displayMessage(message) {
    console.log(message);
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
        messageContainer.innerHTML = `<div class="alert alert-info alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        setTimeout(() => messageContainer.innerHTML = '', 5000);
    }
}

function generateUUID() {
    var d = new Date().getTime();
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    });
}

function initLoginApp() {
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioCorrenteJSON && usuarioCorrenteJSON !== '{}') {
        usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    } else {
        usuarioCorrente = {};
    }
    
    renderMenu();

    fetch(JSON_SERVER_BASE_URL + API_URL_USUARIOS)
        .then(response => {
            if (!response.ok) throw new Error(`Erro de rede: ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            db_usuarios = data;
        })
        .catch(error => {
            console.error('Erro ao ler usuários via API JSONServer:', error);
        });
}

function loginUser(login, senha) {
    if (db_usuarios.length === 0) {
        displayMessage("Aguardando carregamento da lista de usuários. Tente novamente.");
        return false;
    }

    const usuario = db_usuarios.find(u => u.login === login && u.senha === senha);

    if (usuario) {
        usuarioCorrente = {
            id: usuario.id,
            login: usuario.login,
            nome: usuario.nome,
            email: usuario.email,
            admin: usuario.admin || false
        };

        sessionStorage.setItem("usuarioCorrente", JSON.stringify(usuarioCorrente));
        localStorage.setItem("isAdmin", usuarioCorrente.admin ? "true" : "false");

        displayMessage(`Bem-vindo, ${usuarioCorrente.nome}!`);
        window.location.href = HOME_URL;
        return true;
    } else {
        displayMessage("Login ou senha inválidos.");
        return false;
    }
}

function logoutUser() {
    usuarioCorrente = {};
    sessionStorage.removeItem('usuarioCorrente');
    displayMessage("Sessão encerrada com sucesso.");
    window.location.href = HOME_URL; 
}

function addUser(nome, login, senha, email) {
    if (db_usuarios.some(u => u.login === login)) {
        displayMessage("Erro: O login informado já está em uso.");
        return;
    }

    let newId = generateUUID();
    let usuario = { 
        id: newId, 
        login: login, 
        senha: senha, 
        nome: nome, 
        email: email,
        admin: false
    };

    fetch(JSON_SERVER_BASE_URL + API_URL_USUARIOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(usuario),
    })
    .then(response => {
        if (!response.ok) throw new Error('Falha ao registrar usuário no servidor.');
        return response.json();
    })
    .then(data => {
        db_usuarios.push(usuario);
        displayMessage("Usuário cadastrado com sucesso! Faça login para continuar.");
        window.location.href = LOGIN_URL;
    })
    .catch(error => {
        console.error('Erro ao inserir usuário via API JSONServer:', error);
        displayMessage("Erro ao cadastrar usuário.");
    });
}

function renderMenu() {
    const navRight = document.getElementById('nav-auth');
    if (!navRight) return;

    const isUserLoggedIn = usuarioCorrente.id && usuarioCorrente.id.length > 0;
    const isAdmin = usuarioCorrente.admin === true;
    let authLinks = '';

    const staticNav = document.getElementById('main-nav');
    if (staticNav) {
        let dynamicLinks = '';

        if (isUserLoggedIn) {
            dynamicLinks += `<a class="nav-link px-2 text-danger fw-bold" href="favoritos.html">
                <i class="fa-solid fa-heart"></i> MEUS FAVORITOS
            </a>`;
        }

        if (isAdmin) {
            dynamicLinks += `<a class="nav-link px-2 text-success fw-bold" href="cadastro.html">
                <i class="fa-solid fa-plus-circle"></i> CADASTRO DE ITENS
            </a>`;
        }
        
        staticNav.innerHTML += dynamicLinks;
    }

    if (isUserLoggedIn) {
        authLinks = `
            <span class="d-flex align-items-center me-3 text-white">
                <i class="fa-solid fa-user-circle me-1"></i> Olá, ${usuarioCorrente.nome.split(' ')[0]}
            </span>
            <button class="btn btn-danger" onclick="logoutUser()">
                <i class="fa-solid fa-sign-out"></i> LOGOUT
            </button>
        `;
    } else {
        authLinks = `
            <a href="${LOGIN_URL}" class="btn btn-outline-light me-2">
                <i class="fa-solid fa-sign-in"></i> LOGIN
            </a>
            <a href="${CADASTRO_URL}" class="btn btn-success">
                <i class="fa-solid fa-user-plus"></i> CADASTRO
            </a>
        `;
    }

    navRight.innerHTML = authLinks;
}

document.addEventListener('DOMContentLoaded', initLoginApp);
