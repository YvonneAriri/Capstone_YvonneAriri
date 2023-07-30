import "components/Footer/Footer.css";
import {
  FaTwitterSquare,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";

export default function Footer() {
  return (
    <div className="footer">
      <div id="About-Us">
        <section className="banner">
          <div className="vision">
            <h2 className="evprep">Our Vision </h2>
            <p className="about">
              At Evprep, we envision a platform that empowers users to
              effortlessly store their event details, invite others to join
              their gatherings, and access essential weather information, all
              while benefitting from automatic navigation to their events. Our
              mission is to provide a seamless and user-friendly experience,
              making event planning and coordination a breeze. With Evprep,
              organizing and attending events becomes more efficient and
              enjoyable, allowing users to focus on creating memorable
              experiences.
            </p>
          </div>
          <div className="who-we-are">
            <h2 className="evprep">Who We Are</h2>
            <p className="about">
              We are a passionate team of developers, designers, and
              visionaries, driven by the desire to make a positive impact on the
              lives of our users. Our diverse and talented team collaborates to
              build intuitive and user-friendly features, ensuring that every
              interaction with Evprep is a delight.
            </p>
          </div>
        </section>
      </div>
      <div id="contact-us">
        <div className="socials">
          <h2 className="social"> Contact Us</h2>
          <p className="social">Email: aririyvonne@gmail.com</p>
          <p className="social">Phone: 469-346-5425</p>
          <p className="social">Address: 123 Fake Street, San Francisco, CA </p>
          <p className="social">
            Socials:&nbsp;
            <FaTwitterSquare />
            &nbsp;&nbsp;
            <FaInstagram />
            &nbsp;&nbsp;
            <FaFacebook />
            &nbsp;&nbsp;
            <FaLinkedin />
            &nbsp;&nbsp;
          </p>
        </div>
      </div>
    </div>
  );
}
