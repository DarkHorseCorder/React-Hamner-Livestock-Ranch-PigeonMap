import React from "react";
import "../../styles/pages/HamnerCards.scss";
import CardItem from "./CardItem";
import "../../styles/pages/MeatCards.scss";
import LambFactsCardItem from "../pages/lambfactsCardItem";
import "../../styles/pages/lambcard.scss";
import Comment from "../../util/comments";

function Cards() {
  return (
    <div className="hamnercards">
      <h1>Our Meat.</h1>
      <h2>
        What makes our meat so tastey is the way the lambs are fed. They are fed
        Walton's alfalfa pellets mixed with 4-H grain (that is made up of oats ,
        barley, corn, molasses, canola, urea, and protein premix) with free
        choice grass hay. They are butchered between 150 - 200 pounds. Our lamb
        is served at Half Moon Lake Resturaunt and is also available for
        purchase at Obo's Specialty Meats Market.
      </h2>

      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              src="images/lambcuts.png"
              text="Whole Lamb Package comes with about 40-60 pounds of meat custom to your choice of how you want it cut. You have the option to keep your tongue, shanks, neck slices, how thick you want your chops, and many other choices. Lambs are butchered in November and the yearlings are butchered in the Spring or Early May."
              label="Buy Whole Lamb"
              // path="/about_us"
            />

            <CardItem
              src="images/manycuts.jpeg"
              text="If you do not need a whole lamb but want more than just individual cuts, we can put a half lamb package together for you. This usually includes 1 leg, 20 chops, 2-3 ground meat, and a roast.  Usually about 15-20 pounds of meat."
              label="Buy Half Lamb"

              // path="/about_us"
            />

            <CardItem
              src="images/leglamb.jpeg"
              text="Just need a few pieces of meat? We sell usda individual cuts just for you. You can purchase a leg, ground, shoulder chops, loin chops, stew cuts which are great for kabobs, or a roast."
              label="Purchase Individual Cuts"
              // path="/about_us"
            />
            <Comment />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
