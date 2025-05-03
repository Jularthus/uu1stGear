const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/getRandomCar", async (req, res) => {
  console.log(req.originalUrl);

  const db = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "db", "offers.json"), "utf-8"),
  );
  const maxIndex = db.maxIndex;

  const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
  const offer = db.data.find((entry) => entry[0] === randomIndex);
  const offerObj = Object.fromEntries(
    db.keys.map((key, i) => [key, offer[i]]),
  );
  console.log("Random offer:", offerObj);
  res.json(offerObj);
});

router.post("/reviewCar", async (req, res) => {
  const db = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "db", "offers.json"), "utf-8"),
  );

  const offer = db.data.find((entry) => entry[0] === parseInt(req.query.id));
  if (!offer) return res.status(404).json({ error: "Offer not found" });

  console.log(offer);

  res.json({});
});

module.exports = router;
