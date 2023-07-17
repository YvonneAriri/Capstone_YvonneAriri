import "components/SignUpForm/SignUpForm.css";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUpForm() {
  const [fullname, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [error, setError] = useState(false);

  //making a POST request to the endpoint to send data as the reuest payloads
  const register = (e) => {
    e.preventDefault();
    if (
      fullname.length === 0 ||
      username.length === 0 ||
      password.length === 0 ||
      email.length === 0 ||
      tel.length === 0
    ) {
      setError(true);
    } else {
      axios.post(`http://localhost:3000/signUp`, {
        fullname: fullname,
        username: username,
        password: password,
        email: email,
        tel: tel,
      });
    }
  };
  //

  return (
    <section className="container-form">
      <div className="signup-form">
        <div className="form-content">
          <header>SignUp</header>
          <form>
            <div className="input-box">
              <input
                autoComplete="off"
                type="text"
                id="fullname"
                onChange={(e) => {
                  setFullName(e.target.value.trim());
                }}
                placeholder="Fullname"
                required
              />
            </div>
            {error &&
            (fullname.length === 0 || fullname.trim().length === 0) ? (
              <label>fullname cannot be empty</label>
            ) : (
              ""
            )}
            <div className="input-box">
              <input
                autoComplete="off"
                type="text"
                id="username"
                onChange={(e) => {
                  setUsername(e.target.value.trim());
                }}
                placeholder="Username"
                required
              />
            </div>
            {error &&
            (username.length === 0 || username.trim().length === 0) ? (
              <label>username cannot be empty</label>
            ) : (
              ""
            )}
            <div className="input-box">
              <input
                autoComplete="off"
                type="password"
                id="password"
                onChange={(e) => {
                  setPassword(e.target.value.trim());
                }}
                placeholder="Password"
                required
              />
            </div>
            {error &&
            (password.length === 0 || password.trim().length === 0) ? (
              <label>passsword cannot be empty</label>
            ) : (
              ""
            )}
            <div className="input-box">
              <input
                autoComplete="off"
                type="email"
                id="email"
                onChange={(e) => {
                  setEmail(e.target.value.trim());
                }}
                placeholder="Email"
                required
              />
            </div>
            {error && (email.length === 0 || email.trim().length === 0) ? (
              <label>email cannot be empty</label>
            ) : (
              ""
            )}
            <div className="input-box">
              <input
                autoComplete="off"
                type="tel"
                id="Tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                onChange={(e) => {
                  setTel(e.target.value.trim());
                }}
                placeholder="Tel"
                required
              />
            </div>
            {error && (tel.length === 0 || tel.trim().length === 0) ? (
              <label>tel cannot be empty</label>
            ) : (
              ""
            )}
            <div>
              <button className="input-box" onClick={register}>
                SignUp
              </button>
              <p className="account-exist">
                Already have an account?<Link to="/login">login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
