const express = require("express");
const router = express.Router();
const pool = require("../middelwares/bd");

//Avoitr les infos du client
router.get("/", async (req, res, next) => {
  try {
    const { id } = req.user;
    console.log(id);
    const response = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const responseJson = await response.rows.json();
    res.status(200).send(responseJson);
  } catch (error) {
    console.log("Erreur niveau get client : " + error);
    res.status(500).json({ message: error });
  }
});

module.exports = router;
