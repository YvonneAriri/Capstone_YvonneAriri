import "./App.css";
import LoginForm from "../Login/LoginForm";
import SignUpForm from "../SignUpForm/SignUpForm";
import Home from "../Home/Home";

export default function App() {
  return (
    <div>
      <Home />
      <SignUpForm />
      <LoginForm />
    </div>
  );
}
