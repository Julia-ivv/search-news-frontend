export default function clearLocalStorage(items) {
  items.forEach((elem) => {
    localStorage.removeItem(elem);
  })
};