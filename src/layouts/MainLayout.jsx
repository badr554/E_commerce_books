import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MainLayout() {
  return (
    <>
      <Header />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default MainLayout;