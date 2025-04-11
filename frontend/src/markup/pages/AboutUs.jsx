import titleImg from "../../assets/images/33.jpg";
import repairImg from "../../assets/images/repair.jpg";
import { Link } from "react-router-dom";
import WhyUs from "../components/Home/WhyUs";
import About from "../components/Home/About";
import CTA from "../components/Home/CTA";

const AboutUs = () => {
  return (
    <>
      {/* page title */}
      <section
        className="page-title"
        style={{ backgroundImage: `url(${titleImg})` }}
      >
        <div className="auto-container">
          <h2>About us</h2>
          <ul className="page-breadcrumb">
            <li>
              <Link to="/">home</Link>
            </li>
            <li>About us</li>
          </ul>
        </div>
        <h1 data-parallax='{"x": 200}'>Car Repairing</h1>
      </section>

      {/* About Section  */}
      <section className="about-section-three">
        <div className="auto-container">
          <div className="row">
            <div className="col-lg-7">
              <div className="content">
                <h2 className="text-xs mb-4 font-thin">
                  We are highly skilled mechanics for your car repair
                </h2>
                <div className="text text-justify">
                  <p>
                    Bring to the table win-win survival strategies to ensure
                    proactive domination. At the end of the day, going forward,
                    a new normal that has evolved from generation X is on the
                    runway heading towards a streamlined cloud solution. User
                    generated content in real-time will have multiple
                    touchpoints for offshoring.
                  </p>
                  <p>
                    Capitalize on low hanging fruit to identify a ballpark value
                    added activity to beta test. Override the digital divide
                    with additional clickthroughs from DevOps. Nanotechnology
                    immersion along the information heading towards a
                    streamlined cloud solution. User generated content in
                    real-time will have multiple.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="image">
                <img src={repairImg} alt="repair-Image" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* why choose us  */}

      <About />
      <WhyUs />
      <CTA />
    </>
  );
};

export default AboutUs;
