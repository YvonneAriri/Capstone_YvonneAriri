import "components/Home/Home.css";
import { Link } from "react-router-dom";
import Navbar from "components/Navbar/Navbar";
import Banner from "components/Banner/Banner";
import Footer from "components/Footer/Footer";

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
        <Banner />
        <Footer />
      </div>
    </div>
  );
}
