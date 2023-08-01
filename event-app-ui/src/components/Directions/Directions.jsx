import "components/Directions/Directions.css";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { API_KEY } from "/src/api-key.js";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "components/Navbar/Navbar";
import {
  FaBicycle,
  FaWalking,
  FaBus,
  FaCar,
  FaTelegramPlane,
} from "react-icons/fa";

export default function Directions() {
  const { address } = useParams();
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [currentAddress, setCurrentAddress] = useState("");

  const destination = address.replace(/%20/g, " ");
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
  });

  // calculate the route from the user's location to the event's location
  async function calculateRoute(mode) {
    if (currentAddress === "" || destination === "") {
      return;
    }

    // eslint-disable-next-line no-undef
    const directionService = new google.maps.DirectionsService();
    const results = await directionService.route({
      origin: currentAddress,
      destination,
      travelMode: mode,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  // Integrated geolocation to get the users current browser location
  useEffect(() => {
    navigator.geolocation.watchPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setCenter({ lat: latitude, lng: longitude });

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
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
    });
  }, []);

  useEffect(() => {
    calculateRoute("DRIVING");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAddress, destination]);

  if (!isLoaded) {
    return <div>Loading.....</div>;
  }

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
          <div className="input">
            <p>{currentAddress} </p>
            <p>{destination}</p>
            <p>Distance: {distance}</p>
            <p>Duration: {duration}</p>
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
