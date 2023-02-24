import React from "react";
// import "../../styles/pages/home.scss";
import { Button } from "../pages/Button";
import "../../styles/pages/HeroSection.scss";
import { Link } from "react-router-dom";
import "../../styles/pages/home.scss";
function HeroSection() {
  return (
    <div className="hero-container">
      <video src="/videos/hamnerclip2.mp4" autoPlay loop muted />
      {/* <video src='/videos/video-1.mp4' autoPlay loop muted /> */}
      <h1>HAMNER LIVESTOCK RANCH</h1>
      <p>Serving Qaulity Meat to Resturaunts and Individuals</p>
      <p>Raising Columbia Breeding Sheep and Natural Colored Columbia's.</p>
      <p>
        We sale white, black, grey, silver, and black and white(paints) fleeces
        to handspinners.
      </p>
      <div className="hero-btns">
        {/* <Button
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
        >
          GET STARTED
        </Button> */}
        <Link to="/trailer">
          <Button
            className="btns"
            buttonStyle="btn--primary"
            buttonSize="btn--large"
            onClick={console.log("hey")}
          >
            WATCH TRAILER <i className="far fa-play-circle" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default HeroSection;
