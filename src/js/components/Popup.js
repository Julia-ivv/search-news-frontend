export default class Popup {
  constructor(options) {
    this._popup = options.popup;
  }

  open() { // открывает попап
    this._popup.classList.add('popup_is-opened');
  }

  close() { // закрывает попап
    this._popup.classList.remove('popup_is-opened');
  }
}