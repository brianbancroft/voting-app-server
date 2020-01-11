const express = require("express");
const app = express();
const port = 3000;

const requestsArray = [];

app.get("/results", (req, res) => {
  const response = `Number of hits to hello world: ${requestsArray.length}`;

  res.status(200).send(response);
});

app.get("/", (req, res) => {
  requestsArray.push("item");
  res.status(200).send("Hello World!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
