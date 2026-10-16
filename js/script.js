/* =========================
   POPUP DE PEDIDOS
========================= */

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


/* =========================
   APARECER AO ROLAR
========================= */

function iniciarRevelar() {
    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (semMovimento || !("IntersectionObserver" in window)) return;

    // Elementos que vão aparecer ao rolar
    const grupos = [
        ".secao-cabecalho",
        ".pizza-card",
        ".sobre-foto",
        ".sobre-titulo",
        ".sobre-texto",
        ".localizacao-conteudo > h2",
        ".loja-faixa",
        ".lojas-horario",
        ".lojas-instrucao"
    ];

    // Cards e lojas entram um depois do outro
    const emSequencia = [".pizza-card", ".loja-faixa"];

    grupos.forEach(seletor => {
        document.querySelectorAll(seletor).forEach((el, i) => {
            el.classList.add("revelar");

            if (emSequencia.includes(seletor)) {
                el.style.setProperty("--atraso", i * 120 + "ms");
            }
        });
    });

    document.documentElement.classList.add("revelar-ativo");

    const observador = new IntersectionObserver(entradas => {
        entradas.forEach(entrada => {
            if (!entrada.isIntersecting) return;

            entrada.target.classList.add("visivel");
            observador.unobserve(entrada.target);
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    });

    document.querySelectorAll(".revelar").forEach(el => {
        observador.observe(el);
    });
}

iniciarRevelar();