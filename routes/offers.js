const express = require("express");
const fs = require("fs");
const path = require("path");
const cookie = require("../helpers/cookies");

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
    contact,
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
    "string",
  ];

  for (let i = 0; i < 9; i++) {
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
  newEntry.unshift(db.maxIndex + 1);

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

router.delete("/deleteOffer", async (req, res) => {
  const index = parseInt(req.query.id);
  console.log("DELETING OFFER: ", index);

  const dbPath = path.join(__dirname, "..", "db", "offers.json");
  const db = JSON.parse(
    fs.readFileSync(dbPath, "utf-8"),
  );

  const offerIndex = db.data.findIndex((entry) => entry[0] === index);
  if (offerIndex === -1) {
    return res.status(404).json({ error: "Offer not found" });
  }

  db.data.splice(offerIndex, 1);

  if (index == db.maxIndex);
  db.maxIndex -= 1;

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");

  res.status(200).json({ message: "Offer deleted" });
});

router.get("/getAcceptedOffers", async (req, res) => {
  console.log(req.originalUrl);
  const indexList = cookie.getCookie(req, "acceptedOffers") || [];

  const db = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "db", "offers.json"), "utf-8"),
  );

  const cars = indexList.map((id) => {
    const entry = db.data.find((row) => row[0] === id);
    if (!entry) return null;
    return Object.fromEntries(db.keys.map((key, i) => [key, entry[i]]));
  }).filter(Boolean); // filter boolean => prevents null if wrong index

  res.json(cars);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const db = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "db", "offers.json"), "utf-8"),
  );

  if (id > db.maxIndex || id < 0) {
    return res.status(400).json({ error: "wrong id" });
  }

  const offer = db.data.find((entry) => entry[0] === id);
  const offerObj = Object.fromEntries(
    db.keys.map((key, i) => [key, offer[i]]),
  );
  res.json(offerObj);
});

module.exports = router;
