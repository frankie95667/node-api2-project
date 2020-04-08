const express = require('express');
const server = express();
const posts = require('./api/posts');
const cors = require('cors');
const PORT = 5000;

server.use(express.json());
server.use(cors());
server.use('/api/posts', posts);


server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})