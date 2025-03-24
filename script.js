const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');
let gameOver = false;
let pontuacao = 0;

const teclasPressionadas = {
    KeyW: false,
    KeyS: false,
    KeyD: false,
    KeyA: false
};

document.addEventListener('keydown', (e) => {
    for (let tecla in teclasPressionadas) {
        if (teclasPressionadas.hasOwnProperty(e.code)) {
            teclasPressionadas[tecla] = false;
        }
    }
    if (teclasPressionadas.hasOwnProperty(e.code)) {
        teclasPressionadas[e.code] = true;
    }
});

class Entidade {
    constructor(x, y, largura, altura) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
    }
    desenhar(cor) {
        ctx.fillStyle = cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
    desenharPontuacao() {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Pontuacao: ' + pontuacao, 20, 30);
    }
}

class Cobra extends Entidade {
    constructor(x, y, largura, altura) {
        super(x, y, largura, altura);
        this.corpo = [{ x: this.x, y: this.y }]; // corpo da cobrinha, começa com 1 quadradinho de corpo
        this.velocidade = 7; // em px
    }

    atualizar() {
        if (gameOver) return;

        let novaCabeca = { ...this.corpo[0] };

        if (teclasPressionadas.KeyW) {
            novaCabeca.y -= this.velocidade; //w
        } else if (teclasPressionadas.KeyS) {
            novaCabeca.y += this.velocidade; //s
        } else if (teclasPressionadas.KeyA) {
            novaCabeca.x -= this.velocidade; //a
        } else if (teclasPressionadas.KeyD) {
            novaCabeca.x += this.velocidade; //d
        }

        this.corpo.unshift(novaCabeca); // adiciona um quadrado na frente do corpo (adiciona mais uma cabeça)

        // vendo se a cobra comeu a maça
        if (novaCabeca.x === comida.x && novaCabeca.y === comida.y) {
            pontuacao += 1;
            comida.x = Math.random() * (canvas.width - 40);
            comida.y = Math.random() * (canvas.height - 40);
        } else {
            this.corpo.pop(); // tira o final da cobra
        }
    }

    verificarColisao(comida) {
        if (
            this.corpo[0].x < comida.x + comida.largura &&
            this.corpo[0].x + this.largura > comida.x &&
            this.corpo[0].y < comida.y + comida.altura &&
            this.corpo[0].y + this.altura > comida.y
        ) {
            this.#houveColisao(comida);
        }
    }

    #houveColisao(comida) {
        pontuacao += 1;
        comida.x = Math.random() * (canvas.width - 40);
        comida.y = Math.random() * (canvas.height - 40);

        this.corpo.push({ x: this.corpo[this.corpo.length - 1].x, y: this.corpo[this.corpo.length - 1].y });
    }

    colisaoParedes() {
        if (
            this.corpo[0].x + this.largura >= canvas.width || this.corpo[0].y + this.altura >= canvas.height ||
            this.corpo[0].x <= 0 || this.corpo[0].y <= 0        
        ) {
            gameOver = true;
            alert('Game Over!');
        }
    }

    desenhar(cor) { //para cada quadradinho do corpo ele pinta com a cor da variavel cor
        this.corpo.forEach(parte => {
            ctx.fillStyle = cor;
            ctx.fillRect(parte.x, parte.y, this.largura, this.altura);
        });
    }
}

class Comida extends Entidade {
    constructor() {
        super(
            Math.random() * (canvas.width - 20),
            Math.random() * (canvas.height - 20),
            20,
            20
        );
    }
}

const cobra = new Cobra(100, 200, 20, 20);
const comida = new Comida();

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cobra.desenhar('green');
    cobra.atualizar();
    cobra.colisaoParedes();
    comida.desenhar('red');
    cobra.verificarColisao(comida);
    cobra.desenharPontuacao();

    if (!gameOver) {
        requestAnimationFrame(loop);
    }
}

loop();
