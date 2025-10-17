const express = require('express');
const db = require('../db');
const router = express.Router();


// GET /api/todos
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM todos ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});


// POST /api/todos
router.post('/', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || !title.trim()) return res.status(400).json({ error: 'Title required' });
        const result = await db.query(
            'INSERT INTO todos (title, completed, created_at) VALUES ($1, $2, NOW()) RETURNING *',
            [title.trim(), false]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});


// PUT /api/todos/:id
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { title, completed } = req.body;


        const fields = [];
        const values = [];
        let idx = 1;


        if (typeof title === 'string') {
            fields.push(`title = $${idx++}`);
            values.push(title.trim());
        }
        if (typeof completed === 'boolean') {
            fields.push(`completed = $${idx++}`);
            values.push(completed);
        }


        if (fields.length === 0) return res.status(400).json({ error: 'Nothing to update' });


        values.push(id);
        const query = `UPDATE todos SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
        const result = await db.query(query, values);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});


// DELETE /api/todos/:id
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const result = await db.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});


module.exports = router;