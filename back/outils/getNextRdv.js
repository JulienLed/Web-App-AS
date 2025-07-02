const isWeekend = (date) => {
  const day = date.getUTCDay();
  return day === 0 || day === 6; // dimanche ou samedi
};

const sameDay = (d1, d2) =>
  d1.getUTCDate() === d2.getUTCDate() &&
  d1.getUTCMonth() === d2.getUTCMonth() &&
  d1.getUTCFullYear() === d2.getUTCFullYear();

const getNextRdv = (rdvs, duration) => {
  const now = new Date();

  // Filtrer les rdvs futurs et trier
  const futureRdvs = rdvs
    .map((rdv) => ({
      ...rdv,
      date: new Date(rdv.date),
      duration: Number(rdv.duration),
    }))
    .filter((rdv) => rdv.date > now)
    .sort((a, b) => a.date - b.date);

  futureRdvs.forEach((rdv) => {
    const rdvEnd = new Date(rdv.date.getTime() + rdv.duration * 60 * 60 * 1000);
  });

  // Démarrer à 6h UTC aujourd'hui
  let currentDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      6,
      0,
      0,
      0
    )
  );

  // Si on est déjà passé après 6h UTC, passer au lendemain
  if (now >= currentDate) {
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  const slots = [6, 7, 8, 9, 11, 12, 13]; // heures UTC possibles (8h,9h,10h,11h,13h,14h,15h locales)
  const maxEndHour = 16; // heure max (UTC) à ne pas dépasser (ex: 16h UTC = 18h locale)

  while (true) {
    if (isWeekend(currentDate)) {
      console.log("⛔ Weekend, on saute:", currentDate.toISOString());
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      currentDate.setUTCHours(6, 0, 0, 0);
      continue;
    }

    for (let hour of slots) {
      const start = new Date(currentDate);
      start.setUTCHours(hour, 0, 0, 0);

      const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

      if (end.getUTCHours() > maxEndHour) {
        continue; // Ce créneau ne convient pas, on saute
      }

      // Vérifier overlap
      const overlap = futureRdvs.some((rdv) => {
        const rdvStart = rdv.date;
        const rdvEnd = new Date(
          rdvStart.getTime() + rdv.duration * 60 * 60 * 1000
        );

        const isOverlap = start < rdvEnd && rdvStart < end;

        if (isOverlap) {
        }
        return isOverlap;
      });

      if (!overlap) {
        return {
          year: start.getUTCFullYear(),
          month: start.getUTCMonth() + 1,
          day: start.getUTCDate(),
          hour: start.getUTCHours(),
        };
      }
    }

    // Pas de créneau aujourd'hui, on passe au lendemain
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    currentDate.setUTCHours(6, 0, 0, 0);
  }
};

module.exports = getNextRdv;
