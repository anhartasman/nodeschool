// db.js
const { MongoClient } = require('mongodb');

// Connection URL (replace <username> and <password> with your actual credentials)
const url = 'mongodb+srv://ciloklover:cilok123@cluster0.cfzlqrc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Database Name
const dbName = 'admin_db'; // Replace with your database name

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

let db;

async function connectToDatabase() {
    if (db) {
        return db; // Return the existing connection if already connected
    }

    try {
        // Connect the client to the server
        await client.connect();
        console.log('Connected successfully to MongoDB server');

        // Connect to the database
        db = client.db(dbName);
        return db;
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        throw err;
    }
}

module.exports = connectToDatabase;
