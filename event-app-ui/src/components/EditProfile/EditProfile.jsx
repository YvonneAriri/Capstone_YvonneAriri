import "components/EditProfile/EditProfile.css";
import PropTypes from "prop-types";
import axios from "axios";
import { useState } from "react";
import { EDIT_PROFILE_ENDPOINT_URL } from "src/api-key";
import PhoneInput from "react-phone-input-2";

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
  const [preferredStartTime, setPreferredStartTime] = useState("");
  const [preferredEndTime, setPreferredEndTime] = useState("");

  const editProfile = () => {
    axios.post(`${EDIT_PROFILE_ENDPOINT_URL}`, {
      username: username,
      fullname: newFullname,
      email: newEmail,
      tel: newTel,
      preferredstarttime: preferredStartTime,
      preferredendtime: preferredEndTime,
    });
  };
  const isDisabled =
    newFullname === "" ||
    newEmail === "" ||
    (newTel === "" && preferredStartTime === "" && preferredEndTime === "");

  const handleStartChange = (e) => {
    setPreferredStartTime(e.target.value.trim());
  };
  const handleEndChange = (e) => {
    setPreferredEndTime(e.target.value.trim());
  };

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
        <PhoneInput
          className="edit-phonenumber-input"
          placeholder="Phone number"
          value={newTel}
          onChange={setNewTel}
          disableAreaCodes={true}
        />

        <input
          className="edit-input"
          type="Time"
          step="1"
          value={preferredStartTime}
          placeholder="minStartTime"
          onChange={handleStartChange}
        />

        <input
          className="edit-input"
          type="Time"
          step="1"
          value={preferredEndTime}
          placeholder="maxEndTime"
          onChange={handleEndChange}
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
