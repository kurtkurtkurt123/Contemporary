const express = require('express');
const sql = require('mssql');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json()); // Para mabasa ang JSON galing React
app.use(cors()); // Para payagan ang React na kumonekta

// 1. Database Configuration (Palitan mo ito ng details ng MS SQL mo)
const dbConfig = {
    user: 'sa',             // SQL Username
    password: 'YourPassword123', // SQL Password
    server: 'localhost',    // Server name
    database: 'LMS_DB',     // Database Name
    options: {
        encrypt: true,      // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
};

// 2. Ang LOGIN Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Connect sa Database
        let pool = await sql.connect(dbConfig);

        // Query: Hanapin ang user base sa email at password
        // NOTE: Sa totoong app, dapat naka-hash ang password (gamit ang bcrypt)
        let result = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, password)
            .query('SELECT * FROM Users WHERE Email = @email AND Password = @password');

        const user = result.recordset[0];

        // Kung walang nahanap na user
        if (!user) {
            return res.status(401).json({ message: 'Mali ang email o password' });
        }

        // 3. Generate JWT Token (Dito ilalagay ang ROLE)
        // Siguraduhin na 'Role' ang column name mo sa database
        const token = jwt.sign(
            { 
                id: user.UserID, 
                email: user.Email, 
                role: user.Role // <--- IMPORTANTE: Ito ang babasahin ng React!
            },
            'SecretKeyMoDapatMahaba', // Secret Key
            { expiresIn: '2h' }
        );

        // Ibalik sa React
        res.json({
            message: 'Login successful',
            token: token,
            user: {
                firstName: user.FirstName,
                lastName: user.LastName,
                role: user.Role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});