export default class NewsCardList {
  constructor(options) {
    // массив карточек, которые должны быть в списке при первой отрисовке
    this._initialCards = options.initialCards;
    this._template = options.template;
    this._container = options.container;
    this._renderIcon = options.renderIcon;
    // this._querySaveArticle = options.querySaveArticle;
    // this._queryRemoveArticle = options.queryRemoveArticle;
    // this._errorTexts = options.errorTexts;
  }

  renderResults(cards, dateFormating, isSaved, keyword) {
    // принимает массив экземпляров карточек и отрисовывает их
    // console.log('render', cards, isSaved, keyword);
    cards.forEach(element => {
      this._addCard(element, dateFormating, isSaved, keyword);
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

  // _saveArticle(newArticle, elementIcon, tooltipElement) {
  //   // добавить в сохраненные
  //   console.log(this);
  //   this._querySaveArticle({
  //     keyword: newArticle.keyword,
  //     title: newArticle.title,
  //     text: newArticle.text,
  //     date: newArticle.date,
  //     source: newArticle.source,
  //     link: newArticle.link,
  //     image: newArticle.image,
  //   })
  //     .then((res) => {
  //       elementIcon.setAttribute('data-id', res.data._id);
  //       this._renderIcon(true, elementIcon, tooltipElement);
  //       // this.setEventListeners({}, true, elementIcon, tooltipElement);
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //       alert(this._errorTexts.errorServer);
  //     });
  // }

  // _removeArticle(articleId, elementIcon, tooltipElement) {
  //   // удалить из сохраненных
  //   this._queryRemoveArticle(articleId)
  //     .then((res) => {
  //       this._renderIcon(false, elementIcon, tooltipElement);
  //       elementIcon.removeAttribute('data-id');
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //       let errForUser = '';
  //       if (err.message === '403') errForUser = this._errorTexts.errorForbidden
  //       else if (err.message === '404') errForUser = this._errorTexts.errorNotFound
  //       else errForUser = this._errorTexts.errorServer;
  //       alert(errForUser);
  //     });
  // }

  _addCard(card, dateFormating, isSaved, keyword) {
    // принимает экземпляр карточки и добавляет ее в список
    // console.log('in _addCard');

    let clone = this._template.content.cloneNode(true);
    const img = clone.querySelector('.article__image');

    clone.querySelector('.article__source').textContent = card.source.name;
    clone.querySelector('.article__text').textContent = card.description;
    clone.querySelector('.article__title').textContent = card.title;
    clone.querySelector('.article__date').textContent = dateFormating(card.publishedAt);
    img.setAttribute('src', card.urlToImage);
    img.setAttribute('alt', card.title);
    img.dataset.url = card.url;
    clone.querySelector('.article').setAttribute('data-keyword', keyword);

    const elementIcon = clone.querySelector('.article__icon');
    const tooltipElement = clone.querySelector('.article__tooltip');

    // console.log('elementIcon', elementIcon);
    // console.log('tooltipElement', tooltipElement);
    // const newArticle = {
    //   keyword: keyword,
    //   title: card.title,
    //   text: card.description,
    //   date: dateFormating(card.publishedAt),
    //   source: card.source.name,
    //   link: card.url,
    //   image: card.urlToImage,
    // };
    // this.setEventListeners(newArticle, isSaved, elementIcon, tooltipElement);
    this._renderIcon(isSaved, elementIcon, tooltipElement);
    this._container.appendChild(clone);
  }

  // setEventListeners(newArticle, isSaved, elementIcon, tooltipElement) {
  //   const isLoggedIn = !!localStorage.getItem('JWTnews');
  //   if (!isLoggedIn) {
  //     // удалить все обработчики
  //     elementIcon.removeEventListener('click', this._removeArticle.bind(this, elementIcon.dataset.id, elementIcon, tooltipElement));
  //     elementIcon.removeEventListener('click', this._saveArticle.bind(this, newArticle, elementIcon, tooltipElement));
  //   };
  //   if (isLoggedIn && !isSaved) {
  //     // удалить другой обработчик, по клику сохранение карточки
  //     elementIcon.addEventListener('click', this._saveArticle.bind(this, newArticle, elementIcon, tooltipElement), { once: true });
  //   };
  //   if (isLoggedIn && isSaved) {
  //     // удалить другой обработчик, по клику удаление карточки из сохраненных
  //     elementIcon.addEventListener('click', this._removeArticle.bind(this, elementIcon.getAttribute('data-id'), elementIcon, tooltipElement), { once: true });
  //   };
  // }
}