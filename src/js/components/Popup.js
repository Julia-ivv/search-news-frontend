export default class Popup {
  constructor(options) {
    // this._template = options.template;
    // this._parentElement = options.parentElement;
    // this._popup = undefined;
    this._popup = options.popup;
  }

  _setContent() { // вставляет в попап содержимое
    // const clone = document.importNode(this._template.firstChild, true);
    // this._popup = this._parentElement.appendChild(clone);
  }

  _clearContent() { // очищает содержимое

  }

  open() { // открывает попап
    // this._setContent();
    this._popup.classList.add('popup_is-opened');
  }

  close() { // закрывает попап
    this._popup.classList.remove('popup_is-opened');
  }
}