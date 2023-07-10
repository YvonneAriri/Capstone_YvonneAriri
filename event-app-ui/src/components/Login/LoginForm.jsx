/* eslint-disable no-unused-vars */
import "components/Login/LoginForm.css";
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const logIn = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/login", {
        username: username,
        password: password,
      })
      .then((result) => {
        console.log("!!!", result);
      });
  };

  return (
    <div className="Login">
      <form action="#" className="form-button">
        <h2>Login</h2>

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
            required
          />
        </div>
        <div>
          <button className="btn" onClick={logIn}>
            Login
          </button>
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/signup">
              <a href="">signUp</a>
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
