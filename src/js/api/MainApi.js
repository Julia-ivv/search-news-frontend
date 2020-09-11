export default class MainApi {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  signup(newUser) {
    // регистрирует нового пользователя
    return fetch(this._baseUrl + 'signup', {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
       }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(new Error(res.status));
      })
      .catch((err) => Promise.reject(new Error(err.message)));
  }

  signin(user) {
    // аутентифицирует пользователя по почте и паролю
    return fetch(this._baseUrl + 'signin', {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        email: user.email,
        password: user.password,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(new Error(res.status));
      })
      .catch((err) => Promise.reject(new Error(err.message)));
  }

  getUserData() {
    // возвращает информацию о пользователе
    return fetch(this._baseUrl + 'users/me', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.getItem('JWTnews')}`
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(new Error(res.status));
      })
      .catch((err) => Promise.reject(new Error(err.message)));
  }

  getArticles() {
    // получает статьи
    return fetch(this._baseUrl + 'articles', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.getItem('JWTnews')}`
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(new Error(res.status));
      })
      .catch((err) => Promise.reject(new Error(err.message)));
  }

  createArticle(newArticle) {
    // создает статью
    return fetch(this._baseUrl + 'articles', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${localStorage.getItem('JWTnews')}`,
        'Content-Type': this._headers['Content-Type']
      },
      body: JSON.stringify({
        keyword: newArticle.keyword,
        title: newArticle.title,
        text: newArticle.text,
        date: newArticle.date,
        source: newArticle.source,
        link: newArticle.link,
        image: newArticle.image,
       }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(new Error(res.status));
      })
      .catch((err) => Promise.reject(new Error(err.message)));
  }

  removeArticle(articleId) {
    // удаляет статью
    return fetch(this._baseUrl + 'articles/' + articleId, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${localStorage.getItem('JWTnews')}`
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(new Error(res.status));
      })
      .catch((err) => Promise.reject(new Error(err.message)));
  }
}