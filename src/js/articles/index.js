import '../../css/articles.css';

const headerMenuOpenBtn = document.querySelector('.header__menu-open');
const closePopupMenu = document.querySelector('.popup-menu__close');
const closeButtons = document.querySelectorAll('.popup__close');
const popupMenu = document.querySelector('.popup-menu');

/* Функции */

// Закрытие попапа
function popupClose(event) {
  event.target.closest('.popup').classList.remove('popup_is-opened');
}

/* Слушатели событий */

headerMenuOpenBtn.addEventListener('click', () => {
  popupMenu.classList.remove('popup-menu_hidden');
});
closePopupMenu.addEventListener('click', () => {
  popupMenu.classList.add('popup-menu_hidden');
});
closeButtons.forEach((el) => el.addEventListener('click', popupClose));
