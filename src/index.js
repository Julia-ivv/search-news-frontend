import './styles/styles.css';

const loginButton = document.querySelector('.menu__btn-login');
const closeButton = document.querySelector('.popup__close');
const loginForm = document.querySelector('#form-login');

// Открытие попапа
function popupOpen(popup) {
  popup.classList.add('popup_is-opened');
}
// Закрытие попапа
function popupClose(event) {
  event.target.closest('.popup').classList.remove('popup_is-opened');
}

loginButton.addEventListener('click', () => {
  popupOpen(document.querySelector('#popup-login'));
});

closeButton.addEventListener('click', popupClose);
loginForm.addEventListener('submit', (event) => event.preventDefault());
