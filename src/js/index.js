import '../css/styles.css';

/* Переменные */

const loginForm = document.querySelector('#form-login');
const signupForm = document.querySelector('#form-signup');

const popupLogin = document.querySelector('#popup-login');
const popupSignup = document.querySelector('#popup-signup');
const popupSuccess = document.querySelector('#popup-success');

const authorizationButton = document.querySelector('.menu__btn-login');
const closeButtons = document.querySelectorAll('.popup__close');
const signupLink = loginForm.querySelector('.popup__or-button');
const loginLink = signupForm.querySelector('.popup__or-button');
const loginButton = loginForm.querySelector('.popup__button');
const articlesGrid = document.querySelector('.articles');

const menu = document.querySelector('.menu');

/* Функции */

// Открытие попапа
function popupOpen(popup) {
  popup.classList.add('popup_is-opened');
}

// Закрытие попапа
function popupClose(event) {
  event.target.closest('.popup').classList.remove('popup_is-opened');
}

authorizationButton.addEventListener('click', () => {
  popupOpen(document.querySelector('#popup-login'));
});

/* Слушатели событий */

closeButtons.forEach((el) => el.addEventListener('click', popupClose));
loginForm.addEventListener('submit', (event) => event.preventDefault());
signupForm.addEventListener('submit', (event) => event.preventDefault());
signupForm.querySelector('.popup__button').addEventListener('click', (event) => {
  popupClose(event);
  popupOpen(popupSuccess);
});
popupSuccess.querySelector('.popup__login-button').addEventListener('click', (event) => {
  popupClose(event);
  popupOpen(popupLogin);
});
signupLink.addEventListener('click', (event) => {
  popupClose(event);
  popupOpen(popupSignup);
});
loginLink.addEventListener('click', (event) => {
  popupClose(event);
  popupOpen(popupLogin);
});
loginButton.addEventListener('click', (event) => {
  popupClose(event);
  menu.querySelector('#articles').classList.remove('menu__link_hidden');
  menu.querySelector('.menu__btn-icon').classList.remove('menu__btn-icon_hidden');
  menu.querySelector('.menu__btn-caption').textContent = 'Грета';
});
articlesGrid.addEventListener('click', (event) => {
  const currentIcon = event.target;
  currentIcon.style.backgroundImage = 'url(images/bookmark-marked.svg)';
});
