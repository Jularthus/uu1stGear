const express = require("express");
const fs = require("fs");
const path = require("path");
const cookie = require("../helpers/cookies");

const router = express.Router();

router.get("/getRandomCar", async (req, res) => {
  console.log(req.originalUrl);

  console.log(`COOKIES: ${req.cookies}`);

  const db = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "db", "offers.json"), "utf-8"),
  );
  const maxIndex = db.maxIndex;
  const reviewed = (cookie.getCookie(req, "acceptedOffers") || []).concat(
    cookie.getCookie(req, "refusedOffers") || [],
  );

  let randomIndex;
  let tries = 0;
  do {
    randomIndex = Math.floor(Math.random() * (maxIndex + 1));
    tries++;
    if (tries > maxIndex * maxIndex) {
      return res.status(400).json({
        error: "Error, all cars have been reviewed",
      });
    }
  } while (reviewed.includes(randomIndex));

  const offer = db.data.find((entry) => entry[0] === randomIndex);
  const offerObj = Object.fromEntries(
    db.keys.map((key, i) => [key, offer[i]]),
  );
  console.log("Random offer:", offerObj);
  res.json(offerObj);
});

router.post("/reviewCar", async (req, res) => {
  console.log(req.originalUrl);

  const db = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "db", "offers.json"), "utf-8"),
  );

  const offer = db.data.find((entry) => entry[0] === parseInt(req.query.id));
  if (!offer) return res.status(404).json({ error: "Offer not found" });

  const status = parseInt(req.query.status);
  const cookieName = status == 1 ? "acceptedOffers" : "refusedOffers";
  const otherCookie = status == 0 ? "acceptedOffers" : "refusedOffers";

  let reviewed = cookie.getCookie(req, cookieName) || [];
  let otherList = cookie.getCookie(req, otherCookie) || [];

  console.log(otherList);

  if (!(reviewed.includes(offer[0]) || otherList.includes(offer[0]))) {
    reviewed.push(offer[0]);
  }

  cookie.setCookie(res, cookieName, reviewed, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  console.log(offer);

  res.json(offer);
});

module.exports = router;
