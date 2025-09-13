// Obtener referencias a los elementos del DOM
const resultMessage = document.getElementById('result-message');
const choicesMessage = document.getElementById('choices-message');
const playerScoreSpan = document.getElementById('player-score');
const computerScoreSpan = document.getElementById('computer-score');
const choiceButtons = document.querySelectorAll('.choice-btn');
const resetButton = document.getElementById('reset-btn');

// Variables para el marcador
let playerScore = 0;
let computerScore = 0;

/**
 * Función que genera una elección "favorable" para el jugador.
 * La computadora elegirá el movimiento que pierde contra el del jugador con más frecuencia.
 * @param {string} playerChoice - La elección del jugador.
 * @returns {string} - La elección de la computadora.
 */
function getComputerChoice(playerChoice) {
    const choices = ['piedra', 'papel', 'tijera'];

    // Define las opciones que pierden, ganan y empatan contra cada movimiento
    const winningMoves = {
        'piedra': 'papel',
        'papel': 'tijera',
        'tijera': 'piedra'
    };

    // La computadora elige el movimiento perdedor con 70% de probabilidad
    // y un movimiento aleatorio (para no ser tan obvia) con 30%.
    const willLose = Math.random() < 0.7; // 70% de probabilidad de perder

    if (willLose) {
        // La computadora elige el movimiento que pierde contra el jugador
        return winningMoves[playerChoice];
    } else {
        // La computadora elige aleatoriamente para simular un juego "real"
        const randomIndex = Math.floor(Math.random() * choices.length);
        return choices[randomIndex];
    }
}

/**
 * Función que determina el resultado de la partida.
 * @param {string} playerChoice - La elección del jugador.
 * @param {string} computerChoice - La elección de la computadora.
 * @returns {string} - El resultado ('ganaste', 'perdiste' o 'empate').
 */
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'empate';
    }
    
    // Reglas del juego
    if (
        (playerChoice === 'piedra' && computerChoice === 'tijera') ||
        (playerChoice === 'papel' && computerChoice === 'piedra') ||
        (playerChoice === 'tijera' && computerChoice === 'papel')
    ) {
        return 'ganaste';
    } else {
        return 'perdiste';
    }
}

/**
 * Función que actualiza el marcador y los mensajes en la interfaz.
 * @param {string} result - El resultado de la partida.
 * @param {string} playerChoice - La elección del jugador.
 * @param {string} computerChoice - La elección de la computadora.
 */
function updateUI(result, playerChoice, computerChoice) {
    if (result === 'ganaste') {
        resultMessage.textContent = '¡Ganaste!';
        resultMessage.style.color = '#28a745';
        playerScore++;
    } else if (result === 'perdiste') {
        resultMessage.textContent = '¡Perdiste!';
        resultMessage.style.color = '#dc3545';
        computerScore++;
    } else {
        resultMessage.textContent = '¡Empate!';
        resultMessage.style.color = '#ffc107';
    }

    choicesMessage.textContent = `Tú elegiste ${playerChoice} y la computadora eligió ${computerChoice}.`;

    playerScoreSpan.textContent = playerScore;
    computerScoreSpan.textContent = computerScore;
}

/**
 * Función que maneja el click del jugador.
 * @param {Event} event - El evento del click.
 */
function handlePlayerChoice(event) {
    const playerChoice = event.target.id;
    const computerChoice = getComputerChoice(playerChoice);
    const result = determineWinner(playerChoice, computerChoice);
    updateUI(result, playerChoice, computerChoice);
}

/**
 * Función para reiniciar el juego.
 */
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    playerScoreSpan.textContent = '0';
    computerScoreSpan.textContent = '0';
    resultMessage.textContent = '¡Elige tu movimiento!';
    resultMessage.style.color = '#4a4a4a';
    choicesMessage.textContent = '';
}

// Añadir 'event listeners' a los botones de elección
choiceButtons.forEach(button => {
    button.addEventListener('click', handlePlayerChoice);
});

// Añadir 'event listener' al botón de reinicio
resetButton.addEventListener('click', resetGame);