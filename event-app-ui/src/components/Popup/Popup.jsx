import PropTypes from "prop-types";
import axios from "axios";
import "components/Popup/Popup.css";
import { useState, useEffect } from "react";
import LocationSearchInput from "components/LocationSearchInput/LocationSearchInput";
import { MultiSelect } from "react-multi-select-component";
import qs from "qs";

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
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [error, setError] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [userPreference, setUserPreference] = useState(null);

  const dateConversionConfig = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const { username, setIsOpen } = props;

  const eventInput = async (e) => {
    const response = await axios.post(`http://localhost:3000/event_popup`, {
      eventName: eventName,
      description: description,
      location: location,
      startTime: startTime,
      endTime: endTime,
      username: username,
      selectedUsers: selectedUsers,
    });
    //sends an
    if (response.data.errorMessage) {
      e.preventDefault();
      setError(response.data.errorMessage);
    } else {
      setIsOpen(false);
      setError("");
    }
  };

  useEffect(() => {
    setError("");
  }, [startTime, endTime]);

  const findAvailability = async (e) => {
    e.preventDefault();
    setError("");
    try {
      //creates an array of the selected users and also includes the current user to find the gaps between them
      const participants = [
        ...selectedUsers.map((user) => user.label),
        username,
      ];
      //Serialize the 'params' object into a URL-encoded string with array values represented in square brackets format. This prepares the 'params' object for use in query parameters of a URL.
      const result = await axios.get("http://localhost:3000/find_availabilty", {
        params: {
          selectedUsers: participants,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "brackets" });
        },
      });

      //converting the epoch time to the local date time
      setGaps(
        result.data.gaps.map((gap) => {
          const startTime = new Date(gap.starttime * 1000)
            .toLocaleDateString("en-US", dateConversionConfig)
            .replace(",", " -");
          const endTime = new Date(gap.endtime * 1000)
            .toLocaleDateString("en-US", dateConversionConfig)
            .replace(",", " -");
          const label = startTime + " - " + endTime;

          return label;
        })
      );
      setUserPreference(result.data.userPreferredTimes);
    } catch (err) {
      console.error("error fetching data", err.message);
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get("http://localhost:3000/users");
        setUsers(
          response.data.map((data) => {
            return {
              label: data.username,
              value: data.username,
              //making the user name disabled in the dropdown menu
              disabled: data.username === username,
            };
          })
        );
      } catch (err) {
        console.error("error fetching data", err.message);
      }
    }
    getUsers();
  }, [username]);

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
              className="eventInput"
              autoComplete="off"
              id="inputCreateEvent"
              name="eventName"
              placeholder="Event name"
              maxLength="255"
              onChange={(e) => {
                setEventName(e.target.value.trim());
              }}
            />
            Start time:{" "}
            <input
              className="eventInput"
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
              className="eventInput"
              autoComplete="off"
              min={new Date().toISOString().slice(0, -8)}
              id="inputCreateEvent"
              type="datetime-local"
              placeholder="End time"
              onChange={(e) => {
                setEndTime(e.target.value.trim());
              }}
            />
            <LocationSearchInput
              setLocation={setLocation}
              className="eventInput"
            />
            <input
              autoComplete="off"
              className="eventInput"
              id="inputCreateEvent"
              name="description"
              maxLength="255"
              placeholder="Event description"
              onChange={(e) => {
                setDescription(e.target.value.trim());
              }}
            />
            <div className="checkbox_container">
              <input
                className="checkbox"
                checked={isChecked}
                type="checkbox"
                onChange={handleCheckboxChange}
              />
              <p>Add other participant</p>
            </div>
            {/* creates a drop down menu of all the users with the current user's name disabled */}
            {isChecked && (
              <MultiSelect
                options={users}
                value={selectedUsers}
                onChange={setSelectedUsers}
                labelledBy="Select"
              />
            )}
            {/* Show start and end time that works for all users if there are some selected participants. We do not repect our own preferences if event is just for us */}
            {userPreference && selectedUsers.length ? (
              <>
                This is the start and end time that works for all selected users
                on any day based on their preferences:
                <ul>
                  <li>{userPreference.starttime}</li>
                  <li>{userPreference.endtime}</li>
                </ul>
              </>
            ) : null}
            {gaps.length ? (
              <>
                These are the dates and times where all selected users do not
                have any events:
                <ul>
                  {gaps.map((gap, index) => {
                    return <li key={index}>{gap}</li>;
                  })}
                </ul>
              </>
            ) : null}
            <p className="error">{error}</p>
            <br />
            <button
              className="edit-btn"
              disabled={isDisabled}
              type="submit"
              onClick={eventInput}
            >
              Create Event
            </button>
            <button className="edit-btn" onClick={findAvailability}>
              Find Availability
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
