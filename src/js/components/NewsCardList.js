export default class NewsCardList {
  constructor(options) {
    this._template = options.template;
    this._container = options.container;
    this._renderIcon = options.renderIcon;
  }

  renderResults(cards, dateFormating, isSaved, keyword, removableCard) {
    // принимает массив экземпляров карточек и отрисовывает их
    cards.forEach(element => {
      this.addCard(element, dateFormating, isSaved, keyword, removableCard);
    });
  }

  removeResults(btnMore, articles, results, resultsError, notFound) {
    this.removeShowMore(btnMore);
    while (articles.firstChild) {
      articles.removeChild(articles.firstChild);
    };
    if (!results.classList.contains('results_hidden')) results.classList.add('results_hidden');
    if (!resultsError.classList.contains('results__error_hidden')) resultsError.classList.add('results__error_hidden');
    if (!notFound.classList.contains('not-found_hidden')) notFound.classList.add('not-found_hidden');
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

  addCard(card, dateFormating, isSaved, keyword, removableCard, idSavedCard) {
    // принимает экземпляр карточки и добавляет ее в список
    let clone = this._template.content.cloneNode(true);
    const img = clone.querySelector('.article__image');
    const elementIcon = clone.querySelector('.article__icon');
    const tooltipElement = clone.querySelector('.article__tooltip');

    clone.querySelector('.article__source').textContent = !card.source.name ? card.source : card.source.name;
    clone.querySelector('.article__text').textContent = !card.description ? card.text : card.description;
    clone.querySelector('.article__title').textContent = card.title;
    clone.querySelector('.article__date').textContent = !dateFormating ? card.date : dateFormating(card.publishedAt);
    img.setAttribute('src', !card.urlToImage ? card.image : card.urlToImage);
    img.setAttribute('alt', card.title);
    img.dataset.url = !card.url ? card.link : card.url;
    clone.querySelector('.article__keyword').textContent = !keyword ? card.keyword : keyword;
    if (!!card._id) elementIcon.dataset.id = card._id;
    if (!!idSavedCard) elementIcon.dataset.id = idSavedCard;

    this._renderIcon(isSaved, elementIcon, tooltipElement, removableCard);
    this._container.appendChild(clone);
  }
}