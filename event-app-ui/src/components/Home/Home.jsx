import "components/Home/Home.css";
import { Link } from "react-router-dom";
import Navbar from "components/Navbar/Navbar";

export default function Home() {
  return (
    <div className="home">
      <Navbar />
      <div className="btn">
        {/* links the button login to the login page */}
        <Link to={"login"}>
          <button className="login-btn">Login</button>
        </Link>

        {/* links the button signup to the signup Page */}
        <Link to={"signup"}>
          <button className="signup-btn">SignUp</button>
        </Link>
      </div>
      <div>
        <h1>All About the App</h1>
      </div>
    </div>
  );
}
