import "components/EditProfile/EditProfile.css";
import PropTypes from "prop-types";
import axios from "axios";
import { useState } from "react";

EditProfile.propTypes = {
  setOpenProfile: PropTypes.func.isRequired,
  fullname: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  tel: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

export default function EditProfile(props) {
  const { setOpenProfile, fullname, email, tel, username } = props;
  const [newFullname, setNewFullname] = useState(fullname);
  const [newEmail, setNewEmail] = useState(email);
  const [newTel, setNewTel] = useState(tel);

  const editProfile = () => {
    axios.post(`http://localhost:3000/editProfile`, {
      username: username,
      fullname: newFullname,
      email: newEmail,
      tel: newTel,
    });
  };
  const isDisabled = newFullname === "" || newEmail === "" || newTel === "";

  return (
    <>
      <button className="close-btn" onClick={() => setOpenProfile(false)}>
        X
      </button>
      <div className="edit-profile">
        <input
          className="edit-input"
          type="text"
          value={newFullname}
          placeholder="Fullname"
          onChange={(e) => {
            setNewFullname(e.target.value.trim());
          }}
        />

        <input
          className="edit-input"
          type="email"
          value={newEmail}
          placeholder="Email"
          onChange={(e) => {
            setNewEmail(e.target.value.trim());
          }}
        />

        <input
          className="edit-input"
          type="tel"
          value={newTel}
          placeholder="Tel"
          onChange={(e) => {
            setNewTel(e.target.value.trim());
          }}
        />
        <div className="center-btn">
          <button
            className="submit-btn"
            disabled={isDisabled}
            onClick={() => {
              setOpenProfile(false);
              editProfile();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}
