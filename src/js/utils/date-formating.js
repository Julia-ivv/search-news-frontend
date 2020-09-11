function dateFormatingForCards(date) {
  const optionsDayMonth = { weekday: undefined, year: undefined, month: 'long', day: 'numeric' };
  const optionsYear = { weekday: undefined, year: 'numeric', month: undefined, day: undefined };
  const newDate = new Date(Date.parse(date));
  // const newDate = new Date(date);
  return newDate.toLocaleDateString('ru', optionsDayMonth) + ', ' + newDate.toLocaleDateString('ru', optionsYear);
};

function dateFormatingForSearch(date) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;
  return `${year}-${month}-${day}`;
};

export { dateFormatingForCards, dateFormatingForSearch };
