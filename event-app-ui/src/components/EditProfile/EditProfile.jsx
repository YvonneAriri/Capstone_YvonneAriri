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
  const [error, setError] = useState(false);

  const editProfile = () => {
    if (
      newFullname.length === 0 ||
      newEmail.length === 0 ||
      newTel.length === 0
    ) {
      setError(true);
    } else {
      axios.post(`http://localhost:3000/editProfile`, {
        username: username,
        fullname: newFullname,
        email: newEmail,
        tel: newTel,
      });
    }
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
      {error &&
      (newFullname.length === 0 || newFullname.trim().length === 0) ? (
        <label>fullname cannot be empty</label>
      ) : (
        ""
      )}
      <input
        className="edit-input"
        type="email"
        value={newEmail}
        placeholder="email"
        onChange={(e) => {
          setNewEmail(e.target.value.trim());
        }}
      />
      {error && (newEmail.length === 0 || newEmail.trim().length === 0) ? (
        <label>email cannot be empty</label>
      ) : (
        ""
      )}
      <input
        className="edit-input"
        type="tel"
        value={newTel}
        placeholder="Tel"
        onChange={(e) => {
          setNewTel(e.target.value.trim());
        }}
      />
      {error && (newTel.length === 0 || newTel.trim().length === 0) ? (
        <label>tel cannot be empty</label>
      ) : (
        ""
      )}
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
