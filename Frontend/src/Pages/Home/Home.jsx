import "./Home.css";
import Hero from "../../components/Hero/Hero";
import Footer from "../../components/Footer/Footer";
import Canteen from "../../components/Canteen/Canteen";
import Booking from "../../components/Booking/Booking";

const Home = () => {
  return (
    <>
      <Hero />
      <Canteen />
      <Booking />
      <Footer />
    </>
  );
};

export default Home;
