import '../css/styles.css';

/* Переменные */

const loginForm = document.querySelector('#form-login');
const signupForm = document.querySelector('#form-signup');

const popupLogin = document.querySelector('#popup-login');
const popupSignup = document.querySelector('#popup-signup');
const popupSuccess = document.querySelector('#popup-success');
const popupMenu = document.querySelector('.popup-menu');

const authorizationButton = document.querySelector('.menu__btn-login');
const authorizationPopupButton = document.querySelector('.popup-menu__btn-login');
const closeButtons = document.querySelectorAll('.popup__close');
const signupLink = loginForm.querySelector('.popup__or-button');
const loginLink = signupForm.querySelector('.popup__or-button');
const loginButton = loginForm.querySelector('.popup__button');
const articlesGrid = document.querySelector('.articles');
const closePopupMenu = document.querySelector('.popup-menu__close');
const headerMenuOpenBtn = document.querySelector('.header__menu-open');

const menu = document.querySelector('.menu');

/* Функции */

// Открытие попапа
function popupOpen(popup) {
  popup.classList.add('popup_is-opened');
  if (window.screen.availWidth <= 320) headerMenuOpenBtn.classList.add('header__menu-open_hidden');
}

// Закрытие попапа
function popupClose(event) {
  event.target.closest('.popup').classList.remove('popup_is-opened');
  if (window.screen.availWidth <= 320) headerMenuOpenBtn.classList.remove('header__menu-open_hidden');
}

/* Слушатели событий */

authorizationButton.addEventListener('click', () => { // клик по кнопке Аторизоваться
  popupOpen(document.querySelector('#popup-login'));
  headerMenuOpenBtn.classList.add('header__menu-open_hidden');
});
authorizationPopupButton.addEventListener('click', () => { // клик по кнопке Авторизоваться в попапе
  popupMenu.classList.add('popup-menu_hidden');
  popupOpen(document.querySelector('#popup-login'));
});
closeButtons.forEach((el) => el.addEventListener('click', popupClose));
loginForm.addEventListener('submit', (event) => event.preventDefault());
signupForm.addEventListener('submit', (event) => event.preventDefault());
signupForm.querySelector('.popup__button').addEventListener('click', (event) => { // Зарегистрироваться
  popupClose(event);
  popupOpen(popupSuccess);
});
popupSuccess.querySelector('.popup__login-button').addEventListener('click', (event) => { // кнопка Войти при успешной регистрации
  popupClose(event);
  popupOpen(popupLogin);
});
signupLink.addEventListener('click', (event) => { // ссылка Зарегистрироваться
  popupClose(event);
  popupOpen(popupSignup);
});
loginLink.addEventListener('click', (event) => { // ссылка Войти
  popupClose(event);
  popupOpen(popupLogin);
});
loginButton.addEventListener('click', (event) => { //кнопка Авторизоваться
  popupClose(event);
  const loginBtn = menu.querySelector('.menu__btn-login');
  if (loginBtn.textContent.trim() === 'Авторизоваться') {
    menu.querySelector('#articles-menu').classList.remove('menu__link_hidden');
    loginBtn.textContent = 'Грета';
    const icon = new Image();
    icon.src = 'images/logout-white.svg';
    icon.classList.add('menu__btn-icon');
    loginBtn.appendChild(icon);
  } else {
    menu.querySelector('#articles-menu').classList.add('menu__link_hidden');
    menu.querySelector('.menu__btn-icon').classList.add('menu__btn-icon_hidden');
    loginBtn.textContent = 'Авторизоваться';
  }
});
articlesGrid.addEventListener('click', (event) => {
  const currentIcon = event.target;
  if (currentIcon.classList.contains('article__icon_type_bookmark')) currentIcon.style.backgroundImage = 'url(images/bookmark-marked.svg)';
});
closePopupMenu.addEventListener('click', () => {
  popupMenu.classList.add('popup-menu_hidden');
});
headerMenuOpenBtn.addEventListener('click', () => {
  popupMenu.classList.remove('popup-menu_hidden');
});

window.addEventListener('scroll', () => {
  if (window.screen.availWidth <= 320) {
    const headerElem = document.querySelector('.header_style_black');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop === 0) headerElem.style.backgroundColor = 'rgba(196, 196, 196, .01)';
    else headerElem.style.backgroundColor = 'rgb(1, 24, 1)';
  }
});
