const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

app.use(express.json());

const PORT = 5000;

const MONGO_URL = "mongodb://mongodb:27017";

const client = new MongoClient(MONGO_URL);

let db;

async function startServer() {
    try {
        await client.connect();

        db = client.db("threeTierDB");

        console.log("Connected to MongoDB");

        app.get("/", (req, res) => {
            res.json({
                message: "Backend is running successfully"
            });
        });

        app.get("/users", async (req, res) => {
            try {
                const users = await db
                    .collection("users")
                    .find()
                    .toArray();

                res.json(users);
            } catch (error) {
                res.status(500).json({
                    error: "Failed to fetch users"
                });
            }
        });

        app.listen(PORT, () => {
            console.log(`Backend running on port ${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}

startServer();