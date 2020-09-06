export default function dateFormating(date) {
  const optionsDayMonth = { weekday: undefined, year: undefined, month: 'long', day: 'numeric' };
  const optionsYear = { weekday: undefined, year: 'numeric', month: undefined, day: undefined };
  const newDate = new Date(Date.parse(date));
  return newDate.toLocaleDateString('ru', optionsDayMonth) + ', ' + newDate.toLocaleDateString('ru', optionsYear);
}