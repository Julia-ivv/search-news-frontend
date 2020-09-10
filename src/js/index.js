import '../css/styles.css';

import Header from './components/Header';
import Popup from './components/Popup';
import Form from './components/Form';
import NewsCard from './components/NewsCard';
import NewsCardList from './components/NewsCardList';
import NewsApi from './api/NewsApi';
import MainApi from './api/MainApi';

import FORM_VALIDATION_ERRORS from './constants/form-validation-errors';
import { CARDS_IN_LINE, SEARCH_PERIOD, API_KEY, PAGE_SIZE, ICON_BOOKMARK, ICON_BOOKMARK_HOVER, ICON_BOOKMARK_MARKED } from './constants/constants';
import { ERROR_NEWS_API, ERROR_SIGNUP, ERROR_CONFLICT, ERROR_AUTHORIZATION,
  ERROR_USER_NOT_FOUND, ERROR_ARTICLE_NOT_FOUND, ERROR_FORBIDDEN, ERROR_SERVER, ERROR_KEYWORD } from './constants/query-errors';
import { BASE_URL_MAIN_API, CONTENT_TYPE, BASE_URL_NEWS_API } from './constants/api-settings';

import { dateFormatingForCards, dateFormatingForSearch } from './utils/date-formating';
import clearLocalStorage from './utils/clear-localstorage';
import { searchInSavedCard } from './utils/array-processing';

/* Переменные */

const isMobile = window.screen.availWidth <= 320;

const signinForm = document.querySelector('#form-signin');
const signupForm = document.querySelector('#form-signup');

const popupSignin = document.querySelector('#popup-signin');
const popupSignup = document.querySelector('#popup-signup');
const popupSuccess = document.querySelector('#popup-success');
const popupMenu = document.querySelector('.popup-menu');

const closeSigninButton = popupSignin.querySelector('.popup__close');
const closeSignupButton = popupSignup.querySelector('.popup__close');
const closeSuccessButton = popupSuccess.querySelector('.popup__close');
const closePopupMenu = document.querySelector('.popup-menu__close');

const authorizationButton = document.querySelector('.menu__btn-login');
const authorizationPopupButton = document.querySelector('.popup-menu__btn-login');

const signupLink = popupSignin.querySelector('.popup__or-button');
const signinLink = popupSignup.querySelector('.popup__or-button');
const headerMenuOpenBtn = document.querySelector('.header__menu-open');

const HeaderClass = new Header({
  headerColor: 'black',
  headerElement: document.querySelector('.header'),
});
const popupSigninClass = new Popup({ popup: popupSignin });
const popupSignupClass = new Popup({ popup: popupSignup });
const popupSuccessClass = new Popup({ popup: popupSuccess });

const signinFormClass = new Form({ formElement: signinForm, errorTexts: FORM_VALIDATION_ERRORS });
const signupFormClass = new Form({ formElement: signupForm, errorTexts: FORM_VALIDATION_ERRORS });

const results = document.querySelector('.results');
const resultsError = results.querySelector('.results__error');
const notFound = document.querySelector('.not-found');
const preloader = document.querySelector('.preloader');
const searchInput = document.querySelector('.search__input');
const articles = document.querySelector('.articles');

const querySaveArticle = (newArticle) => new MainApi({
    baseUrl: BASE_URL_MAIN_API,
    headers: {
      'Content-Type': CONTENT_TYPE,
    }
  }).createArticle(newArticle);
const queryRemoveArticle = (articleId) => new MainApi({
    baseUrl: BASE_URL_MAIN_API,
    headers: {
      'Content-Type': CONTENT_TYPE,
    }
  }).removeArticle(articleId);
const newsCardClass = new NewsCard({
  querySaveArticle: querySaveArticle,
  queryRemoveArticle: queryRemoveArticle,
  errorTexts: {
    errorForbidden: ERROR_FORBIDDEN,
    errorServer: ERROR_SERVER,
    errorNotFound: ERROR_ARTICLE_NOT_FOUND
  },
  icons: {
    normalIcon: ICON_BOOKMARK,
    hoverIcon: ICON_BOOKMARK_HOVER,
    markedIcon: ICON_BOOKMARK_MARKED,
  },
  renderSavedArticles: undefined,
});
const renderCardIcon = (isSaved, elementIcon, elementTooltip, removableCard) => new NewsCard({
  querySaveArticle: querySaveArticle,
  queryRemoveArticle: queryRemoveArticle,
  errorTexts: {
    errorForbidden: ERROR_FORBIDDEN,
    errorServer: ERROR_SERVER,
    errorNotFound: ERROR_ARTICLE_NOT_FOUND
  },
  icons: {
    normalIcon: ICON_BOOKMARK,
    hoverIcon: ICON_BOOKMARK_HOVER,
    markedIcon: ICON_BOOKMARK_MARKED,
  },
  renderSavedArticles: undefined,
}).renderIcon(isSaved, elementIcon, elementTooltip, removableCard);

const newsCardListClass = new NewsCardList({
  initialCards: [],
  template: document.querySelector('#article'),
  container: articles,
  renderIcon: renderCardIcon,
});
const newsApi = new NewsApi({
  baseUrl: BASE_URL_NEWS_API,
  apiKey: API_KEY,
  endpoint: 'everything',
});
const mainApi = new MainApi({
  baseUrl: BASE_URL_MAIN_API,
  headers: {
    'Content-Type': CONTENT_TYPE,
  }
});

/* Функции */

// показать кнупку меню для 320px
function showMobileMenu() {
  headerMenuOpenBtn.classList.remove('header__menu-open_hidden');
};
// скрыть кнопку меню для 320px
function hideMobileMenu() {
  headerMenuOpenBtn.classList.add('header__menu-open_hidden');
}
// Выйти из личного кабинета
function logout() {
  clearLocalStorage(['JWTnews', 'userName']);
  if (isMobile) showMobileMenu();
  HeaderClass.render({ isLoggedIn: false, userName: '' });
  const articles = results.querySelectorAll('.article');
  articles.forEach((elem) => {
    newsCardClass.renderIcon(false, elem.querySelector('.article__icon'), elem.querySelector('.article__tooltip'), false);
  });
};
// Авторизоваться
function login() {
  popupSigninClass.open();
  if (isMobile) hideMobileMenu();
};
function loginLogout() {
  if (!!localStorage.getItem('JWTnews')) logout()
  else login();
};
// проверка url
function validateUrl(url) {
  return /^https?:\/\/(www\.)?(((\d{1,3}\.){3}\d{1,3})|([А-ЯЁа-яё0-9][0-9А-ЯЁа-яё\-.]*\.[А-ЯЁа-яё]+|[a-zA-Z0-9][a-zA-Z0-9\-.]*\.[a-zA-Z]+))(:[1-9]\d{1,4})?(\/?[-0-9a-zA-Z&=?+%._]+)+\/?#?$/i.test(url);
}
// проверка корректности полученных данных со статьями
function isCardCorrect(card) {
  if (!!card.source.name && !!card.description && !!card.title && !!card.publishedAt && validateUrl(card.urlToImage) && validateUrl(card.url)) return true
  else return false;
}
// получить часть массива статей для отрисовки и слушатель для кнопки Показать еще
function getCardList(allCards, alreadySavedCards, from) {
  let cardsLine = [];
  let newFrom = allCards.length;
  allCards.slice(from).some((element, index) => {
    if (isCardCorrect(element)) {
      cardsLine.push(element);
      if (cardsLine.length === CARDS_IN_LINE) {
        newFrom = from + index + 1;
        return true;
      };
    };
  });
  if (allCards.length > newFrom && allCards.slice(newFrom).some((element) => { if (isCardCorrect(element)) return true })) {
    const btnMore = document.querySelector('.results__more-button');
    btnMore.classList.remove('results__more-button_hidden');

    function moreButtonClick() {
      this.classList.add('results__more-button_hidden');
      const partOfCards = getCardList(allCards, alreadySavedCards, newFrom);
      partOfCards.forEach(foundCard => {
        const { isSaved, idSavedCard } = searchInSavedCard(alreadySavedCards, foundCard);
        newsCardListClass.addCard(foundCard, dateFormatingForCards, isSaved, searchInput.value.trim(), false, idSavedCard);
      });
      this.removeEventListener('click', moreButtonClick);

    };
    btnMore.addEventListener('click', moreButtonClick);
  };
  return cardsLine;
}
// отобразить блок со статьями
function showResults() {
  results.classList.remove('results_hidden');
}
// поиск статей
function search() {
  const request = searchInput.value.trim().replace(/\s+/g, '+');
  const day = new Date();
  const dayTo = dateFormatingForSearch(day);
  day.setDate(day.getDate() - SEARCH_PERIOD);
  const dayFrom = dateFormatingForSearch(day);

  newsApi.getNews(request, 'ru', dayFrom, dayTo, PAGE_SIZE)
    .then((data) => {
      if (data.articles.length > 0) {
        // получить уже сохраненные статьи пользователя
        mainApi.getArticles()
        .then((res) => {
          const alreadySavedCards = res.data;
          let cards = getCardList(data.articles, res.data, 0);
          if (cards.length > 0) {
            cards.forEach(foundCard => {
              const { isSaved, idSavedCard } = searchInSavedCard(alreadySavedCards, foundCard);
              newsCardListClass.addCard(foundCard, dateFormatingForCards, isSaved, searchInput.value.trim(), false, idSavedCard);
            });
            showResults();
          } else {
            newsCardListClass.renderNotFound(notFound);
          }
        })
        .catch((err) => alert(err));
      } else {
        newsCardListClass.renderNotFound(notFound);
      };
      newsCardListClass.hideLoader(preloader);
    })
    .catch((err) => {
      const btnMore = document.querySelector('.results__more-button');
      newsCardListClass.removeShowMore(btnMore);
      newsCardListClass.hideLoader(preloader);
      newsCardListClass.renderError(resultsError, ERROR_NEWS_API);
      showResults();
    });
};

/* Слушатели событий */

// клик по авторизоваться/выйти
authorizationButton.addEventListener('click', () => {
  loginLogout();
});
authorizationPopupButton.addEventListener('click', () => {
  popupMenu.classList.add('popup-menu_hidden');
  if (isMobile) hideMobileMenu();
  loginLogout();
});

// Попап Вход
signinForm.addEventListener('submit', (event) => { //кнопка Войти
  event.preventDefault();
  mainApi.signin({
    email: signinForm.querySelector('#email-signin').value,
    password: signinForm.querySelector('#password-signin').value,
  })
    .then((res) => {
      localStorage.setItem('JWTnews', res.token);
      return mainApi.getUserData();
    })
    .then((data) => {
      popupSigninClass.close();
      showMobileMenu();
      localStorage.setItem('userName', data.name);
      signinFormClass.clearForm();
      HeaderClass.render({ isLoggedIn: !!localStorage.getItem('JWTnews'), userName: data.name });
      const articles = results.querySelectorAll('.article');
      articles.forEach((elem) => {
        newsCardClass.renderIcon(false, elem.querySelector('.article__icon'), elem.querySelector('.article__tooltip'), false);
      });
    })
    .catch((err) => {
      let errForUser = '';
      if (err.message === '404') errForUser = ERROR_USER_NOT_FOUND
      else errForUser = ERROR_AUTHORIZATION;
      signinFormClass.setServerError(signinForm.querySelector('#error-signin'), errForUser);
      clearLocalStorage(['JWTnews', 'userName']);
    });
});
closeSigninButton.addEventListener('click', () => { // кнопка закрыть
  signinFormClass.clearForm();
  popupSigninClass.close();
  if (isMobile) showMobileMenu();
});
signupLink.addEventListener('click', () => { // ссылка Зарегистрироваться
  signinFormClass.clearForm();
  popupSigninClass.close();
  popupSignupClass.open();
});

// Попап Регистрация
signupForm.addEventListener('submit', (event) => { // кнопка Зарегистрироваться
  event.preventDefault();
  mainApi.signup({
    name: signupForm.querySelector('#name-signup').value,
    email: signupForm.querySelector('#email-signup').value,
    password: signupForm.querySelector('#password-signup').value,
  })
    .then((res) => {
      signupFormClass.clearForm();
      popupSignupClass.close();
      popupSuccessClass.open();
    })
    .catch((err) => {
      let errForUser = '';
      if (err.message === '409') errForUser = ERROR_CONFLICT
      else errForUser = ERROR_SIGNUP;

      signupFormClass.setServerError(signupForm.querySelector('#error-signup'), errForUser);
    });
});
closeSignupButton.addEventListener('click', () => { // кнопка закрыть
  popupSignupClass.close();
  signupFormClass.clearForm();
  if (isMobile) showMobileMenu();
});
signinLink.addEventListener('click', (event) => { // ссылка Войти
  popupSignupClass.close();
  popupSigninClass.open();
  signupFormClass.clearForm();
});

// Попап успешной регистрации
closeSuccessButton.addEventListener('click', () => {
  popupSuccessClass.close();
  if (isMobile) showMobileMenu();
});
// кнопка Войти при успешной регистрации
popupSuccess.querySelector('.popup__login-button').addEventListener('click', (event) => {
  popupSuccessClass.close();
  popupSigninClass.open();
});

// Валидация форм
signinFormClass.setEventListeners();
signupFormClass.setEventListeners();
// Открыть статью по клику на карточку
articles.addEventListener('click', (event) => {
  const element = event.target;
  if (element.classList.contains('article__image')) window.open(element.dataset.url);
});
// Закрыть и открыть меню на 320px
closePopupMenu.addEventListener('click', () => {
  popupMenu.classList.add('popup-menu_hidden');
});
headerMenuOpenBtn.addEventListener('click', () => {
  popupMenu.classList.remove('popup-menu_hidden');
});
// Убрать прозрачный хедер при скроле на 320px
window.addEventListener('scroll', () => {
  if (window.screen.availWidth <= 320) {
    const headerElem = document.querySelector('.header_style_black');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop === 0) headerElem.style.backgroundColor = 'rgba(196, 196, 196, .01)';
    else headerElem.style.backgroundColor = 'rgb(1, 24, 1)';
  }
});
// слушатель кнопки Искать
document.querySelector('.search__button').addEventListener('click', (event) => {
  event.preventDefault();
  if (searchInput.value === '') {
    searchInput.placeholder = ERROR_KEYWORD;
    searchInput.style.backgroundColor = '#b67070';
    setTimeout(() => {
      searchInput.style.backgroundColor = '';
    }, 400);
  }
  else {
    const btnMore = document.querySelector('.results__more-button');
    newsCardListClass.removeResults(btnMore, articles, results, resultsError, notFound);
    newsCardListClass.renderLoader(preloader);
    newsCardListClass.renderShowMore(document.querySelector('#button-more'), results);
    search();
  };
});

/* Вызовы функций */

HeaderClass.render({ isLoggedIn: !!localStorage.getItem('JWTnews'), userName: localStorage.getItem('userName') });