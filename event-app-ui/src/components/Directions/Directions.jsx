import "components/Directions/Directions.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "components/Navbar/Navbar";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import axios from "axios";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import {
  FaBicycle,
  FaWalking,
  FaBus,
  FaCar,
  FaTelegramPlane,
  FaWind,
  FaCloudShowersHeavy,
} from "react-icons/fa";
import {
  FIND_EVENT_ENDPOINT_URL,
  WEATHER_API,
  FORCAST_API,
  GOOGLEMAP_API_KEY_BASE,
  API_KEY,
} from "src/api-key";

const DATE_CONVERSION_CONFIG = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
};

const SECONDS_IN_A_DAY = 86400;
const SECONDS_IN_AN_HOUR = 3600;

export default function Directions() {
  const [isRouteLoading, setIsRouteLoading] = useState(true);
  const [isForecastLoading, setIsForecastLoading] = useState(true);
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [currentAddress, setCurrentAddress] = useState("");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [weatherNotice, setWeatherNotice] = useState(null);
  const [weatherForecastList, setWeatherForecastList] = useState(null);
  const [destination, setDestination] = useState("");
  const [startTime, setStartTime] = useState("");
  const [latestDeparture, setLatestDeparture] = useState(null);
  const [mode, setMode] = useState("");
  const { id } = useParams();

  //function that will calculate the difference between the event's start time and the current Date in seconds
  const secondsBetweenEpochs = (firstEpoch, secondEpoch) => {
    return (
      Math.abs(new Date(firstEpoch * 1000) - new Date(secondEpoch * 1000)) /
      1000
    );
  };

  //fetching the location and start time from the The endpoint FIND_EVENT_ENDPOINT_URL
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${FIND_EVENT_ENDPOINT_URL}/${id}`);
        setDestination(result.data.location);
        setStartTime(result.data.starttime);

        //calculates the difference between the start time and the current date
        //converts it to seconds and rounds it up to get the days between the start time and current date
        const daysFromNowTillEvent = Math.floor(
          secondsBetweenEpochs(result.data.starttime, Date.now() / 1000) /
            SECONDS_IN_A_DAY
        );

        // Forecast API only shows up to 5 days forecast every 3 hours, so we want to check for
        // what the weather forecast is for 3, 4, or 5 hours before the event start time
        if (daysFromNowTillEvent <= 5) {
          const results = await geocodeByAddress(result.data.location);

          //gets the latitude and longitude coordinates
          const { lat, lng } = await getLatLng(results[0]);
          const response = await fetch(
            `${FORCAST_API.base}forecast?lat=${lat}&lon=${lng}&appid=${WEATHER_API.key}`
          );
          const data = await response.json();
          //iterate through every data in the data list to get the dt which is the date and time in epoch format
          //and gets the hours by finding the difference between the start time and end time in seconds
          for (let info of data.list) {
            const hoursFromNowTillEvent = Math.floor(
              secondsBetweenEpochs(info.dt, result.data.starttime) /
                SECONDS_IN_AN_HOUR
            );

            if (hoursFromNowTillEvent <= 3) {
              setWeatherForecastList(data.list);
              setWeatherInfo(info);
              break;
            }
          }
        }
      } catch (error) {
        console.error("Error", error);
      } finally {
        setIsForecastLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // calculate the route from the user's location to the event's location
  async function calculateRoute(mode) {
    if (currentAddress === "" || destination === "") {
      setIsRouteLoading(false);
      return;
    }

    // eslint-disable-next-line no-undef
    const directionService = new google.maps.DirectionsService();
    const results = await directionService.route({
      origin: currentAddress,
      destination,
      travelMode: mode,
    });

    setMode(mode);
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
    setIsRouteLoading(false);

    //calculates the difference between the start time and duration in second to get the travel time
    const durationInSeconds = results.routes[0].legs[0].duration.value;
    const travelTimeInSeconds = startTime - durationInSeconds;

    const travelTime = new Date(travelTimeInSeconds * 1000)
      .toLocaleDateString("en-US", DATE_CONVERSION_CONFIG)
      .replace(",", " -");
    setLatestDeparture(travelTime);

    if (results) {
      if (weatherInfo?.dt < startTime) {
        const maxPercipitation = 0.1;
        const maxWindSpeed = 15;

        if (weatherInfo?.dt) {
          const percipitation = weatherInfo?.rain?.["3h"] || 0;
          const windSpeed = weatherInfo?.wind?.speed;

          const isRaining = percipitation > maxPercipitation;
          const isWindy = windSpeed > maxWindSpeed;

          //displays an alert that shows details on why the departure time has been updated
          if (isRaining) {
            setWeatherNotice({
              icon: <FaCloudShowersHeavy />,
              detail: `Your depature time has been updated as it is forecasted to rain at event location by ${new Date(
                startTime * 1000
              )
                .toLocaleString("en-US", DATE_CONVERSION_CONFIG)
                .replace(",", " -")}`,
            });
          } else if (isWindy) {
            setWeatherNotice({
              icon: <FaWind />,
              detail: `Your depature time has been updated as it is forecasted to be windy at event location by ${new Date(
                startTime * 1000
              )
                .toLocaleString("en-US", DATE_CONVERSION_CONFIG)
                .replace(",", " -")}`,
            });
          } else {
            setWeatherNotice(null);
          }

          const leaveEarly = isRaining || isWindy;

          // Calculates the departure time by finding the last time before event start time where the weather is neither windy nor rainy
          const getBestTimeToDepart = () => {
            for (let date of weatherForecastList) {
              const isRainyOrWindy =
                (date?.rain?.["3h"] || 0) > maxPercipitation ||
                date?.wind?.speed > maxWindSpeed;
              // If weather is good and forecast is for a time before event starts, set latest departure time, otherwise end iteration
              if (!isRainyOrWindy && date.dt < startTime) {
                return date.dt;
              } else {
                break;
              }
            }

            return travelTimeInSeconds; // Return default time if we can not find best possible time to leave (i.e all available forecast before start time is rainy or windy)
          };

          const departTime = leaveEarly
            ? getBestTimeToDepart()
            : travelTimeInSeconds;

          const datetime = new Date(departTime * 1000)
            .toLocaleString("en-US", DATE_CONVERSION_CONFIG)
            .replace(",", " -");
          setLatestDeparture(datetime);
        }
      }
    }
  }

  // Integrated geolocation to get the users current browser location
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCenter({ lat: latitude, lng: longitude });

        try {
          const response = await fetch(
            `${GOOGLEMAP_API_KEY_BASE}json?latlng=${latitude},${longitude}&key=${API_KEY}`
          );
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            setCurrentAddress(data.results[0].formatted_address);
          } else {
            setCurrentAddress("Address not found");
          }
        } catch (error) {
          setCurrentAddress("Error fetching address");
        }
      },
      undefined,
      { enableHighAccuracy: false, maximumAge: 60000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    //setting the default mode to DRIVING
    if (currentAddress && destination) {
      calculateRoute("DRIVING");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAddress, destination]);

  return (
    <>
      <div>
        <Navbar />
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{
            width: "100%",
            height: "800px",
            display: "flex",

            flexDirection: "column",
            alignItems: "center",
          }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <div className="navigation-details">
            {isRouteLoading || isForecastLoading ? (
              <h1>Loading...</h1>
            ) : (
              <>
                <p>
                  <span className="section">Origin</span>
                  {currentAddress}
                </p>
                <p>
                  <span className="section">Destination</span>
                  {destination}
                </p>
                <p>
                  <span className="section">Selected mode</span> {mode}
                </p>
                <p>
                  <span className="section">Distance</span> {distance}
                </p>
                <p>
                  <span className="section">Duration</span> {duration}
                </p>
                {latestDeparture && (
                  <p>
                    <span className="section">Latest Departure Time</span>
                    {latestDeparture}
                  </p>
                )}
                {weatherNotice && (
                  <p>
                    <span className="section alert">Alert</span>
                    {weatherNotice.icon} {weatherNotice.detail}
                  </p>
                )}
                <button onClick={() => map.panTo(center)}>
                  <FaTelegramPlane />
                </button>
                <button onClick={() => calculateRoute("DRIVING")}>
                  <FaCar />
                </button>
                <button onClick={() => calculateRoute("TRANSIT")}>
                  <FaBus />
                </button>
                <button onClick={() => calculateRoute("BICYCLING")}>
                  <FaBicycle />
                </button>
                <button onClick={() => calculateRoute("WALKING")}>
                  <FaWalking />
                </button>
              </>
            )}
          </div>

          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
    </>
  );
}
