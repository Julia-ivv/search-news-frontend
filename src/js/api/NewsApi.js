export default class NewsApi {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._apiKey = options.apiKey;
    this._endpoint = options.endpoint;
  }

  getNews(request, language, dayFrom, dayTo, pageSize) {
    // возвращает список новостей
    return fetch(`${this._baseUrl}${this._endpoint}?q=${request}&apiKey=${this._apiKey}&language=${language}&from=${dayFrom}&to=${dayTo}&pageSize=${pageSize}`, {
      method: 'GET',
    })
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(new Error(res.status));
      })
      .catch((err) => Promise.reject(new Error(err)));
  }
}