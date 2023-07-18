import "components/Login/LoginForm.css";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const isDisabled = username === "" || password === "";

  // includes cookies and and authentication headers in cross-origin request
  axios.defaults.withCredentials = true;
  //sends the users credentials to the server
  const logIn = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/login", {
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
    <div className="Login">
      <form action="#" className="form-button">
        <h2>Login</h2>

        <div className="input-box">
          <input
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

        <div className="input-box" data-tip="8 characters minimum">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
            required
          />
        </div>
        <div className="error">{error}</div>
        <div>
          <br />
          <button disabled={isDisabled} className="btn" onClick={logIn}>
            Login
          </button>
          <p>
            Don&apos;t have an account? <Link to="/signup">signUp</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
