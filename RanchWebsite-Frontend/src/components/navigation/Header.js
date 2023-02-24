import React, { useState, useEffect, useContext } from "react";
import { Button } from "../pages/Button";

import { Link, useHistory } from "react-router-dom";
import "../../styles/pages/header.scss";
import "../navigation/Header";
import Logo from "../../static/images/logo2.png";
import SecurityWrapper from "../auth/SecurityWrapper";
import ProfileMenu from "../navigation/ProfileMenu";
import { MeContext } from "../routing/DefaultContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Navbar(props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const me = useContext(MeContext);
  // const { searchTerm, setSearchTerm, history } = props;

  const redirectTo = (path) => {
    history.push(path);
  };

  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  let user = JSON.parse(localStorage.getItem("user-info"));
  const history = useHistory();
  function logOut() {
    localStorage.clear();
    history.push("/login");
  }

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener("resize", showButton);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link className="logo-wrapper nav-item" to="/home">
            <img src={Logo} alt="logo" height="68px" />
          </Link>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            {/* <SecurityWrapper roles="super-admin"> */}
            {/* <li className="nav-item">
              <Link
                to="/products"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Products
              </Link>
            </li> */}
            <li className="nav-item">
              <Link
                to="/organizations"
                className="nav-links"
                onClick={closeMobileMenu}
                // roles="super-admin"
              >
                Organizations
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/users" className="nav-links" onClick={closeMobileMenu}>
                Users
              </Link>
            </li>
            {/* </SecurityWrapper>
            <SecurityWrapper roles="admin"> */}
            <li className="nav-item">
              <Link to="/sheep" className="nav-links" onClick={closeMobileMenu}>
                The Sheep
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link
                to="/registration"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Registrations
              </Link>
            </li> */}
            {/* </SecurityWrapper> */}
            <div className="menu-icon" onClick={handleClick}>
              <i className={click ? "fas fa-times" : "fas fa-bars"} />
            </div>

            <li className="nav-item">
              <Link
                to="/about_us"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/meat" className="nav-links" onClick={closeMobileMenu}>
                Meat
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/map" className="nav-links" onClick={closeMobileMenu}>
                Map
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link
                // to="/about_us"
                title={user && user.name}
                className="nav-links"
                onClick={logOut}
              >
                LogOut
              </Link>
            </li> */}

            <li className="nav-item">
              <Link to="/login" className="nav-links" onClick={closeMobileMenu}>
                Log In
              </Link>
            </li>
            {/* <li>
              <Link
                to="/sign-up"
                className="nav-links-mobile"
                onClick={closeMobileMenu}
              >
                Sign Up
              </Link>
            </li> */}
            {/* 
            <li className="nav-item">
              <Link
                // title={user && user.name}
                // to="/home"
                className="nav-links-mobile"
                // onClick={closeMobileMenu}
              >
                Logout
              </Link>
            </li> */}
          </ul>
          {/* {button && <Button buttonStyle="btn--outline">SIGN UP</Button>} */}
          {/* <div onClick={() => setMenuOpen(!menuOpen)} className="users_name">
            {me.first_name}&nbsp;&nbsp;
            <FontAwesomeIcon
              icon={`fas fa-chevron-${menuOpen ? "up" : "down"}`}
            />
          </div> */}

          {/* {menuOpen ? (
            <ProfileMenu
              {...props}
              userFullName={me.first_name + " " + me.last_name}
              orgName={me.organization?.name}
              orgId={me.org_id}
              userID={me.user_id}
              setMenuOpen={setMenuOpen}
              menuOpen={menuOpen}
            />
          ) : (
            ""
          )} */}
        </div>
        {/* <div className="btn-dark">
          <Link to="/register">
            <button style={{ cursor: "pointer" }}>Sign Up</button>
          </Link>
        </div> */}
      </nav>
    </>
  );
}

export default Navbar;
