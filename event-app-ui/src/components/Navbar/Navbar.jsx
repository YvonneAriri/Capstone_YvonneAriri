import "components/Navbar/Navbar.css";
import { FaBars } from "react-icons/fa";

export default function Navbar() {
  return (
    <>
      <div className="navbar">
        <div>
          <p className="logo">Evprep</p>
        </div>

        <div className="header">
          {" "}
          <p className="menu">
            <FaBars />
          </p>
          <a href="#">Home</a>
          <a href="#">Services</a>
          <a href="#">About Us</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </>
  );
}
