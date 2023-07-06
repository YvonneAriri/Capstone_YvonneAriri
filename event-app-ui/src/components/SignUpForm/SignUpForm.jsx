/* eslint-disable no-unused-vars */
import "./SignUpForm.css";
import React, { useState } from "react";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");

  return (
    <div className="signup-form">
      <form>
        <h2>SignUp</h2>
        <div>
          <label>Name:</label>
          <input
            type="text"
            id="name"
            onChange={(e) => {
              setName(e.target.value);
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
              id="tel"
              onChange={(e) => {
                setTel(e.target.value);
              }}
            />
          </div>
        </div>
        <div>
          <button>SignUp</button>
        </div>
      </form>
    </div>
  );
}
