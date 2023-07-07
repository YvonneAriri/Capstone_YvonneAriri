/* eslint-disable no-unused-vars */
import "./SignUpForm.css";
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
      <form>
        <h2>SignUp</h2>
        <div>
          <label>fullname:</label>
          <input
            type="text"
            id="fullname"
            onChange={(e) => {
              setFullName(e.target.value);
            }}
          />
        </div>

        <div>
          <label>Username:</label>
          <input
            type="text"
            id="username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <div>
            <label>Email:</label>
            <input
              type="text"
              id="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <label>Tel:</label>
            <input
              type="text"
              id="Tel"
              onChange={(e) => {
                setTel(e.target.value);
              }}
            />
          </div>
        </div>
        <div>
          <button onClick={register}>SignUp</button>
        </div>
      </form>
    </div>
  );
}
