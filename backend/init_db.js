const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');

async function initDB() {
    try {
        console.log("Connecting to MySQL...");
        // Connect to MySQL server without specifying a database first
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: ''
        });
        
        console.log("Connected successfully!");

        // Read the database.sql file
        const sqlPath = path.join(__dirname, '..', 'database.sql');
        const sqlScript = fs.readFileSync(sqlPath, 'utf8');

        console.log("Creating database and tables...");
        
        // Execute the SQL script
        // Note: mysql2/promise execute or query might not support multiple statements by default
        // We need to enable multipleStatements or split the queries.
        const connectionWithMulti = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: '',
            multipleStatements: true
        });

        await connectionWithMulti.query(sqlScript);
        
        console.log("Database 'smartcloud' initialized successfully!");
        
        await connection.end();
        await connectionWithMulti.end();
        process.exit(0);
    } catch (e) {
        console.error("Error initializing database:", e.message);
        process.exit(1);
    }
}

initDB();
