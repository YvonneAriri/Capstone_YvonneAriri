import "components/Profile/Profile.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Popup from "components/Popup/Popup";
import Navbar from "components/Navbar/Navbar";
import EditProfile from "components/EditProfile/EditProfile";
import EventSection from "components/EventSection/EventSection";
import {
  PROFILE_ENDPOINT_URL,
  LOGOUT_ENDPOINT_URL,
  EVENTS_ENDPOINT_URL,
} from "src/api-key";

export default function Profile() {
  // assign the extracted value 'username' to id
  const [isUserProfileLoading, setIsUserProfileLoading] = useState(true);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const { username: id } = useParams();

  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [onGoingEvents, setOnGoingEvents] = useState([]);
  const [futureEvents, setFutureEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [isEventWeatherDetailOpen, setIsEventWeatherDetailOpen] =
    useState(false);

  const navigate = useNavigate();
  // sending an HTTP request to fetch the users profile information

  // includes cookies and and authentication headers in cross-origin request
  axios.defaults.withCredentials = true;
  useEffect(() => {
    async function getProfileInfo() {
      try {
        const response = await axios.get(`${PROFILE_ENDPOINT_URL}/${id}`);
        const { username: user, fullname, email, tel } = response.data;

        setUsername(user);
        setFullname(fullname);
        setEmail(email);
        setTel(tel);
        setIsUserProfileLoading(false);
      } catch (err) {
        setIsUserProfileLoading(false);
        navigate("/login");
      }
    }
    getProfileInfo();
  }, [id, navigate]);

  //once the logout button is clicked it redirects the person to the login page
  const handleLogout = async () => {
    try {
      await axios.get(`${LOGOUT_ENDPOINT_URL}`);
    } finally {
      navigate("/login");
    }
  };

  //fetches the event data and update the eventData state with the received data
  useEffect(() => {
    axios
      .get(`${EVENTS_ENDPOINT_URL}/${id}`)
      .then((res) => {
        setOnGoingEvents(res.data.onGoingEvents);
        setFutureEvents(res.data.futureEvents);
        setPastEvents(res.data.pastEvents);
        setIsEventsLoading(false);
      })
      .finally(() => {
        setIsEventsLoading(false);
      });
  }, [id]);

  return (
    <div className="profile-info">
      <Navbar />
      <h1 className="greeting">Welcome Back {username}!</h1>
      <div className="profile">
        <div className="profile-container">
          <h2 className="user-profile">User Profile</h2>
          {isUserProfileLoading ? (
            <h2 className="isLoading">Loading...</h2>
          ) : openProfile ? (
            <div className="editProfile">
              <EditProfile
                setOpenProfile={setOpenProfile}
                fullname={fullname}
                email={email}
                tel={tel}
                username={username}
              />
            </div>
          ) : (
            <div className="profileInfo">
              <p className="profile-details">Username: {username}</p>
              <hr />
              <p className="profile-details">Fullname: {fullname}</p>
              <hr />
              <p className="profile-details">Email: {email}</p>
              <hr />
              <p className="profile-details">Tel: {tel}</p>
              <div className="edit-logout-btn-container">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setOpenProfile(true);
                  }}
                >
                  Edit Profile
                </button>

                <button className="edit-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="listOfEvents">
          <div className="list-of-event-container">
            <div className="add-btn">
              <button
                className="plus-btn"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                +
              </button>
            </div>
            {isEventsLoading ? (
              <h2 className="isLoading">Loading.....</h2>
            ) : isOpen ? (
              <Popup setIsOpen={setIsOpen} username={username} />
            ) : (
              <div className="event-section">
                <EventSection
                  events={onGoingEvents}
                  sectionTitle="Ongoing events"
                  isEventWeatherDetailOpen={isEventWeatherDetailOpen}
                  setIsEventWeatherDetailOpen={setIsEventWeatherDetailOpen}
                />
                <EventSection
                  events={futureEvents}
                  sectionTitle="Future events"
                  isEventWeatherDetailOpen={isEventWeatherDetailOpen}
                  setIsEventWeatherDetailOpen={setIsEventWeatherDetailOpen}
                />
                <EventSection
                  events={pastEvents}
                  sectionTitle="Past events"
                  isEventWeatherDetailOpen={isEventWeatherDetailOpen}
                  setIsEventWeatherDetailOpen={setIsEventWeatherDetailOpen}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
