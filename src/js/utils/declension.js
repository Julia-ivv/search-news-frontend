export default function declension(num, words) {
  let result;
  let rest = num % 100;
  if (rest >= 5 && rest <= 20) {
    result = words[2];
  } else {
    rest = rest % 10;
    if (rest === 1) result = words[0]
    else if (rest >= 2 && rest <= 4) result = words[1]
    else result = words[2];
  };
  return result;
};