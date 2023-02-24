import React from "react";
// import "../../styles/pages/home.scss";

// import "../../styles/pages/HeroSection.scss";
import video from "../../static/videos/hamner.mp4";
export default function Trailer() {
  return (
    // <h1 className="services">Trailer</h1>;
    <div className="hero-container">
      <video src={video} width="100%" controls="controls" autoplay="true" />
    </div>
  );
}
