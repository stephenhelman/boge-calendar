import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PasswordMessage from "./PasswordMessage";
import { useUpdateUserMutation } from "./usersApiSlice";
import useAuth from "../../hooks/useAuth";

const EditUserForm = ({ user }) => {
  const { firstName, lastName, email, username, calendarLinks, id } = user;
  const { initialLink, fundingLink, strategyLink } = calendarLinks;
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [editFirstName, setEditFirstName] = useState(firstName);
  const [editLastName, setEditLastName] = useState(lastName);
  const [editEmail, setEditEmail] = useState(email);
  const [editUsername, setEditUsername] = useState(username);
  const [editPassword, setEditPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [editInitialLink, setEditInitialLink] = useState(initialLink);
  const [editFundingLink, setEditFundingLink] = useState(fundingLink);
  const [editStrategyLink, setEditStrategyLink] = useState(strategyLink);
  const [validUsername, setValidUsername] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const [updateUser, { isError, isLoading, isSuccess, error }] =
    useUpdateUserMutation();

  const USER_REGEX = /^[A-z]{1,20}(\d{1,}\s?)?$/g;
  const PWD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()<>,.])[A-Za-z\d!@#$%^&*()<>,.]{4,20}$/g;

  useEffect(() => {
    setValidUsername(USER_REGEX.test(editUsername));
  }, [editUsername]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(editPassword));
  }, [editPassword]);

  let canSave;
  if (editPassword) {
    canSave = [validUsername, validPassword].every(Boolean) && !isLoading;
  } else {
    canSave = [validUsername].every(Boolean) && !isLoading;
  }

  const handleFirstNameChanged = (e) => setEditFirstName(e.target.value);
  const handleLastNameChanged = (e) => setEditLastName(e.target.value);
  const handleEmailChanged = (e) => setEditEmail(e.target.value);
  const handleUsernameChanged = (e) => setEditUsername(e.target.value);
  const handlePasswordChanged = (e) => setEditPassword(e.target.value);
  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (canSave) {
      if (editPassword) {
        await updateUser({
          id,
          firstName: editFirstName,
          lastName: editLastName,
          email: editEmail,
          username: editUsername,
          password: editPassword,
        });
      } else {
        await updateUser({
          id,
          firstName: editFirstName,
          lastName: editLastName,
          email: editEmail,
          username: editUsername,
        });
      }
      return navigate("/home");
    }
    return alert("Please check to make sure all fields are entered!");
  };
  const usernameEdit = isAdmin ? (
    <div>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={editUsername}
        onChange={handleUsernameChanged}
        required
      />
    </div>
  ) : null;

  return (
    <form onSubmit={handleSaveUser}>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          value={editFirstName}
          onChange={handleFirstNameChanged}
          required
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          value={editLastName}
          onChange={handleLastNameChanged}
          required
        />
      </div>
      <div></div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={editEmail}
          onChange={handleEmailChanged}
          required
        />
      </div>
      {usernameEdit}
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type={!showPassword ? "password" : "text"}
          id="password"
          value={editPassword}
          onChange={handlePasswordChanged}
        />
        <button type="button" onClick={handleShowPassword}>
          Show
        </button>
        {editPassword ? (
          <PasswordMessage
            password={editPassword}
            setValidPassword={setValidPassword}
          />
        ) : null}
      </div>
      <div></div>
      <div></div>
      <button type="submit">Save</button>
    </form>
  );
};

export default EditUserForm;
