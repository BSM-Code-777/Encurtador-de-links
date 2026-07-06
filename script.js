const formulario = document.querySelector("#formularioEncurtador");
const campoUrl = document.querySelector("#campoUrl");
const painelResultado = document.querySelector("#painelResultado");
const linkCurto = document.querySelector("#linkCurto");
const linkAbrir = document.querySelector("#linkAbrir");
const botaoCopiar = document.querySelector("#botaoCopiar");
const mensagemStatus = document.querySelector("#mensagemStatus");





const URL_BASE_WORKER = "https://encurtador-de-links-worker.bruno-maciel.workers.dev"; // endereço do Worker. // Em vez de escrever esse endereço várias vezes no código, guarda em uma variável.




formulario.addEventListener("submit", async (evento) => { // Ela significa: Quando o formulário for enviado... // addEventListener - Adicionar um ouvinte de eventos // async - significa que Dentro dessa função haverá operações demoradas, que precisa esperar a internet. // evento - Esse parâmetro guarda informações sobre o envio.
  
  evento.preventDefault(); // evento.preventDefault(); - sem ela ao clicar o formulario seria enviado e em seguida a pagina recarregaria sem poder visualizar o resultado // ele diz: nao faça o comportamento normal, Quem vai controlar tudo é o JavaScript.



  const urlOriginal = campoUrl.value.trim(); // campoUrl - representa o input // .value - pega o texto. // trim() - remove espaços antes e depois.
  const botaoEnviar = formulario.querySelector("button"); // procura o botão dentro do formulário.

  botaoEnviar.disabled = true; // Essa linha desativa o botão. // nao deixa que ele seja clicavel // impede que seja clicado varias vezes
  botaoEnviar.querySelector("span").textContent = "Gerando..."; // o javascript encontra esse span e troca o texto por "gerando..."
  mensagemStatus.textContent = "Criando link curto...";
  painelResultado.hidden = true;



  try {

    const resposta = await fetch(`${URL_BASE_WORKER}/api/shorten`, { // fetch() - é uma função do JavaScript usada para fazer requisições para um servidor. // await - Espera a resposta chegar antes de continuar. Sem ele, o JavaScript continuaria executando as próximas linhas antes do Worker responder  // o java script junta essas duas partes e o navegador chama exatamente essa parte do Worker.
                       
      method: "POST", // significa - Quero enviar uma informação. // nesse caso enviando uma url
      headers: { // são os cabeçalhos da requisição. // Eles dizem ao servidor como interpretar os dados.
        "Content-Type": "application/json", // significa: O conteúdo que estou enviando está em formato JSON.
      },
      body: JSON.stringify({ url: urlOriginal }), // Essa parte envia a URL. // transforma um objeto em texto JSON.
    });



    const dados = await resposta.json(); // o corpo da resposta que o Worker enviou e transforme esse JSON em um objeto JavaScript."



    if (!resposta.ok) { // Essa linha verifica se a requisição deu certo. // O símbolo ! significa: Negação. inverte um valor booleano.
      throw new Error(dados.error || "Nao foi possivel encurtar a URL."); // throw - ele para a execução normal e vai direto para o catch.
    }



    linkCurto.textContent = dados.linkCurto; // altera o texto que aparece dentro do elemento.
    linkCurto.href = dados.linkCurto; // href - endereço para onde o navegador vai quando alguém clica.
    linkAbrir.href = dados.linkCurto;
    painelResultado.hidden = false; // hidden - sigmifica esconda esse elemento // nesse caso nao e pra esconder
    botaoCopiar.textContent = "Copiar";
    mensagemStatus.textContent = "Link curto criado com sucesso.";

  } catch (erro) { // Esse bloco só será executado quando acontecer algum erro.

    mensagemStatus.textContent = erro.message;

  } finally { // significa: Execute isso sempre. // nao importando se deu certo ou erro

    botaoEnviar.disabled = false; // reativa o botão.
    botaoEnviar.querySelector("span").textContent = "Encurtar";

  }
});





botaoCopiar.addEventListener("click", async () => { // Adiciona um evento ao botão para que, quando o usuário clicar nele, uma função seja executada.

  await navigator.clipboard.writeText(linkCurto.textContent); // Copia o texto do link curto para a área de transferência do computador. // navigator - Representa o navegador (Chrome, Edge, Firefox etc.). // clipboard - Representa a área de transferência (onde ficam os dados copiados com Ctrl + C). // writeText() - Escreve um texto na área de transferência.
  botaoCopiar.textContent = "Copiado";

});
