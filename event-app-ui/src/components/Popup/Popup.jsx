import PropTypes from "prop-types";
import axios from "axios";
import "components/Popup/Popup.css";
import { useState } from "react";

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
  const [error, setError] = useState(false);

  const { setIsOpen } = props;
  const { username } = props;

  const eventInput = () => {
    if (
      eventName.length === 0 ||
      description.length === 0 ||
      location.length === 0 ||
      startTime.length === 0 ||
      endTime.length === 0
    ) {
      setError(true);
    } else {
      axios.post(`http://localhost:3000/event_popup`, {
        eventName: eventName,
        description: description,
        location: location,
        startTime: startTime,
        endTime: endTime,
        username: username,
      });
    }

    if (
      eventName.length === 0 ||
      description.length === 0 ||
      location.length === 0 ||
      startTime.length === 0 ||
      endTime.length === 0
    ) {
      setError(true);
    }
  };

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
              id="inputCreateEvent"
              name="eventName"
              placeholder="eventName"
              onChange={(e) => {
                setEventName(e.target.value.trim());
              }}
            />
            {error &&
            (eventName.length === 0 || eventName.trim().length === 0) ? (
              <label>eventName cannot be empty</label>
            ) : (
              ""
            )}
            <input
              min={new Date().toISOString().slice(0, -8)}
              type="datetime-local"
              id="inputCreateEvent"
              placeholder="startTime"
              onChange={(e) => {
                setStartTime(e.target.value.trim());
              }}
            />
            {error &&
            (startTime.trim().length === 0 || startTime.trim().length === 0) ? (
              <label>startTime cannot be empty</label>
            ) : (
              ""
            )}
            <input
              min={new Date().toISOString().slice(0, -8)}
              id="inputCreateEvent"
              type="datetime-local"
              placeholder="endTime"
              onChange={(e) => {
                setEndTime(e.target.value.trim());
              }}
            />
            {error &&
            (endTime.trim().length === 0 || endTime.trim().length === 0) ? (
              <label>endTime cannot be empty</label>
            ) : (
              ""
            )}
            <input
              id="inputCreateEvent"
              name="location"
              placeholder="location"
              onChange={(e) => {
                setLocation(e.target.value.trim());
              }}
            />
            {error &&
            (location.trim().length === 0 || location.trim().length === 0) ? (
              <label>location cannot be empty</label>
            ) : (
              ""
            )}
            <input
              id="inputCreateEvent"
              name="description"
              placeholder="description"
              onChange={(e) => {
                setDescription(e.target.value.trim());
              }}
            />
            {error &&
            (description.trim().length === 0 ||
              description.trim().length === 0) ? (
              <label>description cannot be empty</label>
            ) : (
              ""
            )}

            <br />
            <button type="submit" onClick={eventInput}>
              Create Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
