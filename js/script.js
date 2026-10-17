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
        ".pizzas-lista",
        ".sobre-foto",
        ".sobre-titulo",
        ".sobre-texto",
        ".localizacao-conteudo > h2",
        ".loja-faixa",
        ".lojas-instrucao"
    ];

    // Cards e lojas entram um depois do outro
    const emSequencia = [".loja-faixa"];

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



/* =========================
   CARROSSEL DE PIZZAS
   O card do meio fica em destaque; os outros ficam dos lados.
========================= */

const carrossel = document.querySelector(".carrossel");

if (carrossel) {
    const lista = carrossel.querySelector(".pizzas-lista");
    const cards = [...lista.children];
    const total = cards.length;

    const botaoAnterior = carrossel.querySelector(".carrossel-anterior");
    const botaoProximo = carrossel.querySelector(".carrossel-proximo");
    const pontosArea = carrossel.querySelector(".carrossel-pontos");
    const aviso = carrossel.querySelector("[aria-live]");

    let ativo = 0;

    // Distância de cada card até o do meio, dando a volta (loop infinito)
    function distancia(i) {
        let d = i - ativo;

        if (d > total / 2) d -= total;
        if (d < -total / 2) d += total;

        return d;
    }

    // Pontinhos
    const pontos = cards.map((card, i) => {
        const ponto = document.createElement("button");
        const nome = card.querySelector("h3").textContent;

        ponto.type = "button";
        ponto.className = "carrossel-ponto";
        ponto.setAttribute("aria-label", "Ver " + nome);
        ponto.addEventListener("click", () => irPara(i));

        pontosArea.appendChild(ponto);
        return ponto;
    });

    function atualizar(primeiraVez) {
        cards.forEach((card, i) => {
            const d = distancia(i);
            const novaPos = Math.abs(d) <= 2 ? String(d) : "fora";
            const posAntiga = card.dataset.pos;

            // Card que "dá a volta" pula sem atravessar a tela
            const pulo = posAntiga && posAntiga !== "fora" && novaPos !== "fora"
                && Math.abs(Number(novaPos) - Number(posAntiga)) > 2;

            card.classList.toggle("sem-transicao", Boolean(primeiraVez || pulo));
            card.dataset.pos = novaPos;
            card.setAttribute("aria-hidden", d !== 0);
        });

        pontos.forEach((ponto, i) => {
            ponto.setAttribute("aria-current", i === ativo);
        });

        if (!primeiraVez) {
            const nome = cards[ativo].querySelector("h3").textContent;
            aviso.textContent = "Sabor " + (ativo + 1) + " de " + total + ": " + nome;
        }

        // Religa as transições no próximo quadro
        requestAnimationFrame(() => {
            cards.forEach(card => card.classList.remove("sem-transicao"));
        });
    }

    function irPara(i) {
        ativo = (i + total) % total;
        atualizar(false);
    }

    botaoAnterior.addEventListener("click", () => irPara(ativo - 1));
    botaoProximo.addEventListener("click", () => irPara(ativo + 1));

    // Arrastar com o dedo / mouse
    let inicioX = null;
    let arrastou = false;

    // Clicar num card do lado traz ele pro meio
    cards.forEach((card, i) => {
        card.addEventListener("click", () => {
            if (arrastou) return;
            if (i !== ativo) irPara(i);
        });
    });

    // Setas do teclado
    lista.addEventListener("keydown", event => {
        if (event.key === "ArrowLeft") irPara(ativo - 1);
        if (event.key === "ArrowRight") irPara(ativo + 1);
    });

    lista.addEventListener("pointerdown", event => {
        inicioX = event.clientX;
        arrastou = false;
    });

    lista.addEventListener("pointerup", event => {
        if (inicioX === null) return;

        const diferenca = event.clientX - inicioX;
        inicioX = null;

        if (Math.abs(diferenca) > 40) {
            arrastou = true;
            irPara(ativo + (diferenca < 0 ? 1 : -1));
        }
    });

    lista.addEventListener("pointercancel", () => {
        inicioX = null;
    });

    // Liga o modo carrossel
    carrossel.classList.add("carrossel-ativo");
    [botaoAnterior, botaoProximo, pontosArea].forEach(el => el.hidden = false);
    atualizar(true);
}