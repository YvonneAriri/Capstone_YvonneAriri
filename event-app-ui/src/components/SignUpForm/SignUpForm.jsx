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
    <div className="signup-form">
      <form>
        <h2>SignUp</h2>
        <div className="input-box">
          <input
            type="text"
            id="fullname"
            onChange={(e) => {
              setFullName(e.target.value.trim());
            }}
            placeholder="Fullname"
          />
        </div>
        <div className="input-box">
          <input
            type="text"
            id="username"
            onChange={(e) => {
              setUsername(e.target.value.trim());
            }}
            placeholder="Username"
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            id="password"
            onChange={(e) => {
              setPassword(e.target.value.trim());
            }}
            placeholder="Password"
          />
        </div>
        <div className="input-box">
          <input
            type="email"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value.trim());
            }}
            placeholder="Email"
          />
        </div>
        <div className="input-box">
          <input
            type="tel"
            id="Tel"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            onChange={(e) => {
              setTel(e.target.value.trim());
            }}
            placeholder="Tel"
          />
        </div>
        <div>
          <button disabled={isDisabled} className="btn" onClick={register}>
            SignUp
          </button>
          <p>
            Already have an account<Link to="/login">login</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
