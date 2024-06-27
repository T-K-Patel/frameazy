import NavBar from "../layouts/Nav_bar";
import Footer from "../layouts/Footer";
import { Outlet } from "react-router";

const WithNav = () => {
  return (
    <>
      <NavBar
      // links={links}
      // showLoginLinks={showLoginLinks}
      // setShowLoginLinks={setShowLoginLinks}
      />
      <Outlet />
      <Footer />
    </>
  );
};

export default WithNav;
