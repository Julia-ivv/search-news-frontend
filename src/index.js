import './styles/styles.css';

/* Переменные */

const authorizationButton = document.querySelector('.menu__btn-login');
const closeButtons = document.querySelectorAll('.popup__close');
const loginForm = document.querySelector('#form-login');
const signupForm = document.querySelector('#form-signup');
const signupButton = loginForm.querySelector('.popup__or-button');
const loginButton = signupForm.querySelector('.popup__or-button');
const popupLogin = document.querySelector('#popup-login');
const popupSignup = document.querySelector('#popup-signup');
const popupSuccess = document.querySelector('#popup-success');

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
signupButton.addEventListener('click', (event) => {
  popupClose(event);
  popupOpen(popupSignup);
});
loginButton.addEventListener('click', (event) => {
  popupClose(event);
  popupOpen(popupLogin);
});
