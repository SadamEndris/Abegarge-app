import React from "react";
import bannerbg from "../../../assets/images/banner.jpg";
import { Link } from "react-router-dom";
const Banner = () => {
  return (
    <>
      <section
        className="video-section banner-container"
        style={{ backgroundImage: `url(${bannerbg})` }}
      >
        <div data-parallax='{"y": 50}' className="sec-bg banner-bg"></div>
        <div className="auto-container ">
          <h5 className="text-xs font-thin mb-2">Working since 1992</h5>
          <h2 className="font-sans pb-2">
            Tuneup Your Car <br />
            to Next Level
          </h2>
          <div className="video-box text-muted">
            <div className="video-btn ">
              <Link
                to="#"
                className="overlay-link lightbox-image video-fancybox ripple text-decoration-none"
              >
                <i className="flaticon-play"></i>
              </Link>
            </div>
            <div className="font-sans uppercase text-2xl text-white font-semibold">
              Watch intro video <br /> about us
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Banner;
