import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import usePersist from "../hooks/usePersist";

const Footer = () => {
  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  const { id, username } = useAuth();
  const navigate = useNavigate();
  const [persist, setPersist] = usePersist();

  const handleSettingsClicked = () => navigate(`/home/users/${id}`);
  const handleLogout = async () => {
    if (persist) setPersist(false);
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
