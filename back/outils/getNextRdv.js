const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // dimanche ou samedi
};

const sameDay = (d1, d2) =>
  d1.getDate() === d2.getDate() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getFullYear() === d2.getFullYear();

const getNextRdv = (rdvs, duration) => {
  // Nettoyer et trier
  const now = new Date();
  const futureRdvs = rdvs
    .map((rdv) => ({
      ...rdv,
      date: new Date(rdv.year, rdv.month - 1, rdv.day, rdv.hour),
    }))
    .filter((rdv) => rdv.date > now)
    .sort((a, b) => a.date - b.date);

  let currentDate = new Date();
  currentDate.setHours(8, 0, 0, 0); // commence à 8h

  while (true) {
    // Sauter les weekends
    if (isWeekend(currentDate)) {
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(8, 0, 0, 0);
      continue;
    }

    // Créneaux de travail
    const slots = [8, 9, 10, 11, 13, 14, 15]; // heure de début possible

    for (let hour of slots) {
      const start = new Date(currentDate);
      start.setHours(hour);

      const end = new Date(start);
      end.setHours(start.getHours() + duration);

      const overlap = futureRdvs.some((rdv) => {
        const rdvStart = rdv.date;
        const rdvEnd = new Date(rdvStart);
        rdvEnd.setHours(rdvEnd.getHours() + rdv.duration);

        return (
          sameDay(rdv.date, start) &&
          ((start >= rdvStart && start < rdvEnd) ||
            (end > rdvStart && end <= rdvEnd) ||
            (start <= rdvStart && end >= rdvEnd))
        );
      });

      if (!overlap) {
        return {
          year: start.getFullYear(),
          month: start.getMonth() + 1,
          day: start.getDate(),
          hour: start.getHours(),
        };
      }
    }

    // Aucun créneau aujourd'hui, on passe au lendemain
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(8, 0, 0, 0);
  }
};

module.exports = getNextRdv;
