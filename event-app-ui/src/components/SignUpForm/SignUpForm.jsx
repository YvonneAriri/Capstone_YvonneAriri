import "components/SignUpForm/SignUpForm.css";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { SIGNUP_ENDPOINT_URL } from "src/api-key";

export default function SignUpForm() {
  const [fullname, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [type, setType] = useState("password");

  const navigate = useNavigate();
  //making a POST request to the endpoint to send data as the reuest payloads
  const register = (e) => {
    e.preventDefault();

    axios.post(`${SIGNUP_ENDPOINT_URL}`, {
      fullname: fullname,
      username: username,
      password: password,
      email: email,
      tel: tel,
    });

    navigate(`/login`);
  };

  const isDisabled =
    fullname === "" ||
    username === "" ||
    password === "" ||
    email === "" ||
    tel === "";

  return (
    <section className="container-form">
      <div className="signup-form">
        <div className="form-content">
          <header>SignUp</header>
          <form>
            <div className="input-box">
              <input
                autoComplete="off"
                type="text"
                id="fullname"
                onChange={(e) => {
                  setFullName(e.target.value.trim());
                }}
                placeholder="Fullname"
                required
              />
            </div>

            <div className="input-box">
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

            <div className="input-box">
              <input
                autoComplete="off"
                type="email"
                id="email"
                onChange={(e) => {
                  setEmail(e.target.value.trim());
                }}
                placeholder="Email"
                required
              />
            </div>
            <div className="input-box">
              <PhoneInput
                placeholder="Phone number"
                value={tel}
                onChange={setTel}
                disableAreaCodes={true}
              />
            </div>

            <div>
              <button
                disabled={isDisabled}
                className="button"
                onClick={register}
              >
                SignUp
              </button>
              <p className="account-exist">
                Already have an account?<Link to="/login">login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
