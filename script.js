const input = document.querySelector("#usernameInput");
const button = document.querySelector("#searchBtn");

const message = document.querySelector("#message");
const result = document.querySelector("#result");

const avatar = document.querySelector("#avatar");
const nameEl = document.querySelector("#name");
const bioEl = document.querySelector("#bio");
const reposEl = document.querySelector("#repos");
const profileLink = document.querySelector("#profileLink");


function setMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "crimson" : "#333";
}

function showResult(show) {
  if (show) result.classList.remove("hidden");
  else result.classList.add("hidden");
}


async function fetchGitHubUser(username) {

  setMessage("Carregando...");
  showResult(false);

  try {
    const url = `https://api.github.com/users/${username}`;
    const response = await fetch(url);

 
    if (response.status === 404) {
      setMessage("Usuário não encontrado (404).", true);
      return;
    }


    if (!response.ok) {
      setMessage(`Erro na requisição: ${response.status}`, true);
      return;
    }


    const data = await response.json();


    avatar.src = data.avatar_url;
    avatar.alt = `Foto de ${data.login}`;

    nameEl.textContent = data.name ? data.name : data.login;


    bioEl.textContent = data.bio ? data.bio : "Sem bio disponível.";

    reposEl.textContent = data.public_repos;

    profileLink.href = data.html_url;
    profileLink.textContent = "Ver perfil no GitHub";

    setMessage(""); 
    showResult(true); 
  } catch (error) {

    setMessage("Erro de rede. Tente novamente.", true);
  }
}


button.addEventListener("click", () => {
  const username = input.value.trim();

  if (!username) {
    setMessage("Digite um username antes de buscar.", true);
    showResult(false);
    return;
  }

  fetchGitHubUser(username);
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    button.click();
  }
});
