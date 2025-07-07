const pool = require("../middelwares/bd");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const response = await pool.query("SELECT name, id FROM users");
    res.status(200).json(response.rows);
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

module.exports = router;
