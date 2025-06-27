const express = require("express");
const router = express.Router();

// Créer un nouveau rdv
router.post("/", async (req, res, next) => {
  try {
    const { description, theme } = req.body;
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
    // Définir le prochain crénau de libre **************************************************************
    rdvs.map();
  } catch (error) {
    console.log("Erreur dans la création du rdv: " + error);
  }
});

module.exports = router;
