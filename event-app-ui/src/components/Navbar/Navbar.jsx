import "components/Navbar/Navbar.css";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <>
      <div className="navbar">
        <a href="#">Home</a>
        <a href="#">Services</a>
        <a href="#">About Us</a>
        <a href="#">Contact</a>
      </div>
      <div className="btn">
        <Link to={"login"}>
          <button className="login-btn">Login</button>
        </Link>

        <Link to={"signup"}>
          <button className="signup-btn">SignUp</button>
        </Link>
      </div>
    </>
  );
}
