import '../css/styles.css';

import Header from './components/Header';
import Popup from './components/Popup';

/* Переменные */
const isMobile = window.screen.availWidth <= 320;

const signinForm = document.querySelector('#form-signin');
const signupForm = document.querySelector('#form-signup');

const popupSignin = document.querySelector('#popup-signin');
const popupSignup = document.querySelector('#popup-signup');
const popupSuccess = document.querySelector('#popup-success');
const popupMenu = document.querySelector('.popup-menu');

const closeSigninButton = popupSignin.querySelector('.popup__close');
const closeSignupButton = popupSignup.querySelector('.popup__close');
const closeSuccessButton = popupSuccess.querySelector('.popup__close');
const closePopupMenu = document.querySelector('.popup-menu__close');

const authorizationButton = document.querySelector('.menu__btn-login');
const authorizationPopupButton = document.querySelector('.popup-menu__btn-login');
// const closeButtons = document.querySelectorAll('.popup__close');

const signupLink = popupSignin.querySelector('.popup__or-button');
const signinLink = popupSignup.querySelector('.popup__or-button');
const loginButton = signinForm.querySelector('.popup__button');
const articlesGrid = document.querySelector('.articles');
const headerMenuOpenBtn = document.querySelector('.header__menu-open');

const menu = document.querySelector('.menu');

// let isLoggedIn = !!localStorage.getItem(isLoggedIn);
// let userName = localStorage.getItem(userName) || '';

// const authorizationListener = isLoggedIn
//   ? () => logout()
//   : () => popupOpen(document.querySelector('#popup-login'));
// const popupMenuOpenListener = () => document.querySelector('.popup-menu').classList.remove('popup-menu_hidden');
// const popupMenuCloseListener = () => document.querySelector('.popup-menu').classList.add('popup-menu_hidden');

const HeaderClass = new Header({
  // headerTemplate: document.querySelector('#header'),
  // parentElement: document.querySelector('.main-picture'),
  // beforeElement: document.querySelector('.search'),
  headerColor: 'black',
  // eventListeners: [
    // {
    //   event: 'click',
    //   elementClass: '.menu__btn-login',
    //   listener: authorizationListener,
    // },
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
const popupSigninClass = new Popup({ popup: popupSignin });
const popupSignupClass = new Popup({ popup: popupSignup });
const popupSuccessClass = new Popup({ popup: popupSuccess });

HeaderClass.render({ isLoggedIn: localStorage.getItem('news'), userName: localStorage.getItem('userName') });

/* Функции */

// Открытие попапа
// function popupOpen(popup) {
//   popup.classList.add('popup_is-opened');
//   if (window.screen.availWidth <= 320) headerMenuOpenBtn.classList.add('header__menu-open_hidden');
// }

// Закрытие попапа
// function popupClose(event) {
//   event.target.closest('.popup').classList.remove('popup_is-opened');
//   if (window.screen.availWidth <= 320) headerMenuOpenBtn.classList.remove('header__menu-open_hidden');
// }

// показать кнупку меню для 320px
function showMobileMenu() {
  headerMenuOpenBtn.classList.remove('header__menu-open_hidden');
};

// скрыть кнопку меню для 320px
function hideMobileMenu() {
  headerMenuOpenBtn.classList.add('header__menu-open_hidden');
}

// Выйти из личного кабинета
function logout() {
  localStorage.removeItem('news');
  localStorage.removeItem('userName');
  if (isMobile) showMobileMenu();
  HeaderClass.render({ isLoggedIn: false, userName: '' });
};

// Авторизоваться
function login() {
  // popupOpen(document.querySelector('#popup-login'));
  popupSigninClass.open();
  if (isMobile) hideMobileMenu();
};

function loginLogout() {
  if (!localStorage.getItem('news')) login()
  else logout();
};

/* Слушатели событий */

authorizationButton.addEventListener('click', () => { // клик по кнопке Аторизоваться/выход
  loginLogout();
});
authorizationPopupButton.addEventListener('click', () => { // клик по кнопке Авторизоваться/выход на 320px
  popupMenu.classList.add('popup-menu_hidden');
  if (isMobile) hideMobileMenu();
  loginLogout();
});

// Попап Вход
loginButton.addEventListener('click', () => { //кнопка Войти
  popupSigninClass.close();
  showMobileMenu();
  localStorage.setItem('news', 'JWT');
  localStorage.setItem('userName', 'Name');
  HeaderClass.render({ isLoggedIn: true, userName: 'Name' });
});
closeSigninButton.addEventListener('click', () => { // кнопка закрыть
  popupSigninClass.close();
  if (isMobile) showMobileMenu();
});
signupLink.addEventListener('click', () => { // ссылка Зарегистрироваться
  popupSigninClass.close();
  popupSignupClass.open();
});

// Попап Регистрация
signupForm.querySelector('.popup__button').addEventListener('click', (event) => { // кнопка Зарегистрироваться
  popupSignupClass.close();
  popupSuccessClass.open();
});
closeSignupButton.addEventListener('click', () => {
  popupSignupClass.close();
  if (isMobile) showMobileMenu();
});
signinLink.addEventListener('click', (event) => { // ссылка Войти
  popupSignupClass.close();
  popupSigninClass.open();
});

// Попап успешной регистрации
closeSuccessButton.addEventListener('click', () => {
  popupSuccessClass.close();
  if (isMobile) showMobileMenu();
});
popupSuccess.querySelector('.popup__login-button').addEventListener('click', (event) => { // кнопка Войти при успешной регистрации
  popupSuccessClass.close();
  popupSigninClass.open();
});

signinForm.addEventListener('submit', (event) => event.preventDefault());
signupForm.addEventListener('submit', (event) => event.preventDefault());

articlesGrid.addEventListener('click', (event) => {
  const currentIcon = event.target;
  if (currentIcon.classList.contains('article__icon_type_bookmark')) currentIcon.style.backgroundImage = 'url(images/bookmark-marked.svg)';
});

// Закрыть и открыть меню на 320px
closePopupMenu.addEventListener('click', () => {
  popupMenu.classList.add('popup-menu_hidden');
});
headerMenuOpenBtn.addEventListener('click', () => {
  popupMenu.classList.remove('popup-menu_hidden');
});

// Убрать прозрачный хедер при скроле на 320px
window.addEventListener('scroll', () => {
  if (window.screen.availWidth <= 320) {
    const headerElem = document.querySelector('.header_style_black');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop === 0) headerElem.style.backgroundColor = 'rgba(196, 196, 196, .01)';
    else headerElem.style.backgroundColor = 'rgb(1, 24, 1)';
  }
});
