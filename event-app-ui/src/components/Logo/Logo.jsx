import logo from "components/Logo/logo.png";
import "components/Logo/Logo.css";

export default function Logo() {
  return (
    <div className="codelogo">
      <img className="logo" src={logo} />
    </div>
  );
}
