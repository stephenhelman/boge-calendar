export const verifyUsername = (username) => {
  const userRegex = /^[A-z]{3,20}$/g;
  const correctUsername = userRegex.test(username);
  return correctUsername;
};

export const verifyPassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()<>,.])[A-Za-z\d!@#$%^&*()<>,.]{4,20}$/g;
  const correctPassword = passwordRegex.test(password);
  return correctPassword;
};

const isLetterCapital = (letter) => {
  const capitalRegex = /[A-Z]/g;
  const capital = capitalRegex.test(letter);
  return capital;
};

const isLetterLowercase = (letter) => {
  const lowercaseRegex = /[a-z]/g;
  const lowercase = lowercaseRegex.test(letter);
  return lowercase;
};

const isCharacterNumber = (character) => {
  const numberRegex = /[\d]/g;
  const number = numberRegex.test(character);
  return number;
};

const isCharacterSpecial = (character) => {
  const specialRegex = /[!@#$%^&*()<>,.]/g;
  const special = specialRegex.test(character);
  return special;
};

export const doesCapitalExist = (word) => {
  let result;
  for (let i = 0; i < word.length; i++) {
    result = isLetterCapital(word[i]);
    if (result) {
      break;
    }
  }
  return result;
};

export const doesLowercaseExist = (word) => {
  let result;
  for (let i = 0; i < word.length; i++) {
    result = isLetterLowercase(word[i]);
    if (result) {
      break;
    }
  }
  return result;
};
export const doesNumberExist = (word) => {
  let result;
  for (let i = 0; i < word.length; i++) {
    result = isCharacterNumber(word[i]);
    if (result) {
      break;
    }
  }
  return result;
};
export const doesSpecialExist = (word) => {
  let result;
  for (let i = 0; i < word.length; i++) {
    result = isCharacterSpecial(word[i]);
    if (result) {
      break;
    }
  }
  return result;
};
