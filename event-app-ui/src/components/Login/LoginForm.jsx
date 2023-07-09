/* eslint-disable no-unused-vars */
import "./LoginForm.css";
import axios from "axios";
import React, { useState } from "react";

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
      <form>
        <h2>LogIn</h2>
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
          <label>Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div>
          <button onClick={logIn}>Login</button>
        </div>
      </form>
    </div>
  );
}
