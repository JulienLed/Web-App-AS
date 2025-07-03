const pool = require("../middelwares/bd");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const response = await pool.query("SELECT name, id FROM users");
    console.log("Liste d'AS trouvée");
    res.status(200).json(response.rows);
  } catch (error) {
    console.log("Erreur dans le getAs back : " + error);
    res.status(500).send({ message: error });
  }
});

module.exports = router;
