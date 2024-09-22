import { useState, useEffect } from "react";
import {
  doesCapitalExist,
  doesLowercaseExist,
  doesNumberExist,
  doesSpecialExist,
} from "../../helpers/usersHelper";

const PasswordMessage = ({ password, setValidPassword }) => {
  const [minCharacters, setMinCharacters] = useState(false);
  const [maxCharacters, setMaxCharacters] = useState(false);
  const [capital, setCapital] = useState(false);
  const [lowercase, setLowercase] = useState(false);
  const [number, setNumber] = useState(false);
  const [special, setSpecial] = useState(false);

  useEffect(() => {
    if (password.length >= 4) setMinCharacters(true);
    if (password.length <= 20) setMaxCharacters(true);

    const capitalLetter = doesCapitalExist(password);
    if (capitalLetter) setCapital(true);

    const lowercaseLetter = doesLowercaseExist(password);
    if (lowercaseLetter) setLowercase(true);

    const numberCharacter = doesNumberExist(password);
    if (numberCharacter) setNumber(true);

    const specialCharacter = doesSpecialExist(password);
    if (specialCharacter) setSpecial(true);
  }, [password]);

  useEffect(() => {
    const passwordTest = [
      minCharacters,
      maxCharacters,
      capital,
      lowercase,
      number,
      special,
    ].every(Boolean);
    if (passwordTest) setValidPassword(true);
  }, [
    minCharacters,
    maxCharacters,
    capital,
    lowercase,
    number,
    special,
    password,
    setValidPassword,
  ]);

  const specialCharacters = "!@#$%^&*()<>,.";

  return (
    <div className="productField flexColumn">
      {!minCharacters ? (
        <p>-Your password must be at least 4 characters long.</p>
      ) : null}
      {!maxCharacters ? (
        <p>-Your password must not be longer than 20 characters long.</p>
      ) : null}
      {!capital ? <p>-Your password must contain one capital letter.</p> : null}
      {!lowercase ? (
        <p>-Your password must contain one lowercase letter.</p>
      ) : null}
      {!number ? <p>-Your password must contain one number.</p> : null}
      {!special ? (
        <p>{`-Your password must contain one special character (${specialCharacters})`}</p>
      ) : null}
    </div>
  );
};

export default PasswordMessage;
