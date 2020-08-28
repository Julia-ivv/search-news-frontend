export default class Header {
  // отвечает за логику работы шапки
  constructor(options) {
    this._headerTemplateContent = options.headerTemplate.content;
    this._parentElement = options.parentElement;
    this._beforeElement = options.beforeElement;
    this._headerColor = options.headerColor;
  }

  render(props) {
    // прорисовывает шапку в зависимости от переданных аргументов
    const isLoggedIn = props.isLoggedIn || false;
    const userName = props.userName || '';

    const headerElem = this._headerTemplateContent.querySelector('.header');
    const loginBtn = headerElem.querySelector('.menu__btn-login');
    const mainMenu = headerElem.querySelector('#main-menu');
    const articlesMenu = headerElem.querySelector('#articles-menu');

    if (this._headerColor === 'white') { // светлая шапка на стр с сохраненными статьями
      headerElem.classList.add('header_style_white');
      loginBtn.classList.add('menu__btn-login_style_black');
      articlesMenu.classList.add('menu__link_underline_black');
    }
    else { // темная шапка на главной странице
      headerElem.classList.add('header_style_black');
      loginBtn.classList.add('menu__btn-login_style_white');
      mainMenu.classList.add('menu__link_underline_white');
    };

    if (isLoggedIn) {
      articlesMenu.classList.remove('menu__link_hidden');
      loginBtn.textContent = userName;
      const icon = new Image();
      if (this._headerColor === 'white') icon.src = 'images/logout-black.svg'
      else icon.src = 'images/logout-white.svg';
      icon.classList.add('menu__btn-icon');
      loginBtn.appendChild(icon);
    } else {
      loginBtn.textContent = 'Авторизоваться';
    };
    const clone = document.importNode(headerElem, true);
    this._parentElement.insertBefore(clone, this._beforeElement);
  }
}
