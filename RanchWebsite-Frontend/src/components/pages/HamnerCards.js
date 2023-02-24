import React from "react";
import "../../styles/pages/HamnerCards.scss";
import CardItem from "./CardItem";

function Cards() {
  return (
    <div className="hamnercards">
      <h1>About the Hamners.</h1>
      <h2>
        The ranch reloacated in Pinedale, Wyoming from Lyman in 2008. We sell
        lamb meat both by the package or by the whole lamb. Our meat is served
        at Half Moon Lake Resturaunt and is also available for purchase at
        Specialty Meats in the Pinedale Obo's gas station. We keep our freezer
        full of USDA lamb meat for those individuals who do not want to purchase
        a whole lamb and just want a few cuts. Our wool comes in Columbia and
        Columbia Rambouilet Cross. You can purchase black, silver, grey,
        charcoal, white, and a paint mix of black and white. Hand spinners from
        Alaska to Florida have purchased our fleeces and keep coming back.{" "}
      </h2>

      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              src="images/tanya.jpeg"
              text="Tanya Hamner is a PRCA Photographer and a photographer professor at Western Wyoming. She runs and operates the ranch from August to May, while traveling back and forth from the college to the ranch. In May she hits the road to rodeos and lives 8 seconds through the camera. Tanya is the one who organizes the sales for the meat and wool with individuals and customers. She also keeps our website up to date."
              label="Tanya Hamner"
              // path="/about_us"
            />
            <CardItem
              src="images/rex.jpeg"
              text="Rex Hamner has been teaching Agriculture Education for 37 years. He has been an Wyoming FFA Advisor for 33 years. He now teaches in Tok, Alaska as the vocational teacher. He coaches wrestling up there and helps out with dog sledding. He comes down in May to the ranch and operates it till August while Tanya is on the rodeo trail."
              label="Rex Hamner"
              // path="/about_us"
            />
            <CardItem
              src="images/gayle.jpeg"
              text="Gayle Hamner has been teaching as a paraeducator for 20 years and taught preschool up in Tok Alaska. She now helps Tanya with the ranch and is the Sublette County Special Olympics Coach. She has a gift when it comes to special needs people. She hits the road in the summer and travels with Tanya to most of the rodeos."
              label="Gayle Hamner"
              // path="/about_us"
            />
          </ul>
          {/* <ul className="cards__items">
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
          </ul> */}
        </div>
      </div>
    </div>
  );
}

export default Cards;
