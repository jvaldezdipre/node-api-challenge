const express = require('express');

const projectRouter = require('./projects/projectRouter');
const actionsRouter = require('./actions/actionsRouter');

const server = express();

server.use(express.json());
server.use('/api/projects', projectRouter);
server.use('/api/actions', actionsRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Work please!</h2>`);
});

module.exports = server;
