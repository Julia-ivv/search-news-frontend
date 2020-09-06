export default class NewsCardList {
  constructor(options) {
    // массив карточек, которые должны быть в списке при первой отрисовке
    this._initialCards = options.initialCards;
    this._template = options.template;
    this._container = options.container;
  }

  renderResults(cards, dateFormating) {
    // принимает массив экземпляров карточек и отрисовывает их
    cards.forEach(element => {
      this._addCard(element, dateFormating);
    });
  }

  renderLoader(element) {
    // отрисовка лоадера
    if (element.classList.contains('preloader_hidden')) element.classList.remove('preloader_hidden');
  }

  hideLoader(element) {
    // скрывает лоадер
    if (!element.classList.contains('preloader_hidden')) element.classList.add('preloader_hidden');
  }

  renderError(errorElement, errorText) {
    // принимает объект ошибки и показывает ошибку в интерфейсе
    errorElement.textContent = errorText;
    errorElement.classList.remove('results__error_hidden');
  }

  renderNotFound(element) {
    // отрисовка блока ничего не найдено
    element.classList.remove('not-found_hidden');
  }

  renderShowMore(template, parentElement) {
    // отрисовывает кнопку Показать еще
    let clone = template.content.cloneNode(true);
    parentElement.appendChild(clone);
  }

  removeShowMore(element) {
    // удаляет кнопку Показать еще
    if (element) element.remove();
  }

  _addCard(card, dateFormating) {
    // принимает экземпляр карточки и добавляет ее в список
    let clone = this._template.content.cloneNode(true);
    const img = clone.querySelector('.article__image');

    clone.querySelector('.article__source').textContent = card.source.name;
    clone.querySelector('.article__text').textContent = card.description;
    clone.querySelector('.article__title').textContent = card.title;
    clone.querySelector('.article__date').textContent = dateFormating(card.publishedAt);
    img.setAttribute('src', card.urlToImage);
    img.setAttribute('alt', card.title);
    img.dataset.url = card.url;
    this._container.appendChild(clone);
  }
}