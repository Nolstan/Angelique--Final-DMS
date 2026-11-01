
const express = require('express');
const cors = require('cors');
const path = require('path');

const pool = require('./db');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

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

// Student routes
app.use('/api/students', studentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
