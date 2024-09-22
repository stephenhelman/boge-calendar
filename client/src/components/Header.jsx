import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <Link to="/home">Home</Link>
      <Link to="/home/clients">Clients</Link>
    </header>
  );
};

export default Header;
