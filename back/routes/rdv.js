const express = require("express");
const router = express.Router();
const getNextRdv = require("../outils/getNextRdv.js");
const pool = require("../middelwares/bd.js");

router.post("/", async (req, res, next) => {
  try {
    const { description, theme } = req.body;
    const clientId = req.user.id;
    let duration = 1;
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

    // Choisir AS au hasard
    const responseAs = await pool.query(
      "SELECT * FROM users WHERE role = $1 ORDER BY RANDOM() LIMIT 1",
      ["as"]
    );
    const asId = responseAs.rows[0].id;

    // Récupérer tous les rdvs futurs de cet AS ET du client (on veut éviter chevauchement avec l'un ou l'autre)
    const responseRDV = await pool.query(
      "SELECT * FROM rdv WHERE (id_as = $1 OR id_client = $2) AND date >= NOW() ORDER BY date ASC",
      [asId, clientId]
    );
    const rdvs = responseRDV.rows;

    // Trouver prochain créneau libre
    const rdvObj = getNextRdv(rdvs, duration);
    const newStart = new Date(
      Date.UTC(rdvObj.year, rdvObj.month - 1, rdvObj.day, rdvObj.hour)
    );
    const newEnd = new Date(newStart.getTime() + duration * 60 * 60 * 1000);

    // Vérifier chevauchement (au cas où getNextRdv ne serait pas fiable à 100%)
    const overlap = rdvs.some((rdv) => {
      const rdvStart = new Date(rdv.date);
      const rdvEnd = new Date(
        rdvStart.getTime() + rdv.duration * 60 * 60 * 1000
      );
      return newStart < rdvEnd && rdvStart < newEnd;
    });

    if (overlap) {
      return res
        .status(400)
        .json({ message: "Un rendez-vous chevauche ce créneau." });
    }

    // Insérer le rdv
    await pool.query(
      "INSERT INTO rdv(description, theme, date, duration, id_as, id_client) VALUES($1, $2, $3, $4, $5, $6)",
      [description, theme, newStart, duration, asId, clientId]
    );

    res
      .status(201)
      .json({ description, theme, date: newStart, duration, asId, clientId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get les rdvs par client
router.get("/rdvs", async (req, res, next) => {
  try {
    response = await pool.query(
      "SELECT rdv.id, rdv.date, rdv.duration, rdv.theme, rdv.id_as FROM rdv INNER JOIN users ON rdv.id_client = users.id WHERE rdv.id_client =$1",
      [req.user.id]
    );
    const rdvsByClient = response.rows;
    res.status(200).json(rdvsByClient);
  } catch (error) {
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
    await pool.query(
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
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM rdv WHERE id = $1", [id]);
    res.status(204).send("Entrée effacée");
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
