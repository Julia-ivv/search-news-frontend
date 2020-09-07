export default class NewsCard {
  constructor() {}

  _hideTooltip(elementTooltip) {
    if (!elementTooltip.classList.contains('article__tooltip_hidden'))
      elementTooltip.classList.add('article__tooltip_hidden');
  }

  _showTooltip(elementTooltip) {
    elementTooltip.classList.remove('article__tooltip_hidden');
  }

  renderIcon(isLoggedIn, isSaved, elementIcon, elementTooltip) {
    // отрисовывает иконку карточки
    console.log(!!isLoggedIn, isSaved);
    if (!isLoggedIn) { // неактивная иконка незалогиненого пользователя
      // console.log(isLoggedIn, isSaved);
      // elementIcon.classList.add('article__icon_type_bookmark');
      elementIcon.onmouseenter = () => {
        this._showTooltip(elementTooltip);
      };
      elementIcon.onmouseleave = () => {
        this._hideTooltip(elementTooltip);
      };
    };
    if (isLoggedIn && !isSaved) { // несохраненная иконка залогиненого пользователя
      // elementIcon.classList.add('article__icon_type_bookmark');
      this._hideTooltip(elementTooltip);
      elementIcon.onmouseenter = null;
      elementIcon.onmouseleave = null;
    }
    if (isLoggedIn && isSaved) { // сохраненная иконка залогиненого пользователя
      elementIcon.style.backgroundImage = 'url(images/bookmark-marked.svg)'
    }
  }
}