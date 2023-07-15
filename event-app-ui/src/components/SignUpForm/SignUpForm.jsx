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
        {error && (fullname.length === 0 || fullname.trim().length === 0) ? (
          <label>fullname cannot be empty</label>
        ) : (
          ""
        )}
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
        {error && (username.length === 0 || username.trim().length === 0) ? (
          <label>username cannot be empty</label>
        ) : (
          ""
        )}
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
        {error && (password.length === 0 || password.trim().length === 0) ? (
          <label>passsword cannot be empty</label>
        ) : (
          ""
        )}
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
        {error && (email.length === 0 || email.trim().length === 0) ? (
          <label>email cannot be empty</label>
        ) : (
          ""
        )}
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
        {error && (tel.length === 0 || tel.trim().length === 0) ? (
          <label>tel cannot be empty</label>
        ) : (
          ""
        )}
        <div>
          <button className="btn" onClick={register}>
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
