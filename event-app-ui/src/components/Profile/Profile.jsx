import "components/Profile/Profile.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Popup from "components/Popup/Popup";
import Navbar from "components/Navbar/Navbar";
import EditProfile from "../EditProfile/EditProfile";

export default function Profile() {
  // assign the extracted value 'username' to id
  const { username: id } = useParams();

  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [openProfile, setOpenProfile] = useState(false);

  const navigate = useNavigate();
  // sending an HTTP request to fetch the users profile information

  // includes cookies and and authentication headers in cross-origin request
  axios.defaults.withCredentials = true;
  useEffect(() => {
    async function getProfileInfo() {
      try {
        const response = await axios.get(`http://localhost:3000/profile/${id}`);

        const { username: user, fullname, email, tel } = response.data;
        setUsername(user);
        setFullname(fullname);
        setEmail(email);
        setTel(tel);
      } catch (err) {
        navigate("/login");
      }
    }
    getProfileInfo();
  }, [id, navigate]);
  //once the logout button is clicked it redirects the person to the login page
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/logout");
    } finally {
      navigate("/login");
    }
  };
  //fetches thte event data and update the eventData state with the received data
  useEffect(() => {
    axios.get(`http://localhost:3000/events`).then((res) => {
      setEventData(res.data);
    });
  }, []);

  return (
    <div>
      <Navbar />
      {/* sending setIsOpen as props popup */}

      <button onClick={handleLogout}>Logout</button>
      <h1>Welcome {username}!</h1>
      <div className="profile">
        <div className="profile-container">
          <h1>User Profile</h1>
          <p>Username: {username}</p>
          {openProfile ? (
            <EditProfile
              setOpenProfile={setOpenProfile}
              fullname={fullname}
              email={email}
              tel={tel}
              username={username}
            />
          ) : (
            <div className="profileInfo">
              <p>Fullname: {fullname}</p>
              <p>Email: {email}</p>
              <p>Tel: {tel}</p>
              <button
                onClick={() => {
                  setOpenProfile(true);
                }}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
        <div className="listOfEvents">
          <div>
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
            {isOpen ? (
              <Popup setIsOpen={setIsOpen} username={username} />
            ) : (
              <div>
                {eventData.map((value, key) => {
                  if (value.username === username) {
                    return (
                      <div key={key} className="event">
                        <div className="event-container">
                          <h2>Event: {value.eventname}</h2>
                          <p>Description: {value.description}</p>
                          <p>Location: {value.location}</p>
                          <p>Start Time: {value.starttime}</p>
                          <p>End Time: {value.endtime}</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}