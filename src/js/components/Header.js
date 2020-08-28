export default class Header {
  // отвечает за логику работы шапки
  constructor(options) {
    // this._headerTemplateContent = options.headerTemplate.content;
    // this._parentElement = options.parentElement;
    // this._beforeElement = options.beforeElement;
    this._headerColor = options.headerColor;
    // this._eventListeners = options.eventListeners;
    this._headerElement = options.headerElement;
  }

  render(props) {
    // прорисовывает шапку в зависимости от переданных аргументов
    const isMobile = window.screen.availWidth <= 320;
    const isLoggedIn = props.isLoggedIn || false;
    const userName = props.userName || '';

    // const headerElem = this._headerTemplateContent.querySelector('.header');
    // const loginBtn = (isMobile) ? headerElem.querySelector('.popup-menu__btn-login') : headerElem.querySelector('.menu__btn-login');
    // const articlesMenu = (isMobile) ? headerElem.querySelector('#articles-popup-menu') : headerElem.querySelector('#articles-menu');
    // const mainMenu = headerElem.querySelector('#main-menu');
    // if (this._headerColor === 'white') { // светлая шапка на стр с сохраненными статьями
    //   headerElem.classList.add('header_style_white');
    //   loginBtn.classList.add('menu__btn-login_style_black');
    //   articlesMenu.classList.add('menu__link_underline_black');
    // }
    // else { // темная шапка на главной странице
    //   headerElem.classList.add('header_style_black');
    //   loginBtn.classList.add('menu__btn-login_style_white');
    //   mainMenu.classList.add('menu__link_underline_white');
    // };

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
    // const clone = document.importNode(headerElem, true);
    // this._parentElement.insertBefore(clone, this._beforeElement);
    // this._setHandlers(clone);

    // this._setHandlers(this._headerElement);
  }

  // _setHandlers(header) {
  //   for (let item of this._eventListeners) {
  //     const elem = header.querySelector(item.elementClass);
  //     elem.addEventListener(item.event, item.listener);
  //   }
  // }
}
