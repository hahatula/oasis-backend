const express = require('express');

const { MONGO_URI } = process.env;
mongoose.connect(MONGO_URI);
//change port to 3001 to run locally
//change port to 3000 for deploy
const { PORT = 3001 } = process.env;
const app = express();

app.use("/", require("./routes/index"));

app.listen(PORT, () => {
  console.log('Link to the server');
});
