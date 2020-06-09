const { PORT = 3000 } = process.env;
require("dotenv").config();

const express = require("express");
const server = express();
const apiRouter = require("./api");

const bodyParser = require("body-parser");
const morgan = require("morgan");
const { client } = require("./db");
client.connect();
server.use(bodyParser.json());

server.use(morgan("dev"));

server.use("/api", apiRouter);

server.use((req, res, next) => {
  next();
});

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});
