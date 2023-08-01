import "components/Banner/Banner.css";

export default function Banner() {
  return (
    <div className="container">
      <section className="banner">
        <div className="image-container">
          <img
            className="image"
            src="https://www.iconarchive.com/download/i103365/paomedia/small-n-flat/calendar.1024.png"
          />{" "}
        </div>
        <div className="intro">
          <h1 className="evprep">
            Introducing Evprep - Your Ultimate Event Management Web Application!
          </h1>
          <p className="about">
            Welcome to EventWeather Planner, a cutting-edge web application
            designed to streamline your event planning experience and ensure
            you&apos;re always prepared for whatever Mother Nature throws your
            way. With our user-friendly interface and powerful features,
            organizing and tracking your events has never been easier!
          </p>
        </div>
      </section>
    </div>
  );
}
