import "components/Login/LoginForm.css";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { LOGIN_ENDPOINT_URL } from "src/api-key";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [type, setType] = useState("password");

  const navigate = useNavigate();
  const isDisabled = username === "" || password === "";

  // includes cookies and and authentication headers in cross-origin request
  axios.defaults.withCredentials = true;
  //sends the users credentials to the server
  const logIn = (e) => {
    e.preventDefault();
    axios
      .post(`${LOGIN_ENDPOINT_URL}`, {
        username: username,
        password: password,
      })
      .then((result) => {
        // displays the error made in the serverside
        if (result.data.errorMessage) {
          setError(result.data.errorMessage);
        } else {
          // This redirects the user to his profilepage once the user successfully logs in

          navigate(`/profile/${result.data[0].username}`);
        }
      });
  };

  return (
    <section className="container-form">
      <div className="login-form">
        <div className="form-content">
          <form action="#" className="form-button">
            <header>Login</header>

            <div className="input-field">
              <input
                autoComplete="off"
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                required
                placeholder="Username"
              />
            </div>

            <div className="input-box">
              <input
                autoComplete="off"
                type={type}
                id="password"
                onChange={(e) => {
                  setPassword(e.target.value.trim());
                }}
                placeholder="Password"
                required
              />
              {type === "password" ? (
                <span className="icon" onClick={() => setType("text")}>
                  <FaEyeSlash />
                </span>
              ) : (
                <span className="icon" onClick={() => setType("password")}>
                  <FaEye />
                </span>
              )}
            </div>
            <div className="error">{error}</div>
            <div>
              <br />
              <button
                disabled={isDisabled}
                className="input-field"
                onClick={logIn}
              >
                Login
              </button>

              <p className="account-exist">
                Don&apos;t have an account? <Link to="/signup">signUp</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
