// api.js

const localStorageKey = 'dinoRunnerLeaderboard';
const apiBaseUrl = '/api/scores';

// Función para mostrar mensajes en el modal (reutilizada de game.js)
// Exportarla para que game.js no necesite reimplementarla
export function showMessage(text) { 
    const messageModal = document.getElementById('messageModal');
    const messageText = document.getElementById('messageText');
    messageText.textContent = text;
    messageModal.style.display = 'flex';
}

/**
 * Obtiene las puntuaciones del servidor y, si falla, usa localStorage como respaldo.
 * @returns {Promise<Array<Object>>} Un array de objetos con las puntuaciones.
 */
async function getScores() {
    try {
        const response = await fetch(apiBaseUrl);
        if (!response.ok) {
            // Se puede lanzar un error con el mensaje de estado para mayor detalle
            throw new Error(`El servidor no respondió. Estado: ${response.status}`);
        }
        const scores = await response.json();
        return scores.sort((a, b) => b.score - a.score);
    } catch (error) {
        console.warn('Error al obtener puntuaciones del servidor. Usando localStorage.', error.message);
        // Fallback a localStorage
        const scores = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
        return scores.sort((a, b) => b.score - a.score);
    }
}

/**
 * Guarda una nueva puntuación en el servidor y, si falla, la guarda en localStorage.
 * @param {Object} newScore El objeto de la puntuación a guardar: { name: string, score: number }.
 */
async function saveScore(newScore) {
    try {
        const response = await fetch(apiBaseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // newScore ya es el objeto { name, score }
            body: JSON.stringify(newScore) 
        });

        if (!response.ok) {
            throw new Error(`El servidor no pudo guardar el puntaje. Estado: ${response.status}`);
        }

        const data = await response.json();
        console.log('Puntaje guardado en el servidor:', data);
        showMessage('Puntaje guardado en el servidor.');
    } catch (error) {
        console.error('Error al guardar en el servidor. Usando localStorage.', error);
        // Fallback a localStorage
        const scores = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
        scores.push(newScore);
        // Mantener solo un top de, por ejemplo, 50 puntajes en localStorage
        scores.sort((a, b) => b.score - a.score);
        const topScores = scores.slice(0, 50); 
        localStorage.setItem(localStorageKey, JSON.stringify(topScores));
        showMessage('Puntaje guardado localmente.');
    }
}

// Exportar las funciones
export { getScores, saveScore };