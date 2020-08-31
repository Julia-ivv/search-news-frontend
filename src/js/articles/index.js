import '../../css/articles.css';

import Header from '../components/Header';

const headerMenuOpenBtn = document.querySelector('.header__menu-open');
const closePopupMenu = document.querySelector('.popup-menu__close');
// const closeButtons = document.querySelectorAll('.popup__close');
const popupMenu = document.querySelector('.popup-menu');

const authorizationButton = document.querySelector('.menu__btn-login');
const authorizationPopupButton = document.querySelector('.popup-menu__btn-login');

// let isLoggedIn = true;
// let userName = 'Name';
// const authorizationListener = () => logout();
// const popupMenuOpenListener = () => document.querySelector('.popup-menu').classList.remove('popup-menu_hidden');
// const popupMenuCloseListener = () => document.querySelector('.popup-menu').classList.add('popup-menu_hidden');

const HeaderClass = new Header({
  // headerTemplate: document.querySelector('#header'),
  // parentElement: document.querySelector('.root'),
  // beforeElement: document.querySelector('.articles-info'),
  headerColor: 'white',
  // eventListeners: [
  //   {
  //     event: 'click',
  //     elementClass: '.menu__btn-login',
  //     listener: authorizationListener,
  //   },
  //   {
  //     event: 'click',
  //     elementClass: '.popup-menu__btn-login',
  //     listener: authorizationListener,
  //   },
  //   {
  //     event: 'click',
  //     elementClass: '.header__menu-open',
  //     listener: popupMenuOpenListener,
  //   },
  //   {
  //     event: 'click',
  //     elementClass: '.popup-menu__close',
  //     listener: popupMenuCloseListener,
  //   },
  // ],
  headerElement: document.querySelector('.header'),
});

/* Функции */

// Закрытие попапа
// function popupClose(event) {
//   event.target.closest('.popup').classList.remove('popup_is-opened');
// }

function firstRender() {
  if (!localStorage.getItem('news')) document.location.href = './index.html'
  else HeaderClass.render({ isLoggedIn: localStorage.getItem('news'), userName: localStorage.getItem('userName') });
}

// Выйти из личного кабинета
function logout() {
  // isLoggedIn = false;
  // userName = '';
  document.location.href = './index.html';
  localStorage.removeItem('news');
  localStorage.removeItem('userName');
  //HeaderClass.render({ isLoggedIn: false, userName: '' });
}

/* Слушатели событий */

authorizationButton.addEventListener('click', () => { // клик по кнопке Аторизоваться
  logout();
});

authorizationPopupButton.addEventListener('click', () => { // клик по кнопке Авторизоваться в попапе
  // popupMenu.classList.add('popup-menu_hidden');
  logout();
});

headerMenuOpenBtn.addEventListener('click', () => {
  popupMenu.classList.remove('popup-menu_hidden');
});
closePopupMenu.addEventListener('click', () => {
  popupMenu.classList.add('popup-menu_hidden');
});
// closeButtons.forEach((el) => el.addEventListener('click', popupClose));

/* Вызовы функций */

firstRender();