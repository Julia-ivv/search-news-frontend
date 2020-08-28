import '../../css/articles.css';

import Header from '../components/Header';

const headerMenuOpenBtn = document.querySelector('.header__menu-open');
const closePopupMenu = document.querySelector('.popup-menu__close');
const closeButtons = document.querySelectorAll('.popup__close');
const popupMenu = document.querySelector('.popup-menu');

const HeaderClass = new Header({
  headerTemplate: document.querySelector('#header'),
  parentElement: document.querySelector('.root'),
  beforeElement: document.querySelector('.articles-info'),
  headerColor: 'white',
});

HeaderClass.render({
  isLoggedIn: true,
  userName: 'User',
});

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
