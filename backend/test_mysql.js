const mysql = require('mysql2');

const passwords = ['', 'root', 'admin', 'password', '123456', '12345678', 'qwerty'];

async function testPasswords() {
    for (const p of passwords) {
        try {
            console.log(`Trying password: '${p}'`);
            const pool = mysql.createPool({
                host: 'localhost',
                user: 'root',
                password: p
            });
            const connection = await pool.promise().getConnection();
            console.log(`SUCCESS! The password is: '${p}'`);
            await connection.release();
            pool.end();
            process.exit(0);
        } catch (e) {
            console.log(`Failed for '${p}':`, e.code);
        }
    }
    console.log("None of the common passwords worked.");
    process.exit(1);
}

testPasswords();
