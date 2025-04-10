import React from "react";
import Contact from "./../../pages/Contact";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <>
      <section className="cta-section">
        <div className="wrapper-box ">
          <div className="left-column">
            <h3>Schedule Your Appointment Today</h3>
            <div className="text">
              Your Automotive Repair & Maintenance Service Specialist
            </div>
          </div>
          <div className="right-column">
            <div className="phone">1800.456.7890</div>
            <div className="btn">
              <Link to="/contact" className="theme-btn btn-style-one">
                <span>contact us</span>
                <i className="flaticon-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTA;
