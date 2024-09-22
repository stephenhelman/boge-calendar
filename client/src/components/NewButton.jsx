import { useNavigate, useLocation } from "react-router-dom";

const NewButton = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const ADMIN_REGEX = /^\/admin(\/)?$/;

  let path;
  if (!ADMIN_REGEX.test(pathname)) {
    path = "/home/clients/new";
  } else {
    path = "/admin/users/new";
  }
  const handleNew = () => navigate(path);
  return <button onClick={handleNew}>+</button>;
};

export default NewButton;
