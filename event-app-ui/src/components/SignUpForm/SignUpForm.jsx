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

  //making a POST request to the endpoint to send data as the reuest payloads
  const register = (e) => {
    e.preventDefault();

    axios.post(`http://localhost:3000/signUp`, {
      fullname: fullname,
      username: username,
      password: password,
      email: email,
      tel: tel,
    });
  };

  const isDisabled =
    fullname === "" ||
    username === "" ||
    password === "" ||
    email === "" ||
    tel === "";

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

            <div>
              <button
                disabled={isDisabled}
                className="input-box"
                onClick={register}
              >
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
