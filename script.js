// 1) Pegamos os elementos do HTML
const input = document.querySelector("#usernameInput");
const button = document.querySelector("#searchBtn");

const message = document.querySelector("#message");
const result = document.querySelector("#result");

const avatar = document.querySelector("#avatar");
const nameEl = document.querySelector("#name");
const bioEl = document.querySelector("#bio");
const reposEl = document.querySelector("#repos");
const profileLink = document.querySelector("#profileLink");

// 2) Função utilitária para mostrar mensagens
function setMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "crimson" : "#333";
}

// 3) Função utilitária para esconder/mostrar o card
function showResult(show) {
  if (show) result.classList.remove("hidden");
  else result.classList.add("hidden");
}

// 4) Função principal: busca o usuário na API do GitHub
async function fetchGitHubUser(username) {
  // Limpamos estado anterior
  setMessage("Carregando...");
  showResult(false);

  try {
    const url = `https://api.github.com/users/${username}`;
    const response = await fetch(url);

    // AQUI entra o tratamento do 404
    if (response.status === 404) {
      setMessage("Usuário não encontrado (404).", true);
      return;
    }

    // Se não for OK (ex: 403 rate limit, 500 etc.)
    if (!response.ok) {
      setMessage(`Erro na requisição: ${response.status}`, true);
      return;
    }

    // Transformar resposta em JSON (objeto JS)
    const data = await response.json();

    // 5) Colocar os dados no DOM
    avatar.src = data.avatar_url;
    avatar.alt = `Foto de ${data.login}`;

    nameEl.textContent = data.name ? data.name : data.login;

    // bio pode ser null
    bioEl.textContent = data.bio ? data.bio : "Sem bio disponível.";

    reposEl.textContent = data.public_repos;

    profileLink.href = data.html_url;
    profileLink.textContent = "Ver perfil no GitHub";

    setMessage(""); // limpa mensagem
    showResult(true); // mostra o card
  } catch (error) {
    // Erros de rede, internet, etc.
    setMessage("Erro de rede. Tente novamente.", true);
  }
}

// 6) Clique no botão
button.addEventListener("click", () => {
  const username = input.value.trim();

  if (!username) {
    setMessage("Digite um username antes de buscar.", true);
    showResult(false);
    return;
  }

  fetchGitHubUser(username);
});

// (Opcional) Buscar apertando Enter
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    button.click();
  }
});
