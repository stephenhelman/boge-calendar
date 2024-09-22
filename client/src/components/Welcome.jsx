import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import usePersist from "../hooks/usePersist";
import useTitle from "../hooks/useTitle";

const Welcome = () => {
  const [persist] = usePersist();
  const navigate = useNavigate();
  useTitle("Welcome");

  useEffect(() => {
    if (persist) {
      navigate("/home");
    }
  }, [persist, navigate]);

  return (
    <main>
      <div className="welcomeContainer">
        <div className="welcomeText">
          <h1 className="title">BOGE GROUP CALENDAR</h1>
          <div>
            <p>Please login below</p>
            <p>If you do not have an account, please register</p>
          </div>
        </div>
        <div className="welcomeLinks">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </main>
  );
};

export default Welcome;
