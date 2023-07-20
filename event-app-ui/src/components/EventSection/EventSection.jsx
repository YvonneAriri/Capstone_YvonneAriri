import "components/EventSection/EventSection.css";
import PropTypes from "prop-types";

EventSection.propTypes = {
  events: PropTypes.array.isRequired,
  sectionTitle: PropTypes.string.isRequired,
};

export default function EventSection(props) {
  const { events, sectionTitle } = props;

  if (!events || events.length === 0) {
    return null;
  }

  return (
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
                {" "}
                {new Date(value.starttime)
                  .toLocaleDateString("en-US", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })
                  .replace(",", " -")}
              </p>
              <p>
                {new Date(value.endtime)
                  .toLocaleDateString("en-US", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })
                  .replace(",", " -")}
              </p>
              <button>More Details</button>
            </div>
          );
        })}
      </div>
    </>
  );
}
