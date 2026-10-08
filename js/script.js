const modal = document.getElementById("pedidoModal");

const botoesAbrir = document.querySelectorAll(".abrir-pedido");
const botaoFechar = modal.querySelector(".pedido-modal-fechar");
const overlay = modal.querySelector(".pedido-modal-overlay");

const plataformas = modal.querySelectorAll(".pedido-plataforma");
const botoesVoltar = modal.querySelectorAll(".pedido-voltar");
const telas = modal.querySelectorAll(".pedido-tela");


function mostrarTela(nome) {
    telas.forEach(tela => {
        tela.classList.remove("ativa");
    });

    modal
        .querySelector(".pedido-tela-" + nome)
        .classList.add("ativa");
}


function abrirModal(event) {
    event.preventDefault();

    mostrarTela("plataforma");

    modal.classList.add("aberto");
    document.body.classList.add("modal-aberto");
}


function fecharModal() {
    modal.classList.remove("aberto");
    document.body.classList.remove("modal-aberto");
}


botoesAbrir.forEach(botao => {
    botao.addEventListener("click", abrirModal);
});


plataformas.forEach(botao => {
    botao.addEventListener("click", () => {
        const plataforma = botao.dataset.plataforma;

        mostrarTela(plataforma);
    });
});


botoesVoltar.forEach(botao => {
    botao.addEventListener("click", () => {
        mostrarTela("plataforma");
    });
});


botaoFechar.addEventListener("click", fecharModal);

overlay.addEventListener("click", fecharModal);


document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        fecharModal();
    }
});