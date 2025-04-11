import React from "react";
import CTA from "../components/Home/CTA";
import titleImg from "../../assets/images/33.jpg";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <>
      {/* page title  */}
      <section
        className="page-title"
        style={{ backgroundImage: `url(${titleImg})` }}
      >
        <div className="auto-container">
          <h2>Contact</h2>
          <ul className="page-breadcrumb">
            <li>
              <Link to="index.html">home</Link>
            </li>
            <li>Contact</li>
          </ul>
        </div>
        <h1 data-parallax='{"x": 200}'>Car Repairing</h1>
      </section>

      {/* <!--Contact Section--> */}
      <section className="contact-section">
        <div className="auto-container">
          <div className="row clearfix">
            {/* <!--Form Column--> */}
            <div className="form-column col-lg-7">
              <div className="inner-column">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56467167.351773135!2d-54.29950645420111!3d30.251834075500522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487099e1c60f4067%3A0x9bc1f61fec6a92fa!2sAutoserve%20Ltd!5e0!3m2!1sfr!2set!4v1744380892667!5m2!1sfr!2set"
                  width="600"
                  height="470"
                  style={{ border: "0", width: "100%" }}
                  allowfullscreen=""
                  frameborder="0"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            {/* Infor column  */}
            <div className="info-column col-lg-5">
              <div className="inner-column">
                <h4>Our Address</h4>
                <div className="text">
                  Completely synergize resource taxing relationships via premier
                  niche markets. Professionally cultivate one-to-one customer
                  service.
                </div>
                <ul>
                  <li>
                    <i className="flaticon-pin"></i>
                    <span>Address:</span> 54B, Tailstoi Town 5238 MT, La city,
                    IA 5224
                  </li>
                  <li>
                    <i className="flaticon-email"></i>
                    <span>email:</span> contact@buildtruck.com
                  </li>
                  <li>
                    <i className="flaticon-phone"></i>
                    <span>phone:</span> 1800 456 7890 / 1254 897 3654
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Contact Section */}
      <CTA />
    </>
  );
};

export default Contact;
