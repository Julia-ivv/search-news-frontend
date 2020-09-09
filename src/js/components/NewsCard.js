export default class NewsCard {
  constructor(options) {
    this._querySaveArticle = options.querySaveArticle;
    this._queryRemoveArticle = options.queryRemoveArticle;
    this._errorTexts = options.errorTexts;
  }

  _hideTooltip(elementTooltip) {
    if (!elementTooltip.classList.contains('article__tooltip_hidden'))
      elementTooltip.classList.add('article__tooltip_hidden');
  }

  _showTooltip(elementTooltip) {
    elementTooltip.classList.remove('article__tooltip_hidden');
  }

  _setHoverImage(elementIcon) {
    elementIcon.style.backgroundImage = 'url(images/bookmark-hover.svg)';
  }

  _setNormalImage(elementIcon) {
    elementIcon.style.backgroundImage = 'url(images/bookmark-normal.svg)';
  }

  _setMarkedImage(elementIcon) {
    elementIcon.style.backgroundImage = 'url(images/bookmark-marked.svg)';
  }

  //_saveArticle(newArticle, elementIcon, elementTooltip) {
  _saveArticle(elementIcon, elementTooltip, event) {
    // добавить в сохраненные
    // console.log(event.target);
    const newArticle = event.target.closest('.article');
    const imgElement = newArticle.querySelector('.article__image');
    // console.log(newArticle);
    this._querySaveArticle({
      keyword: newArticle.dataset.keyword,
      title: newArticle.querySelector('.article__title').textContent,
      text: newArticle.querySelector('.article__text').textContent,
      date: newArticle.querySelector('.article__date').textContent,
      source: newArticle.querySelector('.article__source').textContent,
      link: imgElement.dataset.url,
      image: imgElement.getAttribute('src'),
    })
      .then((res) => {
        elementIcon.setAttribute('data-id', res.data._id);
        this.renderIcon(true, elementIcon, elementTooltip);
        // this.setEventListeners({}, true, elementIcon, elementTooltip);
      })
      .catch((err) => {
        console.log(err.message);
        alert(this._errorTexts.errorServer);
      });
  }

  _removeArticle(articleId, elementIcon, elementTooltip, event) {
    console.log(event);
    // удалить из сохраненных
    this._queryRemoveArticle(articleId)
      .then((res) => {
        this.renderIcon(false, elementIcon, elementTooltip);
        elementIcon.removeAttribute('data-id');
      })
      .catch((err) => {
        console.log(err.message);
        let errForUser = '';
        if (err.message === '403') errForUser = this._errorTexts.errorForbidden
        else if (err.message === '404') errForUser = this._errorTexts.errorNotFound
        else errForUser = this._errorTexts.errorServer;
        alert(errForUser);
      });
  }

  renderIcon(isSaved, elementIcon, elementTooltip) {
    console.log('in renderIcon elementTooltip', elementTooltip);

    const isLoggedIn = !!localStorage.getItem('JWTnews');
    let bindSave = this._saveArticle.bind(this, elementIcon, elementTooltip);
    let bindRemove = this._removeArticle.bind(this, elementIcon.dataset.id, elementIcon, elementTooltip);
    // отрисовывает иконку карточки
    if (!isLoggedIn) { // неактивная иконка незалогиненого пользователя
      this._setNormalImage(elementIcon);
      elementIcon.onmouseenter = () => {
        this._showTooltip(elementTooltip);
        this._setHoverImage(elementIcon);
      };
      elementIcon.onmouseleave = () => {
        this._hideTooltip(elementTooltip);
        this._setNormalImage(elementIcon);
      };
      // elementIcon.removeEventListener('click', bindSave);
      // elementIcon.removeEventListener('click', bindRemove);
      elementIcon.onclick = null;
    };
    if (isLoggedIn && !isSaved) { // несохраненная иконка залогиненого пользователя
      this._hideTooltip(elementTooltip);
      this._setNormalImage(elementIcon);
      elementIcon.onmouseenter = () => {
        this._setHoverImage(elementIcon);
      };
      elementIcon.onmouseleave = () => {
        this._setNormalImage(elementIcon);
      };
      // elementIcon.addEventListener('click', bindSave);//, { once: true });
      // elementIcon.removeEventListener('click', bindRemove);
      elementIcon.onclick = bindSave;
    };
    if (isLoggedIn && isSaved) { // сохраненная иконка залогиненого пользователя
      elementIcon.onmouseenter = null;
      elementIcon.onmouseleave = null;
      this._setMarkedImage(elementIcon);
      // elementIcon.addEventListener('click', bindRemove);//, { once: true });
      // elementIcon.removeEventListener('click', bindSave);
      elementIcon.onclick = bindRemove;
    };
  }
}