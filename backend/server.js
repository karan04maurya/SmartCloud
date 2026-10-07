const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local uploads
const path = require('path');
app.use('/mock-uploads', express.static(path.join(__dirname, 'uploads')));

// Test DB Connection
const db = require('./config/db');
db.query('SELECT 1')
    .then(() => console.log('MySQL Database Connected Successfully'))
    .catch((err) => console.error('Database Connection Error:', err));

// MongoDB Connection
const connectMongoDB = require('./config/mongodb');
connectMongoDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/share', require('./routes/shareRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    
    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    });
} else {
    // Basic Route for Development
    app.get('/', (req, res) => {
        res.send('SmartCloud API is running in development mode...');
    });
}

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
