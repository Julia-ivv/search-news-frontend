export function keywordsToString(keywords, separator) {
  let keywordsString = '';
  keywords.forEach((element, ind) => {
    if (ind < keywords.length - 1) keywordsString += element.keyword + separator
    else keywordsString += element.keyword;
  });
  return keywordsString;
};

export function searchInSavedCard(alreadySavedCards, foundCard) {
  let isSaved = false;
  let idSavedCard = undefined;
  const savedCard = alreadySavedCards.find((savedCard) => savedCard.link === foundCard.url);
  if (!!savedCard) {
    isSaved = true;
    idSavedCard = savedCard._id;
  };
  return { isSaved, idSavedCard };
};