const formulario = document.querySelector("#formularioEncurtador");
const campoUrl = document.querySelector("#campoUrl");
const painelResultado = document.querySelector("#painelResultado");
const linkCurto = document.querySelector("#linkCurto");
const linkAbrir = document.querySelector("#linkAbrir");
const botaoCopiar = document.querySelector("#botaoCopiar");
const mensagemStatus = document.querySelector("#mensagemStatus");

// Se o Worker estiver em outro dominio, coloque a URL dele aqui.
// Exemplo: const URL_BASE_WORKER = "https://meu-worker.seu-usuario.workers.dev";
const URL_BASE_WORKER = "";

formulario.addEventListener("submit", async (evento) => {
    
  evento.preventDefault();

  const urlOriginal = campoUrl.value.trim();
  const botaoEnviar = formulario.querySelector("button");

  botaoEnviar.disabled = true;
  botaoEnviar.querySelector("span").textContent = "Gerando...";
  mensagemStatus.textContent = "Criando link curto...";
  painelResultado.hidden = true;

  try {
    const resposta = await fetch(`${URL_BASE_WORKER}/api/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: urlOriginal }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.error || "Nao foi possivel encurtar a URL.");
    }

    linkCurto.textContent = dados.linkCurto;
    linkCurto.href = dados.linkCurto;
    linkAbrir.href = dados.linkCurto;
    painelResultado.hidden = false;
    botaoCopiar.textContent = "Copiar";
    mensagemStatus.textContent = "Link curto criado com sucesso.";
  } catch (erro) {
    mensagemStatus.textContent = erro.message;
  } finally {
    botaoEnviar.disabled = false;
    botaoEnviar.querySelector("span").textContent = "Encurtar";
  }
});

botaoCopiar.addEventListener("click", async () => {
  await navigator.clipboard.writeText(linkCurto.textContent);
  botaoCopiar.textContent = "Copiado";
});
