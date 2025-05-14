const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin);
    },
    credentials: true,
  }),
);

app.get("/health", (req, res) => {
  res.send("<h1>I am OK!</h1>");
});

app.use("/offers", require("./routes/offers"));
app.use("/review", require("./routes/review"));

app.listen(3001, () => {
  console.log("Hello! Server is running on port 3001");
});
