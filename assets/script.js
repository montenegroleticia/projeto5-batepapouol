const usuario = [];
// Painel lateral
function aparecerPainelLateral(){
    const painel = document.querySelector("aside");
    painel.classList.remove("esconder");
    setInterval(buscarParticipantes, 1000);
}
function esconderPainelLateral(){
    const painel = document.querySelector("aside");
    painel.classList.add("esconder");
}
// Login
function entrar(){
    const input = document.querySelector("#usuario");
    const name = {name: (nome = input.value)};
    usuario.push(name);
    if (nome !== ''){
        const login = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", name);
        login.then(entrarNoChat);
        login.catch(naoEntrou);
    }
}
function entrarNoChat(){
    const logado = document.querySelector("section");
    logado.classList.add("esconder");
    setInterval(buscarMensagens, 1000);
    setInterval(manterConectado, 5000);
}
function naoEntrou(erro){
    const statusCode = erro.response.status;
    if (statusCode === 400){
        alert("Nome em uso, digite outro nome");
    }
}
// Manter conectado
function manterConectado(){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuario[0]);
} 
// Carregar as mensagens
function buscarMensagens(){
    const promese = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promese.then(carregarMensagens);
}
function carregarMensagens(resposta){
    const mensagens = document.querySelector(".mensagens");
    mensagens.innerHTML = "";
    for (let contador = 0; contador < resposta.data.length; contador++){
        const tipo = resposta.data[contador].type;
        const tempo = resposta.data[contador].time;
        const de = resposta.data[contador].from;
        const texto = resposta.data[contador].text;
        const para = resposta.data[contador].to;

        if (tipo === "private_message" && (para === usuario[0].name || de === usuario[0].name)){
            const li = `
            <li class="${tipo}" data-test="message">
               <p>${tempo}<strong> ${de} </strong>para<strong> ${para}: </strong>${texto}</p>
            </li>
            `;
            mensagens.innerHTML += li;
        } else if (tipo === "message"){
            const li = `
            <li class="${tipo}" data-test="message">
                <p>${tempo}<strong> ${de} </strong>para<strong> ${para}: </strong>${texto}</p>
            </li>
            `;
            mensagens.innerHTML += li;
        } else if (tipo === "status"){
            const li = `
            <li class="${tipo}" data-test="message">
                <p>${tempo}<strong> ${de} </strong>${texto}</p>
            </li>
            `;
            mensagens.innerHTML += li;
        }
    }
    mensagens.querySelector('li:last-child').scrollIntoView();
}
// Enviar mensagens
document.addEventListener('keypress', function(e){
    if(e.which == 13){
        enviarMensagem();
    }
}, false); // enviar com o botão enter --> confuso pesquisar mais tarde
function enviarMensagem(){
    const mensagem = document.querySelector("#campo-enviar");
    const messageObjt = {from: usuario[0].name, to:'Todos', text: mensagem.value, type:'message'};
    const enviado  = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", messageObjt);
    enviado.catch(naoEnviadoMensagem);
}
function naoEnviadoMensagem(){
    window.location.reload();
}
// Carregar os participantes
function buscarParticipantes(){
    const promese = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promese.then(carregarParticipantes);
}
function carregarParticipantes(resposta){
    const participantes = document.querySelector(".contatos");
    participantes.innerHTML = '';
    for(let contador = 0; contador < resposta.data.length; contador++){
        const participante = resposta.data[contador].name;
        const li = `
    <li class="contato" data-test="participant">
        <ion-icon name="person-circle"></ion-icon>
        <p>${participante}</p>
    </li> `;
    participantes.innerHTML += li;
    }
}