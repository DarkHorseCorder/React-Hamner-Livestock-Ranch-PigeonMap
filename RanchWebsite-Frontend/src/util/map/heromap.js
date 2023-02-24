import React from "react";
import { useState } from "react";
import { Map, Marker } from "pigeon-maps";

// import { Button } from "../pages/Button";

import { Link } from "react-router-dom";
import "../../styles/pages/home.scss";
import "../../styles/pages/heromap.scss";
function HeroMap() {
  const [hue, setHue] = useState(0);
  const color = `hsl(${hue % 360}deg 39% 70%)`;
  return (
    <div className="maphero-container" style={{paddingTop : '5rem'}}>
      {/* <video src='/videos/video-1.mp4' autoPlay loop muted /> */}
      <h1>Tracking our finest fleeces!</h1>
      <div className="map">
        <Map
            className="actualmap"
            // height={300}
            defaultCenter={[64.160507,  -149.00000]}
            zoom={4}
            width={704}
            height={600}
        >
          <Marker
            width={50}
            anchor={[61.217381, -149.863129]}
            color={color}
            onClick={() => setHue(hue + 20)}
          />
          <Marker
            width={50}
            anchor={[63.335930,  -142.987701]}
            color={color}
            onClick={() => setHue(hue + 20)}
          />
          <Marker
            width={50}
            anchor={[61.581390, -149.439438]}
            color={color}
            onClick={() => setHue(hue + 20)}
          />
        </Map>
        <Map
          className="actualmap"
          // height={300}
          defaultCenter={[38.500000, -98.000000]}
          zoom={4.2}
          width={704}
          height={600}
        >
          <Marker
            width={50}
            anchor={[42.867483, -109.853346]}
            color={color}
            onClick={() => setHue(hue + 20)}
          />
          <Marker
            width={50}
            anchor={[27.994402, -81.760254]}
            color={color}
            onClick={() => setHue(hue + 20)}
          />
        </Map>
      </div>
      <div className="another_part">
        <h1>Tracking our finest fleeces!</h1>
      </div>
    </div>
  );
}

export default HeroMap;
