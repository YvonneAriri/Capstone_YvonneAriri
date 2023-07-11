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

  return (
    <div className="signup-form">
      <form action="#" className="form-button">
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
        <div className="input-box">
          <input
            type="text"
            id="Tel"
            onChange={(e) => {
              setTel(e.target.value);
            }}
            placeholder="Tel"
          />
        </div>

        <div>
          <button className="btn" onClick={register}>
            SignUp
          </button>
        </div>
      </form>
    </div>
  );
}
