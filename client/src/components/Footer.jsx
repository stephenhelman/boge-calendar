import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Footer = () => {
  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  const { id, username } = useAuth();
  const navigate = useNavigate();

  const handleSettingsClicked = () => navigate(`/home/users/${id}`);
  const handleLogout = async () => {
    await sendLogout();
    navigate("/");
  };

  const logoutButton = <button onClick={handleLogout}>Logout</button>;

  const settingsButton = (
    <button onClick={handleSettingsClicked}>
      <FontAwesomeIcon icon={faGear} />
    </button>
  );
  return (
    <footer>
      {logoutButton}
      <div className="footerUser">
        <p>Active User: {username}</p>
        {settingsButton}
      </div>
    </footer>
  );
};

export default Footer;
