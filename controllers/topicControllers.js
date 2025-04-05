const db = require('../models/db');

const getAlltopics = (req, res) => {
    db.query(`
        SELECT * FROM topic JOIN users USING(user_id) ORDER BY topic.date DESC;
    `, (err, results) => {
        if (err) {
            console.error(`adatbázis hiba a topicok lekérésekor: ${err}`);
            return res.status(500).send("Database error");
        }
        console.log(results);
        
        res.json(results);
    });
};

const uploadTopic = (req, res) => {
    console.log(req.user, req.user_id);
    
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Nem vagy bejelentkezve' });
    }

    const { topic_title } = req.body;
    const user_id = req.user.id;  // Most már biztos, hogy nem undefined
    console.log(`topic title: ${topic_title}, user_id: ${user_id}`);
    

    if (!topic_title) {
        return res.status(400).send("A cím megadása kötelező.");
    }

    const currentDate = new Date().toISOString();
    console.log(currentDate);
    
    db.query(`
        INSERT INTO topics (topic_title, user_id, date) 
        VALUES (?, ?, ?);
    `, [topic_title, user_id, currentDate], (err, result) => {
        if (err) {
            console.error('Hiba történt a téma hozzáadása közben:', err);
            return res.status(500).send("Hiba történt a témák hozzáadásakor");
        }

        const newTopic = {
            topic_id: result.insertId,
            topic_title: topic_title,
            user_id: user_id,
            date: currentDate,
        };
        console.log(newTopic);
        
        res.status(201).json(newTopic);
    });
};


const getComments = (req, res) => {
    const topicId = parseInt(req.params.topicId, 10);
    console.log(topicId);
    
    if (isNaN(topicId)) {
        return res.status(400).json({ error: 'Invalid topic ID' });
    }

    db.query(`
        SELECT * FROM comments 
        WHERE topic_id = ?;
    `, [topicId], (err, results) => {
        if (err) {
            console.error('Error fetching comments:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        res.json(results);
    });
};

const addComment = async (req, res) => {
    const { topic_id, comment, user_id } = req.body;
    console.log(topic_id, comment, user_id);
    
    if (!topic_id || !comment || !user_id) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        await db.promise().query(
            "INSERT INTO comments (topic_id, comment, user_id) VALUES (?, ?, ?)",
            [topic_id, comment, user_id]
        );

        res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "An error occurred while adding the comment", error: error.message });
    }
};

module.exports = { getAlltopics, getComments, addComment, uploadTopic }