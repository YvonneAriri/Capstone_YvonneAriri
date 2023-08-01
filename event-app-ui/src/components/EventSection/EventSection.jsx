import "components/EventSection/EventSection.css";
import PropTypes from "prop-types";
import { useState } from "react";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { WEATHER_API } from "src/api-key";
import { Link } from "react-router-dom";

EventSection.propTypes = {
  events: PropTypes.array.isRequired,
  sectionTitle: PropTypes.string.isRequired,
  isEventWeatherDetailOpen: PropTypes.bool.isRequired,
  setIsEventWeatherDetailOpen: PropTypes.func.isRequired,
};

export default function EventSection(props) {
  const {
    events,
    sectionTitle,
    isEventWeatherDetailOpen,
    setIsEventWeatherDetailOpen,
  } = props;
  const [weatherInfo, setWeatherInfo] = useState({});

  const dateConversionConfig = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  //uses the geocodeByAddress and getLatLng to convert the address name to coordinates (latittude and longitude)
  const buttonPressed = async (address) => {
    try {
      const results = await geocodeByAddress(address);

      const weather = await getLatLng(results[0]);
      const response = await fetch(
        `${WEATHER_API.base}weather?lat=${weather.lat}&lon=${weather.lng}&units=metric&APPID=${WEATHER_API.key}`
      );
      const data = await response.json();
      setWeatherInfo(data);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const toggleModal = () => {
    setIsEventWeatherDetailOpen((prevValue) => !prevValue);
  };

  if (
    !events ||
    events.length === 0 ||
    (isEventWeatherDetailOpen && !Object.keys(weatherInfo).length)
  ) {
    return null;
  }

  return (
    <>
      {isEventWeatherDetailOpen ? (
        <div className="modal">
          <div className="overlay">
            <div className="modal-content">
              <button
                className="close-btn"
                onClick={() => {
                  if (Object.keys(weatherInfo).length) {
                    setWeatherInfo({});
                  }
                  toggleModal();
                }}
              >
                X
              </button>
              <div>
                <p>{weatherInfo.name}</p>
                <p>{weatherInfo.weather?.[0]?.description}</p>
              </div>
              <div>
                <h3>Temperature:</h3>
                <p>{weatherInfo.main?.temp}&deg;F</p>
              </div>
              <div>
                <p>{weatherInfo.weather?.[0]?.main}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h2 className="event-section-title">{sectionTitle}</h2>

          <div className="event-view">
            {events.map((value, key) => {
              return (
                <div key={key} className="event">
                  <h2> {value.eventname}</h2>
                  <p> {value.description}</p>
                  <p>{value.location}</p>
                  <p>
                    {new Date(value.starttime * 1000)
                      .toLocaleDateString("en-US", dateConversionConfig)
                      .replace(",", " -")}
                  </p>
                  <p>
                    {new Date(value.endtime * 1000)
                      .toLocaleDateString("en-US", dateConversionConfig)
                      .replace(",", " -")}
                  </p>
                  <div>
                    <button
                      className="moreDetails-btn"
                      onClick={() => {
                        toggleModal();
                        buttonPressed(value.location);
                      }}
                    >
                      Weather Details
                    </button>
                    <Link to={`/directions/${value.location}`}>
                      <button className="moreDetails-btn">Navigation</button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
