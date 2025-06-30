const express = require("express");
const router = express.Router();
const getNextRdv = require("../outils/getNextRdv.js");

// Créer un nouveau rdv
router.post("/", async (req, res, next) => {
  try {
    const { clientId, description, theme } = req.body;
    const duration = 1;
    switch (theme) {
      case "Bilan budgétaire":
        duration = 2;
        break;
      case "Visite à domicile":
        duration = 3;
        break;
      default:
        duration = 1;
        break;
    }
    // Logique de chois d'un AS au hasard
    const responseAs = await pool.query(
      "SELECT * FROM users WHERE role = as ORDER BY RANDOM() LIMIT 1"
    );
    const asId = await responseAs.id;
    // Obtenir tout les rdv futurs de l'AS par ordre croissant
    const responseRDV = await pool.query(
      "SELECT * FROM rdv WHERE id = $1 AND date >= NOW() ORDER BY date ASC",
      [asId]
    );
    const rdvs = responseRDV.rows;
    // Définir le prochain crénau de libre
    const newRdv = getNextRdv(rdvs, duration);
    const responseNewRdv = await pool.query(
      "INSERT INTO rdv(description, theme, date, duration, id_as, id_client) VALUES($1, $2, $3, $4, $5, $6)",
      [description, theme, newRdv, duration, asId, clientId]
    );
    res
      .status(201)
      .json({ description, theme, newRdv, duration, asId, clientId });
  } catch (error) {
    console.log("Erreur dans la création du rdv: " + error);
    res.status(500).json({ message: error });
  }
});

// Get les rdvs pas client
router.get("/:idClient", async (req, res, next) => {
  try {
    response = await pool.query(
      "SELECT id, date FROM rdv INNER JOIN users ON rdv.id_client = users.id"
    );
    const rdvByClient = response.rows;
    res.status(200).json({ rdvByClient });
  } catch (error) {
    console.log("Erreur dans le get des rdvs clients : " + error);
    res.status(500).json({ message: error });
  }
});

//Modifier un rdv par id
router.put("/:rdvId", async (req, res, next) => {
  try {
    const { clientId, description, theme, date } = req.body;
    const { rdvId } = req.params;
    const duration = 1;
    switch (theme) {
      case "Bilan budgétaire":
        duration = 2;
        break;
      case "Visite à domicile":
        duration = 3;
        break;
      default:
        duration = 1;
        break;
    }
    const response = await pool.query(
      "UPDATE rdv SET description = $1, theme = $2, date = $3, duration = $4 WHERE id = $5 AND id_client = $6",
      [description, theme, date, duration, rdvId, clientId]
    );
    res.status(201).json({ rdvId });
  } catch (error) {
    console.log("Erreur dans la modif du rdv : " + error);
    res.status(500).json({ message: error });
  }
});

//Delete un rdv par id
router.delete("/rdvId", async (req, res, next) => {
  try {
    const { rdvId } = req.params;
    const response = await pool.query("DELETE * FROM rdv WHERE id = $1", [
      rdvId,
    ]);
    res.status(204).json({ rdvId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

module.exports = router;
