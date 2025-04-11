import React from "react";
import { Link } from "react-router-dom";
import titleImg from "../../assets/images/33.jpg";
import ServicesSection from "../components/Home/ServicesSection";
import WhyUs from "../components/Home/WhyUs";
import CTA from "../components/Home/CTA";

const Services = () => {
  return (
    <>
      {/* page title  */}
      <section
        class="page-title"
        style={{ backgroundImage: `url(${titleImg})` }}
      >
        <div class="auto-container">
          <h2>Services</h2>
          <ul class="page-breadcrumb">
            <li>
              <Link to="/">home</Link>
            </li>
            <li>Services</li>
          </ul>
        </div>
        <h1 data-parallax='{"x": 200}'>Car Repairing</h1>
      </section>
      <ServicesSection />
      <WhyUs />
      <CTA />
    </>
  );
};

export default Services;
