export default class NewsCard {
  constructor(options) {
    this._querySaveArticle = options.querySaveArticle;
    this._queryRemoveArticle = options.queryRemoveArticle;
    this._errorTexts = options.errorTexts;
    this._icons = options.icons;
    this._renderSavedArticles = options.renderSavedArticles;
  }

  _hideTooltip(elementTooltip) {
    if (!elementTooltip.classList.contains('article__tooltip_hidden'))
      elementTooltip.classList.add('article__tooltip_hidden');
  }

  _showTooltip(elementTooltip) {
    elementTooltip.classList.remove('article__tooltip_hidden');
  }

  _setHoverImage(elementIcon) {
    elementIcon.style.backgroundImage = this._icons.hoverIcon;
  }

  _setNormalImage(elementIcon) {
    elementIcon.style.backgroundImage = this._icons.normalIcon;
  }

  _setMarkedImage(elementIcon) {
    elementIcon.style.backgroundImage = this._icons.markedIcon;
  }

  _saveArticle(elementIcon, elementTooltip, event) {
    // добавить в сохраненные
    const newArticle = event.target.closest('.article');
    const imgElement = newArticle.querySelector('.article__image');
    this._querySaveArticle({
      keyword: newArticle.querySelector('.article__keyword').textContent,
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
      })
      .catch((err) => {
        alert(this._errorTexts.errorServer);
      });
  }

  _removeArticle(articleId, elementIcon, elementTooltip, removableCard, event) {
    // удалить из сохраненных
    this._queryRemoveArticle(articleId)
      .then((res) => {
        if (removableCard) {
          event.target.closest('.article').remove();
          this._renderSavedArticles();
        } else {
          this.renderIcon(false, elementIcon, elementTooltip, false);
          elementIcon.removeAttribute('data-id');
        }
      })
      .catch((err) => {
        let errForUser = '';
        if (err.message === '403') errForUser = this._errorTexts.errorForbidden
        else if (err.message === '404') errForUser = this._errorTexts.errorNotFound
        else errForUser = this._errorTexts.errorServer;
        alert(errForUser);
      });
  }

  renderIcon(isSaved, elementIcon, elementTooltip, removableCard) {
    const isLoggedIn = !!localStorage.getItem('JWTnews');
    let bindSave = this._saveArticle.bind(this, elementIcon, elementTooltip);
    let bindRemove = this._removeArticle.bind(this, elementIcon.dataset.id, elementIcon, elementTooltip, removableCard);
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
      elementIcon.onclick = bindSave;
    };
    if (isLoggedIn && isSaved) { // сохраненная иконка залогиненого пользователя
      elementIcon.onmouseenter = null;
      elementIcon.onmouseleave = null;
      this._setMarkedImage(elementIcon);
      elementIcon.onclick = bindRemove;
    };
  }
}