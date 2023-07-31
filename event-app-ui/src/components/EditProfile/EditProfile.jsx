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
  const [preferredStartTime, setPreferredStartTime] = useState("");
  const [preferredEndTime, setPreferredEndTime] = useState("");

  const editProfile = () => {
    axios.post(`http://localhost:3000/editProfile`, {
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

  function timeToEpoch(timeString) {
    const [hours, minutes, seconds] = timeString.split(":");
    const dateObj = new Date();
    dateObj.setUTCHours(parseInt(hours, 10));
    dateObj.setUTCMinutes(parseInt(minutes, 10));
    dateObj.setUTCSeconds(seconds ? parseInt(seconds, 10) : 0);
    return dateObj.getTime() / 1000; // Divide by 1000 to get seconds instead of milliseconds
  }
  const handleStartChange = (e) => {
    setPreferredStartTime(e.target.value.trim());
  };
  const handleEndChange = (e) => {
    setPreferredEndTime(e.target.value.trim());
  };
  const timeString = "23:41:00";
  const epochTime = timeToEpoch(timeString);
  console.log(epochTime); // Output: 1674465660
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
        <label htmlFor="timeInput">Enter Time (HH:mm:ss):</label>
        <input
          className="edit-input"
          type="Time"
          step="1"
          value={preferredStartTime}
          placeholder="minStartTime"
          onChange={handleStartChange}
        />
        <label htmlFor="timeInput">Enter Time (HH:mm:ss):</label>
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
