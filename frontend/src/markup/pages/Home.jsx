import About from "../components/Home/About";
import Banner from "../components/Home/Banner";
import CTA from "../components/Home/CTA";
import FeaturedServices from "../components/Home/FeaturedServices";
import ServicesSection from "../components/Home/ServicesSection";
import WhyUs from "../components/Home/WhyUs";

const Home = () => {
  return (
    <>
      <Banner />
      <About />
      <ServicesSection />
      <FeaturedServices />
      <WhyUs />
      <CTA />
    </>
  );
};

export default Home;
