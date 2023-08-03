import "components/EventSection/EventSection.css";
import PropTypes from "prop-types";
import { useState } from "react";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { WEATHER_API } from "src/api-key";
import { Link } from "react-router-dom";

EventSection.propTypes = {
  events: PropTypes.array.isRequired,
  sectionTitle: PropTypes.string.isRequired,
};

export default function EventSection(props) {
  const { events, sectionTitle } = props;
  const [weatherInfo, setWeatherInfo] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);

  const dateConversionConfig = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  //created a function that once an event is hovered upon it shows the weather details
  const eventHovered = async (address, id) => {
    try {
      //uses the geocodeByAddress and getLatLng to convert the address name to coordinates (latittude and longitude)
      const results = await geocodeByAddress(address);

      const weather = await getLatLng(results[0]);
      const response = await fetch(
        `${WEATHER_API.base}weather?lat=${weather.lat}&lon=${weather.lng}&units=metric&APPID=${WEATHER_API.key}`
      );
      const data = await response.json();
      setWeatherInfo(data);
      setHoveredItem(id);
    } catch (error) {
      console.error("Error", error);
    }
  };

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className="event-section-title">{sectionTitle}</h2>

      <div className="event-view">
        {events.map((value, key) => {
          return (
            <div
              key={key}
              className="event"
              onMouseEnter={() => eventHovered(value.location, value.id)}
              onMouseLeave={() => {
                setHoveredItem(null);
                if (Object.keys(weatherInfo).length) {
                  setWeatherInfo({});
                }
              }}
            >
              <h2> {value.eventname}</h2>
              {hoveredItem === value.id ? (
                <div className="weather-info">
                  <p>{weatherInfo.name}</p>
                  <p>
                    <img
                      src={`http://openweathermap.org/img/w/${weatherInfo.weather?.[0]?.icon}.png`}
                      height={40}
                      width={40}
                    />
                    {weatherInfo.weather?.[0]?.description}
                  </p>
                  <p>{weatherInfo.main?.temp}&deg;C</p>
                  <p>{weatherInfo.weather?.[0]?.main}</p>
                </div>
              ) : (
                <>
                  {" "}
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
                </>
              )}
              <Link to={`/directions/${value.id}`}>
                <button className="moreDetails-btn">Navigation</button>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
