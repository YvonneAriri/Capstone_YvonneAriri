import "components/Navbar/Navbar.css";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "components/Logo/Logo";

export default function Navbar() {
  return (
    <>
      <div className="navbar">
        <div>
          <Logo />
        </div>

        <div className="header">
          <p className="menu">
            <FaBars />
          </p>
          <Link className="navbar-item" to="/">
            Home
          </Link>
          <a className="navbar-item">Services</a>
          <a className="navbar-item" href="#About-Us">
            About Us
          </a>
          <a className="navbar-item" href="#contact-us">
            Contact
          </a>
        </div>
      </div>
    </>
  );
}
