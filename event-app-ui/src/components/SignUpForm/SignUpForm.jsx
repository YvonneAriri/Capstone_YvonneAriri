/* eslint-disable no-unused-vars */
import "components/SignUpForm/SignUpForm.css";
import axios from "axios";
import React, { useState } from "react";

export default function SignUpForm() {
  const [fullname, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [error, setError] = useState(false);

  const register = () => {
    axios
      .post(`http://localhost:3000/signUp`, {
        fullname: fullname,
        username: username,
        password: password,
        email: email,
        tel: tel,
      })
      .then((response) => {
        console.log("!!!", response);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      fullname.length == 0 ||
      username.length == 0 ||
      password.length == 0 ||
      email.length == 0 ||
      tel.length == 0
    ) {
      setError(true);
    }
  };

  return (
    <div className="signup-form">
      <form action="#" className="form-button" onSubmit={handleSubmit}>
        <h2>SignUp</h2>
        <div className="input-box">
          <input
            type="text"
            id="fullname"
            onChange={(e) => {
              setFullName(e.target.value);
            }}
            placeholder="Fullname"
          />
        </div>
        {error && fullname.length <= 0 ? (
          <label>fullname cannot be empty</label>
        ) : (
          ""
        )}
        <div className="input-box">
          <input
            type="text"
            id="username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="Username"
          />
        </div>
        {error && username.length <= 0 ? (
          <label>username cannot be empty</label>
        ) : (
          ""
        )}
        <div className="input-box">
          <input
            type="password"
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
          />
        </div>
        {error && password.length <= 0 ? (
          <label>password cannot be empty</label>
        ) : (
          ""
        )}
        <div className="input-box">
          <input
            type="email"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
          />
        </div>
        {error && email.length <= 0 ? <label>email cannot be empty</label> : ""}
        <div className="input-box">
          <input
            type="tel"
            id="Tel"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            onChange={(e) => {
              setTel(e.target.value);
            }}
            placeholder="Tel"
          />
        </div>
        {error && tel.length <= 0 ? <label>tel cannot be empty</label> : ""}

        <div>
          <button className="btn" onClick={register}>
            SignUp
          </button>
          <p>
            Already have an account<a href="">login</a>
          </p>
        </div>
      </form>
    </div>
  );
}
