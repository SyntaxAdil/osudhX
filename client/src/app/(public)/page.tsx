import React from "react";
import Banner from "../../components/pages/public/home/banner";
import { Capabilities } from "../../components/pages/public/home/capabilities";
import { FeaturedMedicines } from "../../components/pages/public/home/featured-medicine";

const Home = () => {
  return (
    <main>
      <div className="h-16"></div>
      <Banner />
      <Capabilities />
      <FeaturedMedicines/>
    </main>
  );
};

export default Home;
