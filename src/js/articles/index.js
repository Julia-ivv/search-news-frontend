import '../../css/articles.css';

import Header from '../components/Header';
import MainApi from '../api/MainApi';
import NewsCard from '../components/NewsCard';
import NewsCardList from '../components/NewsCardList';

import { MAIN_PAGE, ICON_TRASH, ICON_TRASH_HOVER, SHOW_ALL_KEYWORDS, SHOW_KEYWORDS } from '../constants/constants';
import clearLocalStorage from '../utils/clear-localstorage';
import { BASE_URL_MAIN_API, CONTENT_TYPE } from '../constants/api-settings';
import { ERROR_ARTICLE_NOT_FOUND, ERROR_FORBIDDEN, ERROR_SERVER } from '../constants/query-errors';
import { keywordsToString } from '../utils/array-processing';
import declension from '../utils/declension';

const headerMenuOpenBtn = document.querySelector('.header__menu-open');
const closePopupMenu = document.querySelector('.popup-menu__close');
const popupMenu = document.querySelector('.popup-menu');
const authorizationButton = document.querySelector('.menu__btn-login');
const authorizationPopupButton = document.querySelector('.popup-menu__btn-login');
const articles = document.querySelector('.articles');

const HeaderClass = new Header({
  headerColor: 'white',
  headerElement: document.querySelector('.header'),
});

const mainApiClass = new MainApi({
  baseUrl: BASE_URL_MAIN_API,
  headers: {
    'Content-Type': CONTENT_TYPE,
  }
});

const queryRemoveArticle = (articleId) => new MainApi({
  baseUrl: BASE_URL_MAIN_API,
  headers: {
    'Content-Type': CONTENT_TYPE,
  }
}).removeArticle(articleId);

const renderCardIcon = (isSaved, elementIcon, elementTooltip, removableCard) => new NewsCard({
  querySaveArticle: null,
  queryRemoveArticle: queryRemoveArticle,
  errorTexts: {
    errorForbidden: ERROR_FORBIDDEN,
    errorServer: ERROR_SERVER,
    errorNotFound: ERROR_ARTICLE_NOT_FOUND
  },
  icons: {
    normalIcon: ICON_TRASH,
    hoverIcon: ICON_TRASH_HOVER,
  },
  renderSavedArticles: firstRender,
}).renderIcon(isSaved, elementIcon, elementTooltip, removableCard);

const newsCardListClass = new NewsCardList({
  initialCards: [],
  template: document.querySelector('#article'),
  container: articles,
  renderIcon: renderCardIcon,
});

/* Функции */

function removeArticles() {
  while (articles.firstChild) {
    articles.removeChild(articles.firstChild);
  };
}

function firstRender() {
  if (!localStorage.getItem('JWTnews')) document.location.href = MAIN_PAGE
  else {
    HeaderClass.render({ isLoggedIn: localStorage.getItem('JWTnews'), userName: localStorage.getItem('userName') });
    removeArticles();

    mainApiClass.getArticles()
      .then((res) => {
        const results = document.querySelector('.results');
        const articlesInfo = document.querySelector('.articles-info');
        const countArticles = articlesInfo.querySelector('#count-articles');
        const keywordsElement = articlesInfo.querySelector('#keywords');
        const restKeyWordsElement = articlesInfo.querySelector('#rest-keyword');
        let keywords = [];
        let keywordsString = '';
        let restKeyword = 0;

        countArticles.textContent = `${localStorage.getItem('userName')}, у вас ${res.data.length} ${declension(res.data.length, ['сохраненная статья', 'сохраненные статьи', 'сохраненных статей'])}`;

        res.data.forEach((resElement) => {
          let ind = keywords.findIndex((keywordElement) => keywordElement.keyword === resElement.keyword);
          if (ind === -1)
            keywords.push({
              keyword: resElement.keyword,
              count: 1,
            })
          else keywords[ind].count += 1;
        });

        keywords.sort((a, b) => a.count < b.count ? 1 : -1);

        if (keywords.length <= SHOW_ALL_KEYWORDS) {
          keywordsString = keywordsToString(keywords, ', ');
        } else {
          keywordsString = keywordsToString(keywords.slice(0, SHOW_KEYWORDS), ', ');
          restKeyword = keywords.length - SHOW_KEYWORDS;
        };

        keywordsElement.textContent = keywordsString;
        if (restKeyword > 0) restKeyWordsElement.textContent = ` и ${restKeyword} другим`;
        newsCardListClass.renderResults(res.data, undefined, true, undefined, true);
        results.classList.remove('results_hidden');
      })
      .catch((err) => {
        alert(err);
      })
  };
}

// Выйти из личного кабинета
function logout() {
  document.location.href = MAIN_PAGE;
  clearLocalStorage(['JWTnews', 'userName']);
}

/* Слушатели событий */

authorizationButton.addEventListener('click', () => { // клик по кнопке Аторизоваться/Выход
  logout();
});

authorizationPopupButton.addEventListener('click', () => { // клик по кнопке Авторизоваться/выход в попапе
  logout();
});

headerMenuOpenBtn.addEventListener('click', () => {
  popupMenu.classList.remove('popup-menu_hidden');
});
closePopupMenu.addEventListener('click', () => {
  popupMenu.classList.add('popup-menu_hidden');
});

articles.addEventListener('click', (event) => {
  const element = event.target;
  if (element.classList.contains('article__image')) window.open(element.dataset.url);
});

/* Вызовы функций */

firstRender();