const express = require("express");
const router = express.Router();
const pool = require("../middelwares/bd");

//Avoir les infos du client
router.get("/", async (req, res, next) => {
  try {
    const { id } = req.user;
    const response = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    res.status(200).send(response.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
