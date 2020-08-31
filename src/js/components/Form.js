export default class Form {
  constructor(options) {
    this._errorTexts = options.errorTexts;
    this._formElement = options.formElement;
  }

  setServerError(errorElement, errorText) {
    // добавляет форме ошибку, пришедшую с сервера
    this._showError(errorElement, errorText);
  }

  _showError(elem, text) {
    elem.textContent = text;
    elem.classList.add('error-message_visible');
  }

  _hideError(elem) {
    elem.textContent = '';
    elem.classList.remove('error-message_visible');
  }

  _validateInputElement(inputElement, errorElement) {
    // валидирует инпут, переданный в аргументе
    if (inputElement.validity.valueMissing) {
      this._showError(errorElement, this._errorTexts.validInput);
    } else if (inputElement.type === 'text' && inputElement.validity.tooShort) {
      this._showError(errorElement, this._errorTexts.validLength);
    } else if (inputElement.type === 'email' && !inputElement.validity.valid) {
      this._showError(errorElement, this._errorTexts.validEmail);
    }
    else this._hideError(errorElement);
  }

  _removeActivityBtn(btn) {
    if (btn.classList.contains('button_style_blue')) btn.classList.remove('button_style_blue');
    if (!btn.classList.contains('button_style_gray')) btn.classList.add('button_style_gray');
    btn.setAttribute('disabled', true);
  }

  _setActivityBtn(btn) {
    if (btn.classList.contains('button_style_gray')) btn.classList.remove('button_style_gray');
    if (!btn.classList.contains('button_style_blue')) btn.classList.add('button_style_blue');
    btn.removeAttribute('disabled');
  }

  _validateForm(btn, inputs) {
    // валидирует всю форму
    const notValid = Array.from(inputs).some((el) => { if (!el.validity.valid) return el });
    if (notValid) {
      this._removeActivityBtn(btn);
    } else {
      this._setActivityBtn(btn);
    }
  }

  _clear() {
    // очищает поля, вспомогательный
    // this._formElement.reset();
  }

  _getInfo() {
    // возвращает данные формы, вспомогательный

  }

  clearForm() {
    this._formElement.reset();
    this._formElement.querySelectorAll('.error-message').forEach((elem) => this._hideError(elem));
  }

  setEventListeners() {
    this._formElement.querySelectorAll('.popup__input').forEach((elem) => {
      elem.addEventListener('input', (event) => {
        this._validateInputElement(event.target, this._formElement.querySelector(`#error-${event.target.name}`));
        this._validateForm(this._formElement.querySelector('.button'), this._formElement.querySelectorAll('.popup__input'));
      })
    });
  }
}