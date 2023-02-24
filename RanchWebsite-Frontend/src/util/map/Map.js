import React from "react";
import { useState } from "react";
import { Map, Marker } from "pigeon-maps";

export default function Maps() {
  const [hue, setHue] = useState(0);
  const color = `hsl(${hue % 360}deg 39% 70%)`;
  return (
    <div className="map">
      <h1>Tracking our finest fleeces!</h1>
      <Map
        height={300}
        // defaultCenter={[42.867483, -109.853346]}
        zoom={3}
        // top={calc((100 % -300) / 2)}

        width={408}
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
  );
}
