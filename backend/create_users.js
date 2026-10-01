const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

require('dotenv').config();

async function createUsers() {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'smartcloud'
        });

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash('password123', saltRounds);

        // Admin User
        await db.query(
            "INSERT IGNORE INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
            ['System Admin', 'admin@smartcloud.com', passwordHash, 'admin']
        );

        // Student User
        await db.query(
            "INSERT IGNORE INTO users (full_name, email, student_id, college_name, course, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
            ['John Doe', 'student@smartcloud.com', 'STU12345', 'Engineering College', 'B.Tech CS', passwordHash, 'student']
        );

        // Guest User
        await db.query(
            "INSERT IGNORE INTO users (full_name, email, student_id, college_name, course, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
            ['Guest User', 'guest@smartcloud.com', 'GUEST001', 'Guest College', 'Guest Course', passwordHash, 'student']
        );

        console.log("Users created successfully!");
        console.log("-------------------------------------------------");
        console.log("Admin Login   : admin@smartcloud.com");
        console.log("Admin Password: password123");
        console.log("-------------------------------------------------");
        console.log("Student Login   : student@smartcloud.com");
        console.log("Student Password: password123");
        console.log("-------------------------------------------------");
        console.log("Guest Login     : guest@smartcloud.com");
        console.log("Guest Password  : password123");
        console.log("-------------------------------------------------");

        await db.end();
    } catch (e) {
        console.error("Error creating users:", e.message);
    }
}

createUsers();
