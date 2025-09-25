const express = require('express');
const app = express();
const cors = require('cors'); // Necesario para permitir solicitudes desde el frontend
const scoresRoutes = require('./scores.routes');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/scores', scoresRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});