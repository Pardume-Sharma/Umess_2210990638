// import React from 'react'
import "./Footer.css";

export default function Footer() {
  return (
    <>
      <footer className="footer" id="ftr">
        <div className="col">
          <a href="https://instagram.com/" target="_blank" className="ftr-links">
            Instagram
          </a>
          <a href="" className="ftr-links">
            Whatsapp
          </a>
          <a href="" className="ftr-links">
            Facebook
          </a>
        </div>
        <div className="col">
          <a href="#services" className="ftr-links">
            Breakfast
          </a>
          <a href="#services" className="ftr-links">
            Lunch
          </a>
          <a href="#services" className="ftr-links">
            Snacks
          </a>
          <a href="#services" className="ftr-links">
            Dinner
          </a>
        </div>
        <div className="col">
          <a href="tel: +91 7973789157" className="ftr-links">
            Call Us
          </a>
          <a href="mailto:linkinpardume07@gmail.com" className="ftr-links">
            Mail Us
          </a>
          <a href="Sangrur,Punjab" className="ftr-links">
            Reach Us
          </a>
        </div>
      </footer>
    </>
  );
}
