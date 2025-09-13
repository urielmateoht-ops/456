// script.js

// Lista de emojis para las 6 parejas
const emojis = ['🐶', '🐱', '🦊', '🐸', '🐵', '🐼'];

// Variables para el estado del juego
let cardsArray = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let timerInterval = null;
let secondsElapsed = 0;
let timerStarted = false;

// Referencias a elementos DOM
const gameBoard = document.getElementById('gameBoard');
const attemptsSpan = document.getElementById('attempts');
const timerSpan = document.getElementById('timer');
const restartBtn = document.getElementById('restartBtn');
const victoryMessage = document.getElementById('victoryMessage');
const finalTime = document.getElementById('finalTime');
const finalAttempts = document.getElementById('finalAttempts');
const playAgainBtn = document.getElementById('playAgainBtn');

// Función para mezclar un array (Fisher-Yates)
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // Intercambiar
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Función para crear las cartas en el DOM
function createCards() {
    // Limpiar tablero
    gameBoard.innerHTML = '';
    matchedPairs = 0;
    attempts = 0;
    attemptsSpan.textContent = attempts;
    flippedCards = [];
    timerStarted = false;
    secondsElapsed = 0;
    timerSpan.textContent = '00:00';
    clearInterval(timerInterval);
    victoryMessage.classList.add('hidden');

    // Crear array con parejas duplicadas
    cardsArray = [...emojis, ...emojis];
    shuffle(cardsArray);

    // Crear elementos carta
    cardsArray.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = emoji;

        // Estructura interna para efecto flip
        card.innerHTML = `
            <div class="front">${emoji}</div>
            <div class="back">❓</div>
        `;

        // Evento click para voltear carta
        card.addEventListener('click', () => flipCard(card));

        gameBoard.appendChild(card);
    });
}

// Función para iniciar el temporizador
function startTimer() {
    timerInterval = setInterval(() => {
        secondsElapsed++;
        timerSpan.textContent = formatTime(secondsElapsed);
    }, 1000);
    timerStarted = true;
}

// Formatear segundos a mm:ss
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

// Función para manejar el volteo de cartas
function flipCard(card) {
    // No hacer nada si ya está volteada o si hay 2 cartas volteadas
    if (card.classList.contains('flipped') || flippedCards.length === 2) return;

    // Iniciar temporizador en el primer clic
    if (!timerStarted) startTimer();

    // Voltear carta
    card.classList.add('flipped');
    flippedCards.push(card);

    // Si hay dos cartas volteadas, verificar si son pareja
    if (flippedCards.length === 2) {
        attempts++;
        attemptsSpan.textContent = attempts;

        const [card1, card2] = flippedCards;

        if (card1.dataset.value === card2.dataset.value) {
            // Pareja encontrada, mantener abiertas
            matchedPairs++;
            flippedCards = [];

            // Verificar si ganó el juego
            if (matchedPairs === emojis.length) {
                clearInterval(timerInterval);
                showVictoryMessage();
            }
        } else {
            // No es pareja, voltearlas de nuevo después de un delay
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }
}

// Mostrar mensaje de victoria
function showVictoryMessage() {
    finalTime.textContent = formatTime(secondsElapsed);
    finalAttempts.textContent = attempts;
    victoryMessage.classList.remove('hidden');
}

// Reiniciar juego
restartBtn.addEventListener('click', createCards);
playAgainBtn.addEventListener('click', createCards);

// Inicializar juego al cargar la página
createCards();