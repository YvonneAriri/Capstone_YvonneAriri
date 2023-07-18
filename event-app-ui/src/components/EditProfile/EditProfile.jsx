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

  return (
    <div className="edit-profile">
      <button className="close-button" onClick={() => setOpenProfile(false)}>
        X
      </button>
      <input
        className="edit-input"
        type="text"
        value={newFullname}
        placeholder="fullname"
        onChange={(e) => {
          setNewFullname(e.target.value.trim());
        }}
      />

      <input
        className="edit-input"
        type="email"
        value={newEmail}
        placeholder="email"
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

      <button
        onClick={() => {
          setOpenProfile(false);
          editProfile();
        }}
      >
        Submit
      </button>
    </div>
  );
}
