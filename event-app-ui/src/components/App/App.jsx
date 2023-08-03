import "components/App/App.css";
import LoginForm from "components/Login/LoginForm";
import SignUpForm from "components/SignUpForm/SignUpForm";
import Home from "components/Home/Home";
import { useState } from "react";
import Directions from "components//Directions/Directions";
import Profile from "components/Profile/Profile";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

export default function App() {
  const [isFetching, setIsFetching] = useState(true);
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/directions/:id"
            element={
              <Directions
                isFetching={isFetching}
                setIsFetching={setIsFetching}
              />
            }
          />
          <Route
            path="/profile/:username"
            element={
              <Profile isFetching={isFetching} setIsFetching={setIsFetching} />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
