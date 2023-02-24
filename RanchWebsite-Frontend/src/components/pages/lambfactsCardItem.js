import React from "react";
import { Link } from "react-router-dom";

function LambFactsCardItem(props) {
  return (
    <>
      <li className="lambcards__item">
        <Link className="lambcards__item__link" to={props.path}>
          <figure
            className="lambcards__item__pic-wrap"
            data-category={props.label}
          >
            <img
              className="lambcards__item__img"
              alt="Travel Image"
              src={props.src}
            />
          </figure>
          <div className="lambcards__item__info">
            <h5 className="lambcards__item__text">{props.text}</h5>
          </div>
        </Link>
      </li>
    </>
  );
}

export default LambFactsCardItem;
