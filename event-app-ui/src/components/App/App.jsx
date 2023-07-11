import "components/App/App.css";
import LoginForm from "components/Login/LoginForm";
import SignUpForm from "components/SignUpForm/SignUpForm";

import Home from "components/Home/Home";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
