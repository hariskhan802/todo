// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const todosRouter = require('./routes/todos');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;


app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));


app.use('/api/todos', todosRouter);


app.get('/health', (req, res) => res.json({ ok: true }));


app.listen(PORT, () => console.log(`Server running on  http://localhost:${PORT}`));