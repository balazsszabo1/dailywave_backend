const db = require('../models/db');

const getAlltopics = (req, res) => {
    db.query(`
        SELECT 
            topic.topic_id,
            topic.topic_title,
            topic.date,
            users.username,
            MAX(comments.date) AS last_comment_date
        FROM topic
        JOIN users ON topic.user_id = users.user_id
        LEFT JOIN comments ON topic.topic_id = comments.topic_id
        GROUP BY topic.topic_id
        ORDER BY topic.date DESC;
    `, (err, results) => {
        if (err) {
            console.error(`Adatbázis hiba a témák lekérésekor: ${err}`);
            return res.status(500).send("Adatbázis hiba");
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
    const user_id = req.user.id;
    console.log(`Téma cím: ${topic_title}, user_id: ${user_id}`);

    if (!topic_title) {
        return res.status(400).json({ error: "A cím megadása kötelező." });
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    console.log(formattedDate);

    db.query(`
        INSERT INTO topic (topic_title, user_id, date) 
        VALUES (?, ?, ?);
    `, [topic_title, user_id, formattedDate], (err, result) => {
        if (err) {
            console.error('Hiba történt a téma hozzáadása közben:', err);
            return res.status(500).json({ error: "Hiba történt a téma hozzáadásakor" });
        }

        const newTopic = {
            topic_id: result.insertId,
            topic_title: topic_title,
            user_id: user_id,
            date: formattedDate,
        };
        console.log(newTopic);

        res.status(201).json(newTopic);
    });
};

const getComments = (req, res) => {
    const topicId = parseInt(req.params.topicId, 10);
    console.log(topicId);

    if (isNaN(topicId)) {
        return res.status(400).json({ error: 'Érvénytelen téma ID' });
    }

    db.query(`
        SELECT comments.comment, users.username 
        FROM comments
        JOIN users ON comments.user_id = users.user_id
        WHERE comments.topic_id = ?;
    `, [topicId], (err, results) => {
        if (err) {
            console.error('Hiba a kommentek lekérésekor:', err);
            return res.status(500).json({ error: 'Adatbázis hiba' });
        }

        res.json(results);
    });
};

const addComment = async (req, res) => {
    const { topic_id, comment } = req.body;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Nem vagy bejelentkezve" });
    }

    const user_id = req.user.id;

    if (!topic_id || !comment) {
        return res.status(400).json({ message: "Hiányzó kötelező mezők" });
    }

    try {
        await db.promise().query(
            "INSERT INTO comments (topic_id, comment, user_id) VALUES (?, ?, ?)",
            [topic_id, comment, user_id]
        );

        res.status(201).json({ message: "Komment sikeresen hozzáadva" });
    } catch (error) {
        console.error("Hiba a komment hozzáadásakor:", error);
        res.status(500).json({ message: "Hiba történt a komment hozzáadásakor", error: error.message });
    }
};

module.exports = { getAlltopics, getComments, addComment, uploadTopic }