// app.js
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const express = require('express');
const connectToDatabase = require('./db');
const { ObjectId } = require('mongodb');
const app = express();
const port = 3000;
app.use(express.json());
// Function to add a new user
async function addUser(db, userData) {
    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Convert roles to ObjectId if they are not already
        const roleIds = userData.roles.map(roleId => new ObjectId(roleId));

        // Create a new user object
        const newUser = {
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            roles: roleIds   // This should be an array of role IDs
        };

        // Insert the new user into the 'users' collection
        const result = await db.collection('users').insertOne(newUser);

        return result; // Return the result of the insertion
    } catch (err) {
        throw new Error('Error adding user: ' + err);
    }
}

async function startServer() {
    try {
        const db = await connectToDatabase();

        // Now you can use the `db` object to interact with your database
        app.get('/', async (req, res) => {
            const collections = await db.collections();
            res.send('Collections: ' + collections.map(col => col.collectionName).join(', '));
        });
        app.get('/users', async (req, res) => {
            try {
                // Call the function to get users data
                const users = await getUsersData(db);
                // Send the data back as a response
                res.json(users);
            } catch (err) {
                res.status(500).send(err.message);
            }
        });

        // POST route to add a new user
        app.post('/add-user', async (req, res) => {
            try {
                const db = await connectToDatabase(); // Assuming `connectToDatabase` is your DB connection function

                const { username, email, password, roles } = req.body;

                // Basic validation
                if (!username || !email || !password || !roles || !Array.isArray(roles)) {
                    return res.status(400).json({ message: 'All fields are required and roles must be an array.' });
                }

                // Add the user to the database
                const result = await addUser(db, { username, email, password, roles });

                // Return a success message
                res.status(201).json({ message: 'User added successfully', userId: result.insertedId });
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
        });

        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to start server', err);
    }
}
async function getUsersData(db) {
    try {
        // Perform an aggregation to join 'users' with 'roles' collection
        const users = await db.collection('users').aggregate([
            {
                $lookup: {
                    from: 'roles', // The collection to join (roles)
                    localField: 'roles', // The field from 'users' (list of role IDs)
                    foreignField: '_id', // The field from 'roles' (role ID)
                    as: 'roleDetails' // The name of the field where joined data will be stored
                }
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    'roleDetails._id': 1 ,
                    'roleDetails.name': 1 // Project only the roles' names
                }
            }
        ]).toArray();

        return users; // Return the aggregated users data
    } catch (err) {
        throw new Error('Error fetching users: ' + err);
    }
}

startServer();
