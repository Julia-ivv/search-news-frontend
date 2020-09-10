export default class Header {
  // отвечает за логику работы шапки
  constructor(options) {
    this._headerColor = options.headerColor;
    this._headerElement = options.headerElement;
  }

  render(props) {
    // прорисовывает шапку в зависимости от переданных аргументов
    const isMobile = window.screen.availWidth <= 320;
    const isLoggedIn = props.isLoggedIn || false;
    const userName = props.userName || '';
    const loginBtn = (isMobile) ? this._headerElement.querySelector('.popup-menu__btn-login') : this._headerElement.querySelector('.menu__btn-login');
    const articlesMenu = (isMobile) ? this._headerElement.querySelector('#articles-popup-menu') : this._headerElement.querySelector('#articles-menu');

    if (isLoggedIn) {
      if (isMobile) articlesMenu.classList.remove('popup-menu__link_hidden')
      else articlesMenu.classList.remove('menu__link_hidden');
      loginBtn.textContent = userName;
      const icon = new Image();
      if (this._headerColor === 'white' && !isMobile) icon.src = 'images/logout-black.svg'
      else icon.src = 'images/logout-white.svg';
      if (isMobile) icon.classList.add('popup-menu__btn-icon')
      else icon.classList.add('menu__btn-icon');
      loginBtn.appendChild(icon);
    } else {
      loginBtn.textContent = 'Авторизоваться';
      if (isMobile) articlesMenu.classList.add('popup-menu__link_hidden')
      else articlesMenu.classList.add('menu__link_hidden');
    };
  }
}
