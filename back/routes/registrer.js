const express = require("express");
const router = express.Router();
const pool = require("../middelwares/bd.js");
const bcrypt = require("bcrypt");

router.post("/as", async (req, res, next) => {
  try {
    const { name, mail, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "as";
    const response = await pool.query(
      "INSERT INTO users(name, mail, password, role) VALUES($1, $2, $3, $4)",
      [name, mail, hashedPassword, role]
    );
    res.status(201).json({ message: `${name} bien enregistré`, response });
  } catch (error) {
    res.status(500).json({ message: "Problème serveur dans as" });
  }
});

router.post("/client", async (req, res, next) => {
  try {
    const { name, mail, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "client";
    const isRegistrer = await pool.query(
      "SELECT * FROM users WHERE mail = $1",
      [mail]
    );
    if (isRegistrer.rows.length > 0) {
      res.status(400).json({ message: "Email déjà utilisé" });
    } else {
      const response = await pool.query(
        "INSERT INTO users(name, mail, password, role) VALUES($1, $2, $3, $4)",
        [name, mail, hashedPassword, role]
      );
      res.status(201).json({ message: `${name} bien enregistré` });
    }
  } catch (error) {
    res.status(500).json({ message: "Problème serveur dans client" });
  }
});

module.exports = router;
