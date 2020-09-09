import '../css/styles.css';

import Header from './components/Header';
import Popup from './components/Popup';
import Form from './components/Form';
import NewsCard from './components/NewsCard';
import NewsCardList from './components/NewsCardList';
import NewsApi from './api/NewsApi';
import MainApi from './api/MainApi';

import FORM_VALIDATION_ERRORS from './constants/form-validation-errors';
import { CARDS_IN_LINE, SEARCH_PERIOD, API_KEY, PAGE_SIZE } from './constants/constants';
import { ERROR_NEWS_API, ERROR_SIGNUP, ERROR_CONFLICT, ERROR_AUTHORIZATION, ERROR_USER_NOT_FOUND, ERROR_ARTICLE_NOT_FOUND, ERROR_FORBIDDEN, ERROR_SERVER } from './constants/query-errors';

import { dateFormatingForCards, dateFormatingForSearch } from './utils/date-formating';

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
// const closeButtons = document.querySelectorAll('.popup__close');

const signupLink = popupSignin.querySelector('.popup__or-button');
const signinLink = popupSignup.querySelector('.popup__or-button');
const loginButton = signinForm.querySelector('.popup__button');
const articlesGrid = document.querySelector('.articles');
const headerMenuOpenBtn = document.querySelector('.header__menu-open');

const menu = document.querySelector('.menu');

// let isLoggedIn = !!localStorage.getItem(isLoggedIn);
// let userName = localStorage.getItem(userName) || '';

// const authorizationListener = isLoggedIn
//   ? () => logout()
//   : () => popupOpen(document.querySelector('#popup-login'));
// const popupMenuOpenListener = () => document.querySelector('.popup-menu').classList.remove('popup-menu_hidden');
// const popupMenuCloseListener = () => document.querySelector('.popup-menu').classList.add('popup-menu_hidden');

const HeaderClass = new Header({
  // headerTemplate: document.querySelector('#header'),
  // parentElement: document.querySelector('.main-picture'),
  // beforeElement: document.querySelector('.search'),
  headerColor: 'black',
  // eventListeners: [
    // {
    //   event: 'click',
    //   elementClass: '.menu__btn-login',
    //   listener: authorizationListener,
    // },
  //   {
  //     event: 'click',
  //     elementClass: '.popup-menu__btn-login',
  //     listener: authorizationListener,
  //   },
  //   {
  //     event: 'click',
  //     elementClass: '.header__menu-open',
  //     listener: popupMenuOpenListener,
  //   },
  //   {
  //     event: 'click',
  //     elementClass: '.popup-menu__close',
  //     listener: popupMenuCloseListener,
  //   },
  // ],
  headerElement: document.querySelector('.header'),
});
const popupSigninClass = new Popup({ popup: popupSignin });
const popupSignupClass = new Popup({ popup: popupSignup });
const popupSuccessClass = new Popup({ popup: popupSuccess });

const signinFormClass = new Form({ formElement: signinForm, errorTexts: FORM_VALIDATION_ERRORS });
const signupFormClass = new Form({ formElement: signupForm, errorTexts: FORM_VALIDATION_ERRORS });

/* Функции */

// Открытие попапа
// function popupOpen(popup) {
//   popup.classList.add('popup_is-opened');
//   if (window.screen.availWidth <= 320) headerMenuOpenBtn.classList.add('header__menu-open_hidden');
// }

// Закрытие попапа
// function popupClose(event) {
//   event.target.closest('.popup').classList.remove('popup_is-opened');
//   if (window.screen.availWidth <= 320) headerMenuOpenBtn.classList.remove('header__menu-open_hidden');
// }

// показать кнупку меню для 320px
function showMobileMenu() {
  headerMenuOpenBtn.classList.remove('header__menu-open_hidden');
};

// скрыть кнопку меню для 320px
function hideMobileMenu() {
  headerMenuOpenBtn.classList.add('header__menu-open_hidden');
}

function clearLocalStorage(items) {
  items.forEach((elem) => {
    localStorage.removeItem(elem);
  })
}

// Выйти из личного кабинета
function logout() {
  // localStorage.removeItem('JWTnews');
  // localStorage.removeItem('userName');
  clearLocalStorage(['JWTnews', 'userName']);
  if (isMobile) showMobileMenu();
  HeaderClass.render({ isLoggedIn: false, userName: '' });
  // перерисовать иконки у статей
  const articles = results.querySelectorAll('.article');
  articles.forEach((elem) => {
    newsCardClass.renderIcon(false, elem.querySelector('.article__icon'), elem.querySelector('.article__tooltip'));
  });
};

// Авторизоваться
function login() {
  // popupOpen(document.querySelector('#popup-login'));
  popupSigninClass.open();
  if (isMobile) hideMobileMenu();
};

function loginLogout() {
  if (!!localStorage.getItem('JWTnews')) logout()
  else login();
};

/* Слушатели событий */

authorizationButton.addEventListener('click', () => { // клик по кнопке Аторизоваться/выход
  loginLogout();
});
authorizationPopupButton.addEventListener('click', () => { // клик по кнопке Авторизоваться/выход на 320px
  popupMenu.classList.add('popup-menu_hidden');
  if (isMobile) hideMobileMenu();
  loginLogout();
});

// Попап Вход
signinForm.addEventListener('submit', (event) => { //кнопка Войти
  event.preventDefault();
  // console.log(signinForm.querySelector('#email-signin').value, signinForm.querySelector('#password-signin').value);
  mainApi.signin({
    email: signinForm.querySelector('#email-signin').value,
    password: signinForm.querySelector('#password-signin').value,
  })
    .then((res) => {
      localStorage.setItem('JWTnews', res.token); //console.log('token', res.token);
      mainApi.getUserData()
        .then((data) => {
          popupSigninClass.close();
          showMobileMenu();
          localStorage.setItem('userName', data.name); //console.log('name', data.name);
          signinFormClass.clearForm();
          HeaderClass.render({ isLoggedIn: !!localStorage.getItem('JWTnews'), userName: data.name });
          const articles = results.querySelectorAll('.article');
          articles.forEach((elem) => {
            // console.log(elem, 'jwt', localStorage.getItem('JWTnews'));
            newsCardClass.renderIcon(false, elem.querySelector('.article__icon'), elem.querySelector('.article__tooltip'));
          });
        })
        // .catch((err) => {
        //   signinFormClass.setServerError(signinForm.querySelector('#error-signin'), ERROR_USER_NOT_FOUND);
        //   //localStorage.removeItem('JWTnews');
        //   //localStorage.removeItem('userName');
        //  clearLocalStorage(['JWTnews', 'userName']);
        // })
    })
    .catch((err) => {
      let errForUser = '';
      if (err.message === '404') errForUser = ERROR_USER_NOT_FOUND
      else errForUser = ERROR_AUTHORIZATION;
      signinFormClass.setServerError(signinForm.querySelector('#error-signin'), errForUser);
      // localStorage.removeItem('JWTnews');
      // localStorage.removeItem('userName');
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
  // console.log(signupForm.querySelector('#name-signup').value, signupForm.querySelector('#email-signup').value, signupForm.querySelector('#password-signup').value);
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
      // console.log(err.name, err.message);
      let errForUser = '';
      if (err.message === '409') errForUser = ERROR_CONFLICT
      else errForUser = ERROR_SIGNUP;

      signupFormClass.setServerError(signupForm.querySelector('#error-signup'), errForUser);
    });
});
closeSignupButton.addEventListener('click', () => {
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
popupSuccess.querySelector('.popup__login-button').addEventListener('click', (event) => { // кнопка Войти при успешной регистрации
  popupSuccessClass.close();
  popupSigninClass.open();
});

// Валидация форм
signinFormClass.setEventListeners();
signupFormClass.setEventListeners();

articlesGrid.addEventListener('click', (event) => {
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

/* Вызовы функций */

HeaderClass.render({ isLoggedIn: !!localStorage.getItem('JWTnews'), userName: localStorage.getItem('userName') });




// function getCardList(cards, from, to) {
//   console.log(from, to);
//   if (cards.length < to) to = cards.length;
//   if (cards.length > to) {
//     const btnMore = document.querySelector('.results__more-button');
//     btnMore.classList.remove('results__more-button_hidden');

//     const moreButtonClick = function() {
//       this.classList.add('results__more-button_hidden');
//       newsCardListClass.renderResults(getCardList(cards, to, to + CARDS_IN_LINE));
//       this.removeEventListener('click', moreButtonClick);
//     };
//     btnMore.addEventListener('click', moreButtonClick);
//   };
//   return cards.slice(from, to);
// }

const results = document.querySelector('.results');
const resultsError = results.querySelector('.results__error');
const notFound = document.querySelector('.not-found');
const preloader = document.querySelector('.preloader');
const searchInput = document.querySelector('.search__input');
const articles = document.querySelector('.articles');

const newsCardClass = new NewsCard({
  querySaveArticle: querySaveArticle,
  queryRemoveArticle: queryRemoveArticle,
  errorTexts: {
    errorForbidden: ERROR_FORBIDDEN,
    errorServer: ERROR_SERVER,
    errorNotFound: ERROR_ARTICLE_NOT_FOUND
  },
});
const renderCardIcon = (isSaved, elementIcon, elementTooltip) => new NewsCard({
  querySaveArticle: querySaveArticle,
  queryRemoveArticle: queryRemoveArticle,
  errorTexts: {
    errorForbidden: ERROR_FORBIDDEN,
    errorServer: ERROR_SERVER,
    errorNotFound: ERROR_ARTICLE_NOT_FOUND
  },
}).renderIcon(isSaved, elementIcon, elementTooltip);
const querySaveArticle = (newArticle) => new MainApi(
  {
    // baseUrl: 'https://api.search-news.gq/',
    baseUrl: 'http://localhost:3000/',
    headers: {
      'Content-Type': 'application/json',
    }
  }
).createArticle(newArticle);
const queryRemoveArticle = (articleId) => new MainApi(
  {
    // baseUrl: 'https://api.search-news.gq/',
    baseUrl: 'http://localhost:3000/',
    headers: {
      'Content-Type': 'application/json',
    }
  }
).removeArticle(articleId);
const newsCardListClass = new NewsCardList({
  initialCards: [],
  template: document.querySelector('#article'),
  container: articles,
  renderIcon: renderCardIcon,
  // querySaveArticle: querySaveArticle,
  // queryRemoveArticle: queryRemoveArticle,
  // errorTexts: {
  //   errorForbidden: ERROR_FORBIDDEN,
  //   errorServer: ERROR_SERVER,
  //   errorNotFound: ERROR_ARTICLE_NOT_FOUND
  // },
});
const newsApi = new NewsApi({
  baseUrl: 'https://newsapi.org/v2/',
  apiKey: API_KEY,
  endpoint: 'everything',
});
const mainApi = new MainApi({
  // baseUrl: 'https://api.search-news.gq/',
  baseUrl: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
  }
});

function validateUrl(url) {
  return /^https?:\/\/(www\.)?(((\d{1,3}\.){3}\d{1,3})|([А-ЯЁа-яё0-9][0-9А-ЯЁа-яё\-.]*\.[А-ЯЁа-яё]+|[a-zA-Z0-9][a-zA-Z0-9\-.]*\.[a-zA-Z]+))(:[1-9]\d{1,4})?(\/?[-0-9a-zA-Z&=?+%._]+)+\/?#?$/i.test(url);
}

function isCardCorrect(card) {
  if (!!card.source.name && !!card.description && !!card.title && !!card.publishedAt && validateUrl(card.urlToImage) && validateUrl(card.url)) return true
  else return false;
}

function getCardList(allCards, from) {
  let cardsLine = [];
  let newFrom = allCards.length; //console.log('allCards', allCards);
  allCards.slice(from).some((element, index) => {
    if (isCardCorrect(element)) {
      cardsLine.push(element);
      if (cardsLine.length === CARDS_IN_LINE) {
        newFrom = from + index + 1; //console.log('cardsLine', cardsLine);
        return true;
      };
    };
  });
  if (allCards.length > newFrom && allCards.slice(newFrom).some((element) => { if (isCardCorrect(element)) return true })) {
    const btnMore = document.querySelector('.results__more-button');
    btnMore.classList.remove('results__more-button_hidden');

    function moreButtonClick() {
      this.classList.add('results__more-button_hidden');
      newsCardListClass.renderResults(getCardList(allCards, newFrom), dateFormatingForCards, false, searchInput.value.trim());
      this.removeEventListener('click', moreButtonClick);

    };
    btnMore.addEventListener('click', moreButtonClick);
  };
  return cardsLine;
}

function showResults() {
  results.classList.remove('results_hidden');
}

function search() {
  const request = searchInput.value.trim().replace(/\s+/g, '+');
  const day = new Date();
  const dayTo = dateFormatingForSearch(day);
  day.setDate(day.getDate() - SEARCH_PERIOD);
  const dayFrom = dateFormatingForSearch(day);

  newsApi.getNews(request, 'ru', dayFrom, dayTo, PAGE_SIZE)
    .then((data) => {
      if (data.articles.length > 0) {
        // console.log('articles', data.articles);
        let cards = getCardList(data.articles, 0);
        if (cards.length > 0) {
          newsCardListClass.renderResults(cards, dateFormatingForCards, false, searchInput.value.trim());
          showResults();
        } else {
          newsCardListClass.renderNotFound(notFound);
        }
      } else {
        newsCardListClass.renderNotFound(notFound);
      };
      newsCardListClass.hideLoader(preloader);
    })
    .catch((err) => {
      console.log(err);
      const btnMore = document.querySelector('.results__more-button');
      newsCardListClass.removeShowMore(btnMore);
      newsCardListClass.hideLoader(preloader);
      newsCardListClass.renderError(resultsError, ERROR_NEWS_API);
      showResults();
    });
};

// function removeResults(btnMore, articles, results, resultsError, notFound) {
//   const btnMore = document.querySelector('.results__more-button');
//   newsCardListClass.removeShowMore(btnMore);
//   while (articles.firstChild) {
//     articles.removeChild(articles.firstChild);
//   };
//   if (!results.classList.contains('results_hidden')) results.classList.add('results_hidden');
//   if (!resultsError.classList.contains('results__error_hidden')) resultsError.classList.add('results__error_hidden');
//   if (!notFound.classList.contains('not-found_hidden')) notFound.classList.add('not-found_hidden');

// }

document.querySelector('.search__button').addEventListener('click', (event) => {
  event.preventDefault();
  if (searchInput.value === '') {
    searchInput.style.backgroundColor = '#7fffd4';
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
