const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.post("/create", async (req, res) => {
  console.log(req.originalUrl);

  const {
    model,
    mileage,
    hp,
    fuelType,
    manualTrans,
    firstRegistration,
    featurePack,
    price,
  } = req.body;

  // CREATE OFFER
  const dbPath = path.join(__dirname, "..", "db", "offers.json");
  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  const newEntry = db.keys.slice(1).map((key) => {
    return eval(key);
  });

  // CHECK TYPES
  let types = [
    "string",
    "number",
    "number",
    "string",
    "boolean",
    "number",
    "object",
    "number",
  ];

  for (let i = 0; i < 8; i++) {
    console.log(typeof (newEntry[i]));
    if (typeof newEntry[i] != types[i]) {
      res.status(400).json("A type error happened");
      console.log("[ERROR] A type error happened");
      return;
    }
  }

  // CHECK VALUES
  if (
    // mileage or power negatives
    newEntry[1] < 0 ||
    newEntry[2] < 0 ||
    // unallowed fuel type
    !(["Petrol", "Diesel", "Electric", "Hybrid"].includes(newEntry[3])) ||
    // feature list contains anything that isnt a string
    !(
      Array.isArray(newEntry[6]) &&
      newEntry[6].every((item) => typeof item === "string")
    )
  ) {
    res.status(400).json("Values error (eg. mileage < 0)");
    console.log("[ERROR] Values error (eg. mileage < 0)");
    return;
  }

  // give actual index to new entry
  newEntry.unshift(db.maxIndex);

  // push new element in the db
  db.data.push(newEntry);
  console.log(newEntry);

  // allow easier testing as no car is named test
  if (!(newEntry[1] === "test")) {
    db.maxIndex += 1;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
  }

  // return index of new created offer
  res.json(newEntry[0]);
});

module.exports = router;
