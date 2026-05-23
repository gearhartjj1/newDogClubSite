import express from 'express';
import pool from '../config/database';
const router = express.Router();
// Sign in user
router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Username and password are required'
            });
        }
        // Query the database for the user
        // Note: The Teacher table is where user login data is stored
        const query = 'SELECT * FROM Teacher WHERE LastName = ? LIMIT 1';
        console.log("Jake the query: ", query, username);
        try {
            const [rows] = await pool.query(query, [username]);
            console.log('Sign in query result: ', rows);
            if (!rows || rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid username or password'
                });
            }
            const user = rows[0];
            // Compare password (basic comparison - TODO: implement bcrypt hashing for production)
            if (user.Password !== password) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid username or password'
                });
            }
            // Successful login
            console.log("sign in is good, sending response for user: ", user);
            res.status(200).json({
                success: true,
                message: 'Sign in successful',
                user: user
            });
        }
        catch (dbError) {
            console.error('Database error during sign in: ', dbError);
            // If table doesn't exist, provide helpful error message
            if (dbError.message && dbError.message.includes('ER_NO_SUCH_TABLE')) {
                console.error('Teacher table not found. Check database schema.');
                return res.status(500).json({
                    success: false,
                    error: 'Database configuration error. Teacher table not found.'
                });
            }
            throw dbError;
        }
    }
    catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process sign in request'
        });
    }
});
export default router;
