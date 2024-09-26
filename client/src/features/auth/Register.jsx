import { useState } from "react";
import { Link } from "react-router-dom";
import useTitle from "../../hooks/useTitle";

const Register = () => {
  useTitle("Register Form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [initialLink, setInitialLink] = useState("");
  const [fundingLink, setFundingLink] = useState("");
  const [strategyLink, setStrategyLink] = useState("");
  const [validUsername, setValidUsername] = useState("");
  const [validPassword, setValidPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState("");
  const [toggle, setToggle] = useState(false);

  const handleNextClicked = () => setToggle(true);

  const handleBackClicked = () => setToggle(false);

  const handleFirsNameChanged = (e) => setFirstName(e.target.value);
  const handleLastNameChanged = (e) => setLastName(e.target.value);
  const handleEmailChanged = (e) => setEmail(e.target.value);
  const handleUsernameChanged = (e) => setUsername(e.target.value);
  const handlePasswordChanged = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChanged = (e) =>
    setConfirmPassword(e.target.value);
  const handleInitialLinkChanged = (e) => setInitialLink(e.target.value);
  const handleFundingLinkChanged = (e) => setFundingLink(e.target.value);
  const handleStrategyLinkChanged = (e) => setStrategyLink(e.target.value);

  let content;

  if (!toggle) {
    content = (
      <div className="welcomeContainer">
        <h1>Create an account</h1>
        <div className="inputContainer">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={handleFirsNameChanged}
            autoComplete="off"
            required
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={handleLastNameChanged}
            autoComplete="off"
            required
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChanged}
            autoComplete="off"
            required
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChanged}
            autoComplete="off"
            required
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChanged}
            autoComplete="off"
            required
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChanged}
            autoComplete="off"
            required
          />
        </div>
        <button type="button" onClick={handleNextClicked}>
          Next
        </button>
      </div>
    );
  }

  if (toggle) {
    content = (
      <div className="welcomeContainer">
        <h1>Create Your Appointment Schedule</h1>
        <div>
          <ol>
            <li>
              Create and customize your appointment schedule for the following
              appointment types:
              <ul>
                <li>Initial Meeting</li>
                <li>Funding Call</li>
                <li>Strategy Call</li>
              </ul>
            </li>

            <li>Get Access to your &quot;calendar link&quot;</li>

            <li>Enter you calendar links below</li>
          </ol>
        </div>
        <form>
          <div className="inputContainer">
            <label htmlFor="initial">Initial Meeting Link:</label>
            <input
              type="initial"
              value={initialLink}
              onChange={handleInitialLinkChanged}
              autoComplete="off"
              required
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="funding">Funding Call Link:</label>
            <input
              type="funding"
              value={fundingLink}
              onChange={handleFundingLinkChanged}
              autoComplete="off"
              required
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="strategy">Strategy Call Link:</label>
            <input
              type="strategy"
              value={strategyLink}
              onChange={handleStrategyLinkChanged}
              autoComplete="off"
              required
            />
          </div>
          <button>Register</button>
        </form>
        <button type="button" onClick={handleBackClicked}>
          Back
        </button>
      </div>
    );
  }

  return (
    <>
      <Link to="/">Return to Home</Link>
      {content}
    </>
  );
};

export default Register;

{
  /* <Link to="/create-calendar" target="_blank" rel="noopener noreferrer"></Link>
<Link to="/access-calendar" target="_blank" rel="noopener noreferrer"></Link>
<Link to="#enter-links"></Link> */
}
