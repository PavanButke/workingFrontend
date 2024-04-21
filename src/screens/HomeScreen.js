import React from "react";
import { useParams } from "react-router-dom";
import Header from "./../components/Header";
import ShopSection from "./../components/homeComponents/ShopSection";
import ContactInfo from "./../components/homeComponents/ContactInfo";
import CalltoActionSection from "./../components/homeComponents/CalltoActionSection";
import Footer from "./../components/Footer";

const HomeScreen = () => {
  window.scrollTo(0, 0);
  const { keyword, pagenumber } = useParams();

  return (
    <div>
      <Header />
      <ShopSection keyword={keyword} pagenumber={pagenumber} />
      <CalltoActionSection />
      <ContactInfo />
      <Footer />
    </div>
  );
};

export default HomeScreen;
