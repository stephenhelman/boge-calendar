import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "./authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { PulseLoader } from "react-spinners";
import usePersist from "../../hooks/usePersist";
import useTitle from "../../hooks/useTitle";

const Login = () => {
  const userRef = useRef();
  useTitle("Login Form");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState(null);
  const [persist, setPersist] = usePersist();
  const [viewPassword, setViewPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleUsernameChanged = (e) => setUsername(e.target.value);
  const handlePasswordChanged = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);
  const handleViewPassword = () => setViewPassword((prev) => !prev);

  const canSubmit = [username, password].every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      setErrMsg("All fields are required");
      return;
    }
    try {
      const { accessToken } = await login({
        username: username.toLowerCase(),
        password,
      }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/home");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
        console.log("error 1");
      } else if (err.originalStatus === 400) {
        setErrMsg("Missing Username or Password");
        console.log("error 2");
      } else if (err.originalStatus === 401) {
        setErrMsg("Username or Password are Incorrect");
        console.log("error 3");
      } else if (err.originalStatus === 403) {
        navigate("/inactive");
      } else {
        setErrMsg(err.data?.message);
      }
    }
  };

  if (isLoading) return <PulseLoader color={"#000"} />;

  return (
    <main>
      <div className="container">
        <form onSubmit={handleSubmit} className="loginForm">
          <h1 className="title">Login</h1>
          <div className="inputContainer">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              ref={userRef}
              value={username}
              onChange={handleUsernameChanged}
              autoComplete="off"
              id="username"
              required
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="password">Password:</label>
            <input
              type={!viewPassword ? "password" : "text"}
              value={password}
              id="password"
              onChange={handlePasswordChanged}
              required
            />
            <button type="button" onClick={handleViewPassword}>
              show
            </button>
          </div>
          <button>Sign In</button>
          <div>
            <input
              id="persist"
              type="checkbox"
              onChange={handleToggle}
              checked={persist}
            />
            <label htmlFor="persist"> Remember me?</label>
          </div>
          <div>
            <p>Don&apos;t have an account?</p>
            <Link to="/register">Register here</Link>
          </div>
          <div className="error-container">
            <p className="loginError">{errMsg}</p>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
