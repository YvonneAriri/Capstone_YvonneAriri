import "components/Login/LoginForm.css";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  // includes cookies and and authentication headers in cross-origin request
  axios.defaults.withCredentials = true;
  //sends the users credentials to the server
  const logIn = (e) => {
    if (username.length === 0 || password.length === 0) {
      setError(true);
    } else {
      e.preventDefault();
      axios
        .post("http://localhost:3000/login", {
          username: username,
          password: password,
        })
        .then((result) => {
          // This redirects the user to his profilepage once the user successfully logs in
          navigate(`/profile/${result.data[0].username}`);
        });
    }
  };

  return (
    <section className="container-form">
      <div className="login-form">
        <div className="form-content">
          <header>Login</header>
          <form action="#" className="form-button">
            <div className="input-field">
              <input
                autoComplete="off"
                type="text"
                id="username"
                onChange={(e) => {
                  setUsername(e.target.value.trim());
                }}
                placeholder="Username"
                required
              />
            </div>
            {error &&
            (username.length === 0 || username.trim().length === 0) ? (
              <label>username cannot be empty</label>
            ) : (
              ""
            )}
            <div className="input-field">
              <input
                autoComplete="off"
                type="password"
                id="password"
                onChange={(e) => {
                  setPassword(e.target.value.trim());
                }}
                placeholder="Password"
                required
              />
            </div>
            {error &&
            (password.length === 0 || password.trim().length === 0) ? (
              <label>password cannot be empty</label>
            ) : (
              ""
            )}
            <div>
              <div>
                <button className="input-field" onClick={logIn}>
                  Login
                </button>
              </div>
              <div>
                <p className="account-exist">
                  Don&apos;t have an account? <Link to="/signup">signUp</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
