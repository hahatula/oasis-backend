const express = require('express');

//change port to 3001 to run locally
//change port to 3000 for deploy
const { PORT = 3001 } = process.env;
const app = express();

app.listen(PORT, () => {
    console.log("Link to the server");
  });