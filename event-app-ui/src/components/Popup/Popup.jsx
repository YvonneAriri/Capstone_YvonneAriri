import PropTypes from "prop-types";
import axios from "axios";
import "components/Popup/Popup.css";
import { useState } from "react";
import LocationSearchInput from "components/LocationSearchInput/LocationSearchInput";

Popup.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

export default function Popup(props) {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const { setIsOpen } = props;
  const { username } = props;

  const eventInput = () => {
    axios.post(`http://localhost:3000/event_popup`, {
      eventName: eventName,
      description: description,
      location: location,
      startTime: startTime,
      endTime: endTime,
      username: username,
    });
  };

  const isDisabled =
    (eventName === "" && description === "") ||
    location === "" ||
    startTime === "" ||
    endTime === "";

  return (
    <div className="popup-background">
      <div className="popup-container">
        <div className="content">
          <form>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              X
            </button>
            <p className="title">Eveprep</p>
            <input
              autoComplete="off"
              id="inputCreateEvent"
              name="eventName"
              placeholder="Event name"
              onChange={(e) => {
                setEventName(e.target.value.trim());
              }}
            />
            Start time:{" "}
            <input
              autoComplete="off"
              min={new Date().toISOString().slice(0, -8)}
              type="datetime-local"
              id="inputCreateEvent"
              placeholder="Start time"
              onChange={(e) => {
                setStartTime(e.target.value.trim());
              }}
            />
            End time:{" "}
            <input
              autoComplete="off"
              min={new Date().toISOString().slice(0, -8)}
              id="inputCreateEvent"
              type="datetime-local"
              placeholder="End time"
              onChange={(e) => {
                setEndTime(e.target.value.trim());
              }}
            />
            <LocationSearchInput setLocation={setLocation} />
            <input
              autoComplete="off"
              id="inputCreateEvent"
              name="description"
              placeholder="Event description"
              onChange={(e) => {
                setDescription(e.target.value.trim());
              }}
            />
            <br />
            <button disabled={isDisabled} type="submit" onClick={eventInput}>
              Create Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
