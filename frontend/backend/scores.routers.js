const express = require('express');
const router = express.Router();
const fs = require('fs').promises; // Usar la versión de promesas de fs
const path = require('path');

const scoresFilePath = path.join(__dirname, 'data/scores.json');

// GET /api/scores - Obtiene el leaderboard
router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(scoresFilePath, 'utf8');
        let scores = JSON.parse(data);
        
        // Ordenar scores de mayor a menor y tomar los primeros 10
        scores.sort((a, b) => b.score - a.score);
        const topScores = scores.slice(0, 10);
        
        res.json(topScores);
    } catch (error) {
        console.error('Error reading scores file:', error);
        res.status(500).json({ message: 'Error al obtener las puntuaciones.' });
    }
});

// POST /api/scores - Guarda una nueva puntuación
router.post('/', async (req, res) => {
    const { name, score, level } = req.body;
    
    // Validar los datos
    if (!name || typeof score !== 'number' || typeof level !== 'number') {
        return res.status(400).json({ message: 'Datos de puntuación inválidos.' });
    }

    const newScore = {
        id: Date.now(), // Un ID único para la puntuación
        name,
        score,
        level,
        date: new Date().toISOString()
    };
    
    try {
        const data = await fs.readFile(scoresFilePath, 'utf8');
        const scores = JSON.parse(data);
        scores.push(newScore);
        
        await fs.writeFile(scoresFilePath, JSON.stringify(scores, null, 2), 'utf8');
        
        res.status(201).json({ message: 'Puntuación guardada con éxito.', score: newScore });
    } catch (error) {
        console.error('Error writing to scores file:', error);
        res.status(500).json({ message: 'Error al guardar la puntuación.' });
    }
});

module.exports = router;