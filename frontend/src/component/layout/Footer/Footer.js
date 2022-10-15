import React from 'react';
import playstore from "../../../images/playstore.png";
import appstore from "../../../images/appstore.png"
import "./Footer.css"

const Footer = () => {
  return (
    <footer id="footer">
        <div className="leftFooter">
            <h4>Download our App</h4>
            <p>Available on Play Store and App Store</p>
            <img src={playstore} alt="PlayStore" />
            <img src={appstore} alt="AppStore" />
        </div>

        <div className="midFooter">
            <h1>CLICK 2 GET</h1>
            <p>Click 2 Get is a website that allows people to buy goods, services and digital products over the internet.</p>
            <p>Copyrights 2022 &copy; TEAM 72</p>
        </div>
        
        <div className="rightFooter">
            <h4>Follow Us</h4>
            <a href="www.google.com">Instagram</a>
            <a href="www.google.com">Youtube</a>
            <a href="www.google.com">Facebook</a>
        </div>
    </footer>
  )
}

export default Footer;