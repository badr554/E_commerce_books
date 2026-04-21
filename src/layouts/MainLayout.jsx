import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MainLayout() {
  return (
    <div className="layout-shell">
      <Header />

      <main className="layout-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
