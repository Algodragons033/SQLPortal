const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/evaluate', (req, res) => {
    const userQuery = req.body.query;

    let db = new sqlite3.Database(':memory:');

    db.serialize(() => {
        db.run('CREATE TABLE test (id INT, name TEXT)');
        db.run('INSERT INTO test (id, name) VALUES (1, "John"), (2, "Jane")');

        db.all(userQuery, (err, rows) => {
            if (err) {
                res.status(400).send({ error: 'Invalid SQL Query' });
                return;
            }
            res.send(rows);
        });
    });

    db.close();
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
