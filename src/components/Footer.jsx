import { BookOpen } from "lucide-react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <BookOpen className="footer-brand-icon" />
          <span className="footer-brand-name">KotobOnline</span>
          <span className="footer-separator">.</span>
          <span className="footer-tagline">books worth keeping</span>
        </div>

        <p className="footer-copy">&copy; 2026 KotobOnline. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
