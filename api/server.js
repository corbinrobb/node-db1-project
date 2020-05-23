const express = require("express");
const accountRoutes = require('../routes/accountRouter');
const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());
server.use('/api/accounts', accountRoutes);


module.exports = server;
