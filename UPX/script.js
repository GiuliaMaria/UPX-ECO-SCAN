// ---------- Mostrar telas ----------
function mostrarTela(id) {
  document
    .querySelectorAll(".tela")
    .forEach((t) => t.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
  if (id === "recompensas") atualizarRecompensasView();
  if (id === "home") atualizarUsuarioHome();
}

// ---------- Cadastro ----------
function handleCadastro(event) {
  event.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const senha = document.getElementById("senha").value;

  if (!nome || !email || !senha) return alert("Preencha todos os campos");

  let usuarios = JSON.parse(localStorage.getItem("recicla_usuarios") || "{}");
  if (usuarios[email]) return alert("Email já cadastrado");

  usuarios[email] = { nome, senha };
  localStorage.setItem("recicla_usuarios", JSON.stringify(usuarios));
  localStorage.setItem("recicla_points_" + email, JSON.stringify(0));

  alert("Cadastro realizado! Faça login agora.");
  document.getElementById("cadastroForm").reset();
  mostrarTela("login");
}

// ---------- Login ----------
function handleLogin(event) {
  event.preventDefault();
  const email = document
    .getElementById("loginEmail")
    .value.trim()
    .toLowerCase();
  const senha = document.getElementById("loginSenha").value;

  let usuarios = JSON.parse(localStorage.getItem("recicla_usuarios") || "{}");
  if (!usuarios[email] || usuarios[email].senha !== senha) {
    return alert("Email ou senha inválidos");
  }

  localStorage.setItem("recicla_user", email);
  alert("Bem-vindo, " + usuarios[email].nome + "!");
  document.getElementById("loginForm").reset();
  mostrarTela("home");
  atualizarUsuarioHome();
}

// ---------- Logout ----------
function logout() {
  localStorage.removeItem("recicla_user");
  alert("Você saiu da conta.");
  mostrarTela("home");
  atualizarUsuarioHome();
}

// ---------- Atualizar usuário / recompensas ----------
function atualizarUsuarioHome() {
  const email = localStorage.getItem("recicla_user");
  const el = document.getElementById("usuarioLogado");
  if (!email) {
    el.textContent = "Não conectado";
    document.getElementById("recompensasTexto").innerHTML =
      "Você acumulou: <b>0 pontos</b>";
    return;
  }
  const usuarios = JSON.parse(localStorage.getItem("recicla_usuarios") || "{}");
  const pontos = JSON.parse(
    localStorage.getItem("recicla_points_" + email) || "0"
  );
  el.textContent =
    "Conectado como: " + (usuarios[email] ? usuarios[email].nome : email);
  document.getElementById(
    "recompensasTexto"
  ).innerHTML = `Você acumulou: <b>${pontos} pontos</b>`;
}

function atualizarRecompensasView() {
  const email = localStorage.getItem("recicla_user");
  const el = document.getElementById("recompensasTexto");
  if (!email) {
    el.innerHTML =
      "Você acumulou: <b>0 pontos</b><br/><small>Conecte-se para salvar pontos.</small>";
    document.getElementById("usuarioLogado").textContent = "Não conectado";
    return;
  }
  const usuarios = JSON.parse(localStorage.getItem("recicla_usuarios") || "{}");
  const pontos = JSON.parse(
    localStorage.getItem("recicla_points_" + email) || "0"
  );
  el.innerHTML = `Você acumulou: <b>${pontos} pontos</b>`;
  document.getElementById("usuarioLogado").textContent =
    "Conectado como: " + usuarios[email].nome;
}

// ---------- Curiosidades interativas ----------
const curiosidades = [
  "O Brasil recicla apenas cerca de 4% do lixo produzido.",
  "Uma garrafa PET pode levar até 400 anos para se decompor.",
  "Reciclar 1 tonelada de papel pode salvar até 20 árvores.",
  "A reciclagem de alumínio economiza até 95% da energia.",
];
let cardIndex = 0;

function mostrarCuriosidade(indice) {
  const lista = document.getElementById("curiosidadesLista");
  lista.innerHTML = `<li>${curiosidades[indice]}</li>`;
}

function proximaCuriosidade() {
  cardIndex = (cardIndex + 1) % curiosidades.length;
  mostrarCuriosidade(cardIndex);
}

// Inicializa curiosidade
document.addEventListener("DOMContentLoaded", () => {
  mostrarCuriosidade(0);
  atualizarUsuarioHome();
});

// ---------- Busca de pontos de coleta ----------
function buscarPontos() {
  const q = document.getElementById("buscarInput").value.trim();
  const query = q ? encodeURIComponent(q) : "pontos%20de%20coleta%20reciclagem";
  const src = `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  document.getElementById("mapIframe").src = src;

  // Exemplo de detalhe da rota (simulado)
  document.getElementById("detalhesRota").innerHTML = `
    <p><b>Ponto de Coleta:</b> ${q || "Centro de Reciclagem"}</p>
    <p><b>Horário:</b> 08:00 - 18:00</p>
    <p><b>Tipo de Resíduos:</b> Plástico, Vidro, Papel</p>
  `;
}

// ---------- Abrir rota com geolocalização ----------
function abrirRota() {
  if (!navigator.geolocation) {
    alert("Geolocalização não suportada.");
    return;
  }
  navigator.geolocation.getCurrentPosition((pos) => {
    const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
    const q =
      document.getElementById("buscarInput").value.trim() ||
      "pontos de coleta reciclagem";
    const destination = encodeURIComponent(q);
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    window.open(url, "_blank");
  });
}

// ---------- RA simples ----------
function iniciarCamera() {
  const video = document.getElementById("videoRA");
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => (video.srcObject = stream))
    .catch((err) => alert("Erro ao acessar a câmera: " + err));
}

function capturarItem() {
  const item = "Garrafa PET";
  const lixeira = "Amarela";
  document.getElementById("itemNome").textContent = item;
  document.querySelector(
    ".lixeira"
  ).textContent = `Lixeira correta: ${lixeira}`;
}

// ---------- Descarte correto ----------
function simularDescarteCorreto() {
  const email = localStorage.getItem("recicla_user");
  if (!email) {
    if (!confirm("Você não está conectado. Quer entrar agora?")) return;
    mostrarTela("login");
    return;
  }
  const key = "recicla_points_" + email;
  const atual = JSON.parse(localStorage.getItem(key) || "0");
  const ganho = 10;
  localStorage.setItem(key, JSON.stringify(atual + ganho));
  alert("Descarte registrado! Você ganhou " + ganho + " pontos.");
  checarBadges(atual + ganho);
  atualizarRecompensasView();
}

// ---------- Badges ----------
function checarBadges(pontos) {
  if (pontos >= 50) alert("🎉 Badge Bronze desbloqueado!");
  if (pontos >= 100) alert("🥈 Badge Prata desbloqueado!");
  if (pontos >= 200) alert("🥇 Badge Ouro desbloqueado!");
}

// ---------- Alternar entre itens no modo Escanear ----------
const itens = [
  {
    nome: "Garrafa PET",
    lixeira: "Amarela (Plástico)",
    img: "https://images.unsplash.com/photo-1616118132534-381148898bb4?auto=format&fit=crop&w=400&q=80",
  },
  {
    nome: "Garrafa de Vidro",
    lixeira: "Verde (Vidro)",
    img: "https://images.unsplash.com/photo-1608745167260-e15bc0e0521f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=736",
  },
  {
    nome: "Lata de Alumínio",
    lixeira: "Amarela (Metal)",
    img: "https://images.unsplash.com/photo-1701055941827-d7efef6bf37d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
  },
  {
    nome: "Caixa de Papelão",
    lixeira: "Azul (Papel)",
    img: "https://images.unsplash.com/photo-1656543802898-41c8c46683a7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171",
  },
];


let indiceItem = 0;

function novoItem() {
  indiceItem = (indiceItem + 1) % itens.length;
  const itemAtual = itens[indiceItem];
  document.getElementById("itemNome").textContent = itemAtual.nome;
  const lixeiraEl = document.querySelector(".lixeira");

  // Atualiza o texto
  lixeiraEl.textContent = `Lixeira correta: ${itemAtual.lixeira}`;

  // Remove classes antigas e adiciona a nova
  lixeiraEl.classList.remove("amarela", "verde", "azul");

  if (itemAtual.lixeira.includes("Amarela")) lixeiraEl.classList.add("amarela");
  else if (itemAtual.lixeira.includes("Verde")) lixeiraEl.classList.add("verde");
  else if (itemAtual.lixeira.includes("Azul")) lixeiraEl.classList.add("azul");

  // Atualiza imagem
  document.getElementById("itemImg").src = itemAtual.img;
}


