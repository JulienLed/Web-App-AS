const getNextRdv = (arr) => {
  const dateToCheck = new Date().getDay();
  if (dateToCheck === 0 || dateToCheck === 6) {
    dateToCheck = 1;
  }
};

module.exports = getNextRdv;

// Récupérer la date actuelle

// Si c’est un weekend → sauter au prochain jour ouvré

// Regarder la première date de RDV de l’AS

// Si aucun RDV ce jour → proposer 8h

// Sinon, on vérifie entre 8h et le 1er RDV :

// Si assez de place → proposer à 8h

// Sinon, avancer l’heure au fin du 1er RDV

// Vérifier si on a encore de la place avant midi

// Si oui → proposer ce créneau

// Sinon, passer à 13h

// Et vérifier si ça rentre avant 16h

// Sinon → passer au jour suivant (et rebelote)
