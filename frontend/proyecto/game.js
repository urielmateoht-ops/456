import { saveScore, getScores } from './api.js'; // Importar getScores correctamente

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('score-display');
const levelDisplay = document.getElementById('level-display');
const highScoreDisplay = document.getElementById('high-score-display');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const playerNameInput = document.getElementById('playerNameInput');
const leaderboardList = document.getElementById('leaderboard-list');
const messageModal = document.getElementById('messageModal');
const closeModalBtn = document.getElementById('closeModalBtn');
// Eliminado 'restartBtnLeaderboard' ya que no existe en game.html

let isRunning = false;
let score = 0;
let level = 1;
// Cargar el High Score desde localStorage al inicio si existe
let highScore = parseInt(localStorage.getItem('dinoRunnerHighScore') || '0', 10); 
let frame = 0;
let speed = 4;
let gravity = 0.5;

// Dimensiones del lienzo
canvas.width = 700;
canvas.height = 300;

// Variables para las imágenes
const bgImage = new Image();
const playerImage = new Image();
const obstacleImage = new Image(); // ¡Asegurado que se declara solo una vez!

// Asignar fuentes de las imágenes (usando las imágenes subidas)
bgImage.src = 'descarga.jpeg';    // Fondo del desierto
playerImage.src = 'correcaminos.png'; // El "Pollo"
obstacleImage.src = 'coyote.png';     // El "Coyote"


// Posiciones para el fondo en movimiento
let bgX1 = 0;
let bgX2 = canvas.width;

// Clase del jugador (Correcaminos)
class Player {
    constructor() {
        this.x = 50;
        this.width = 40;
        this.height = 60;
        // Posición inicial 'y' en el suelo
        this.y = canvas.height - this.height; 
        this.velocityY = 0;
        this.isJumping = false;
    }

    draw() {
        ctx.drawImage(playerImage, this.x, this.y, this.width, this.height);
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.velocityY = -12;
        }
    }

    update() {
        this.velocityY += gravity;
        this.y += this.velocityY;

        const groundLevel = canvas.height - this.height;
        if (this.y >= groundLevel) {
            this.y = groundLevel;
            this.isJumping = false;
            this.velocityY = 0;
        }
        this.draw();
    }
}

// Clase de los obstáculos (Coyote)
class Obstacle {
    constructor() {
        this.width = 35; // Ajuste de tamaño para el Coyote
        this.height = 55; // Ajuste de tamaño para el Coyote
        this.x = canvas.width;
        // Posición 'y' en el suelo
        this.y = canvas.height - this.height;
    }

    draw() {
        ctx.drawImage(obstacleImage, this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= speed;
        this.draw();
    }
}

let player;
let obstacles = [];
let imagesLoaded = 0;
const totalImages = 3;

// --- Funciones de Soporte ---

/**
 * Muestra los resultados del leaderboard en el HTML.
 * @param {Array<Object>} scores - Array de objetos con { name, score }.
 */
async function renderLeaderboard() {
    const scores = await getScores();
    leaderboardList.innerHTML = ''; // Limpiar lista
    scores.slice(0, 10).forEach((item, index) => { // Mostrar solo top 10
        const li = document.createElement('li');
        // Usa un nombre por defecto si no está presente
        const name = item.name || 'Anónimo'; 
        li.innerHTML = `<span>#${index + 1} ${name}</span><span>${item.score}</span>`;
        leaderboardList.appendChild(li);
    });
}

function imageLoadHandler() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        init(); // Iniciar el juego
        renderLeaderboard(); // Cargar la tabla de puntajes
        highScoreDisplay.textContent = `Máximo: ${highScore}`;
    }
}

// Asignar los handlers de carga
bgImage.onload = imageLoadHandler;
playerImage.onload = imageLoadHandler;
obstacleImage.onload = imageLoadHandler;

// Inicialización del juego
function init() {
    player = new Player();
    obstacles = [];
    score = 0;
    level = 1;
    speed = 4;
    frame = 0;
    isRunning = true;
    gameOverScreen.style.display = 'none';
    messageModal.style.display = 'none';
    updateHUD();
    gameLoop();
}

// Bucle principal del juego
function gameLoop() {
    if (!isRunning) return;

    // Limpiar lienzo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo en movimiento (Parallax)
    bgX1 -= speed / 2;
    bgX2 -= speed / 2;
    if (bgX1 < -canvas.width) bgX1 += canvas.width * 2;
    if (bgX2 < -canvas.width) bgX2 += canvas.width * 2;
    
    // Dibuja el fondo
    ctx.drawImage(bgImage, bgX1, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, bgX2 - canvas.width, 0, canvas.width, canvas.height);

    // Actualizar y dibujar jugador
    player.update();

    // Generar obstáculos
    const obstacleSpawnRate = Math.floor(150 / (speed / 4)); // Tasa de aparición dinámica
    if (frame % obstacleSpawnRate === 0) {
        obstacles.push(new Obstacle());
    }

    // Actualizar, dibujar y detectar colisiones
    obstacles.forEach((obstacle, index) => {
        obstacle.update();
        
        // Detección de colisiones (AABB)
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver();
        }
    });
    
    // Filtrar obstáculos fuera de pantalla
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    // Incrementar puntaje y nivel
    frame++;
    score++;
    if (score % 500 === 0 && score > 0) {
        level++;
        speed += 0.5; // Aumenta la velocidad para el nuevo nivel
    }
    updateHUD();

    requestAnimationFrame(gameLoop);
}

// Actualizar HUD
function updateHUD() {
    scoreDisplay.textContent = `Puntaje: ${score}`;
    levelDisplay.textContent = `Nivel: ${level}`;
    
    // Actualizar y guardar el High Score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('dinoRunnerHighScore', highScore.toString());
    }
    highScoreDisplay.textContent = `Máximo: ${highScore}`;
}

// Pantalla de Game Over
function gameOver() {
    isRunning = false;
    finalScoreDisplay.textContent = score;
    gameOverScreen.style.display = 'flex';
}

// --- Manejadores de Eventos ---

// Manejar eventos del teclado
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && isRunning) {
        player.jump();
        e.preventDefault();
    }
    if (e.code === 'Enter' && !isRunning) {
        // Permitir reiniciar con Enter si la pantalla de Game Over está visible
        if (gameOverScreen.style.display === 'flex') { 
            init();
            e.preventDefault();
        }
    }
});

// Manejar botones
restartBtn.addEventListener('click', init);

saveScoreBtn.addEventListener('click', async () => {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        // Desactivar el botón para evitar envíos duplicados
        saveScoreBtn.disabled = true; 
        saveScoreBtn.textContent = 'Guardando...';

        await saveScore({ name: playerName, score: score }); // Llamada a la función de API
        
        // Reactivar el botón
        saveScoreBtn.disabled = false;
        saveScoreBtn.textContent = 'Guardar Puntaje';
        
        renderLeaderboard(); // Recargar el leaderboard después de guardar
        playerNameInput.value = ''; // Limpiar el campo
        // Opcional: Ocultar el formulario después de guardar
        // gameOverScreen.style.display = 'none'; 
    } else {
        alert("Por favor, introduce tu nombre.");
    }
});

closeModalBtn.addEventListener('click', () => {
    messageModal.style.display = 'none';
});

// Nota: La carga inicial del juego se realiza en imageLoadHandler.
// Eliminada la llamada `window.addEventListener('load', ...)` duplicada/innecesaria.