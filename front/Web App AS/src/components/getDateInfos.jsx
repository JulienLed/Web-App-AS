const getDateInfos = (date) => {
  const dateToAnalyse = new Date(date);
  const day = dateToAnalyse.getDate();
  const month = dateToAnalyse.getMonth();
  const year = dateToAnalyse.getFullYear();
  const hours = dateToAnalyse.getHours();
  const minutes = dateToAnalyse.getMinutes();
  const dateToReturn = `Le ${day}/${month}/${year} à ${hours}h0${minutes}`;
  return dateToReturn;
};

export default getDateInfos;
