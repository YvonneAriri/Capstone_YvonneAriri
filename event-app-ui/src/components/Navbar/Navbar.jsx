import "components/Navbar/Navbar.css";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "components/Logo/Logo";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="navbar">
        <div>
          <Logo />
        </div>
        <p onClick={toggleMenu} className="menu">
          <FaBars />
        </p>
        <div className="header">
          <Link className={`navbar-item ${isOpen ? "show" : ""}`} to="/">
            Home
          </Link>
          <a className={`navbar-item ${isOpen ? "show" : ""}`}>Services</a>
          <a className={`navbar-item ${isOpen ? "show" : ""}`} href="#About-Us">
            About Us
          </a>
          <a
            className={`navbar-item ${isOpen ? "show" : ""}`}
            href="#contact-us"
          >
            Contact
          </a>
        </div>
      </div>
    </>
  );
}
