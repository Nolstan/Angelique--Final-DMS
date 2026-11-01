const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Test database connection
app.get('/api/test-db', async (req, res) => {
    let connection;

    try {
        connection = await pool.getConnection();

        const result = await connection.query(
            'SELECT DATABASE() AS database_name'
        );

        res.json({
            message: 'Database connection successful!',
            database: result[0].database_name
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Database connection failed',
            error: error.message
        });

    } finally {
        if (connection) connection.release();
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});