/* eslint-disable no-unused-vars */
import "./LoginForm.css";

export default function LoginForm() {
  return (
    <div className="Login">
      <form>
        <h2>LogIn</h2>
        <div>
          <label>Username:</label>
          <input type="text" id="username" />
        </div>

        <div>
          <label>Password</label>
          <input type="password" id="password" />
        </div>
        <div>
          <button>Log in</button>
        </div>
      </form>
    </div>
  );
}
