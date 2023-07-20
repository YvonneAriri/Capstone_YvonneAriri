import PropTypes from "prop-types";
import { useState } from "react";
import "components/LocationSearchInput/LocationSearchInput.css";
import PlacesAutocomplete from "react-places-autocomplete";

LocationSearchInput.propTypes = {
  setLocation: PropTypes.func.isRequired,
};

export default function LocationSearchInput(props) {
  const [address, setAddress] = useState("");
  const { setLocation } = props;

  const handleChange = (inputValue) => {
    setAddress(inputValue);
  };

  const handleSelect = (inputValue) => {
    setAddress(inputValue);
    setLocation(inputValue);
  };

  return (
    <PlacesAutocomplete
      value={address}
      debounce={200}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <input
            className="location-input"
            {...getInputProps({ placeholder: "Enter location for event..." })}
          />
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion, index) => {
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";

              const style = suggestion.active
                ? { backgroundColor: "#111", cursor: "pointer" }
                : { backgroundColor: "#111", cursor: "pointer" };
              return (
                <div
                  key={index}
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
}
