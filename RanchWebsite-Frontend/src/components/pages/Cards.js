import React from "react";
import "../../styles/pages/Cards.scss";
import "../../styles/pages/home.scss";
import CardItem from "./CardItem";

function Cards() {
  return (
    <div className="cards">
      <h1>Welcome to the Hamner Livestock Ranch.</h1>
      <h2>
        Learn about our sheep, the quality meat, and the wool they produce.{" "}
      </h2>
      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              src="images/IMG_2908.jpg"
              text="Interested in eating our lamb?"
              label="Meat"
              path="/meat"
            />
            <CardItem
              src="images/IMG_6580.JPG"
              text="Want to spin our wool?"
              label="Wool"
              path="/about_us"
            />
          </ul>
          <ul className="cards__items">
            <CardItem
              src="images/IMG_4581.JPG"
              text="Explore the new lambs"
              label="Lambs"
              path="/about_us"
            />
            <CardItem
              src="images/IMG_3012.PNG"
              text="Winners Circle"
              label="Awards"
              path="/products"
            />
            <CardItem
              src="images/IMG_2603.jpg"
              text="Explore Our Sheep"
              label="Sheep"
              path="/sign-up"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
