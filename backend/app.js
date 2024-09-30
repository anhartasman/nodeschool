// app.js
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const express = require('express');
const connectToDatabase = require('./db');
const { ObjectId } = require('mongodb');
const app = express();
const port = 4000;
const cors = require('cors');
app.use(express.json());
app.use(cors());

// Function to add a new user
async function saveUser(db, userData, userId = null) {
    try {
        // Hash the password before saving (only if adding a new user or if password is provided)
        let hashedPassword = null;
        if (userData.password) {
            hashedPassword = await bcrypt.hash(userData.password, 10);
        }

        // Convert roles to ObjectId if they are not already
        const roleIds = userData.roles.map(roleId => new ObjectId(roleId));

        // Create the user object with roles as an array of strings
        const user = {
            username: userData.username,
            email: userData.email,
            roles: roleIds // This should be an array of role strings, e.g., ['admin', 'editor']
        };

        // Add the hashed password if it was provided
        if (hashedPassword) {
            user.password = hashedPassword;
        }

        let result;
        if (userId) {
            // If userId is provided, update the existing user
            result = await db.collection('users').updateOne(
                { _id: new ObjectId(userId) }, // Update by userId
                { $set: user }
            );
        } else {
            // Otherwise, insert a new user
            result = await db.collection('users').insertOne(user);
        }

        return result; // Return the result of insertion or update
    } catch (err) {
        throw new Error('Error saving user: ' + err);
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
        app.post('/users', async (req, res) => {
            const { username, email, roles } = req.body; // Extract user data from the request body
            try {
                // Convert roles array of string IDs to ObjectId if necessary
                const roleIds = roles.map(role => new ObjectId(role));
                // Insert the new user into the database
                const newUser = await db.collection('users').insertOne({
                    username,
                    email,
                    roles: roleIds // Store as ObjectId in the database
                });
                // Instead of accessing `ops[0]`, use `insertedId` and fetch the inserted user manually if needed.
                const insertedUser = await db.collection('users').findOne({ _id: newUser.insertedId });
                
                res.status(201).json(insertedUser);
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
                const result = await saveUser(db, { username, email, password, roles });

                // Return a success message
                res.status(201).json({ message: 'User added successfully', userId: result.insertedId });
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
        // PUT route to edit a user by ID
        app.put('/users/:id', async (req, res) => {
            try {
                const db = await connectToDatabase(); // Assuming `connectToDatabase` is your DB connection function
                const { id } = req.params;
                const { username, email, password, roles } = req.body;

                // Basic validation
                if (!username || !email || !roles || !Array.isArray(roles)) {
                    return res.status(400).json({ message: 'All fields are required and roles must be an array.' });
                }

                // Create the updated user object
                const updatedUser = {
                    username,
                    email,
                    roles,
                };

                // Optionally, handle password update if provided
                if (password) {
                    updatedUser.password = password; // You should hash the password before storing it
                }

                const result = await saveUser(db, { username, email, roles }, id);


                // If the user was updated, send a success message
                if (result.modifiedCount > 0) {
                    res.status(200).json({ message: 'User updated successfully' });
                } else {
                    res.status(404).json({ message: 'User not found or no changes made' });
                }
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
        });


        app.get('/users/:id', async (req, res) => {
            const userId = req.params.id; // Get the user ID from the route parameter
            try {
                // Call the function to get user data based on the ID
                const user = await getUserDataById(db, userId); // Create this function to fetch a user by ID
                if (!user) {
                    return res.status(404).send('User not found'); // Handle case where user does not exist
                }
                res.json(user); // Send user data back as a JSON response
            } catch (err) {
                res.status(500).send(err.message); // Handle any errors that may occur
            }
        });
        
        // Route to get all available roles
        app.get('/roles', async (req, res) => {
            try {
                const roles = await getAllRoles(db);
                res.json(roles); // Return the roles as JSON
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
async function getUserDataById(db, userId) {
    try {
        const user = await db.collection('users').aggregate([
            {
                $match: { _id: new ObjectId(userId) } // Match the user by ID
            },
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
                    'roleDetails._id': 1,
                    'roleDetails.name': 1 // Project only the roles' names
                }
            }
        ]).toArray();

        return user[0]; // Return the first matching user
    } catch (err) {
        throw new Error('Error fetching user: ' + err);
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
// Function to get all roles
async function getAllRoles(db) {
    try {
        // Query the 'roles' collection for all roles
        const roles = await db.collection('roles').find({}).toArray();
        return roles; // Return the list of roles
    } catch (err) {
        throw new Error('Error fetching roles: ' + err);
    }
}
startServer();
