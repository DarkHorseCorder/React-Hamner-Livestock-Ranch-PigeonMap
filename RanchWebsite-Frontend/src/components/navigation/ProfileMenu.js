import { useRef, useEffect } from "react";

const ProfileMenu = (props) => {
  const menuRef = useRef();

  useEffect(() => {
    const menuOpen = props.menuOpen;

    if (menuOpen) {
      menuRef.current.focus();
    }
  }, [props.menuOpen]);

  const handleLinkClick = (link) => {
    props.setMenuOpen(!props.menuOpen);
    props.history.push(link);
  };

  return (
    <div
      ref={menuRef}
      id="dropdown-menu-wrapper"
      className="dropdown-menu-wrapper"
      tabIndex="0"
    >
      <h3>{props.userFullName}</h3>

      <div
        onClick={() => handleLinkClick(`/organization/${props.orgId}`)}
        className="org"
      >
        {props.orgName}
      </div>

      <div
        onClick={() => handleLinkClick(`/profile/edit/${props.userID}`)}
        className="link"
      >
        My Profile
      </div>

      <div
        onClick={() => handleLinkClick(`/organization/${props.orgId}`)}
        className="link"
      >
        My Account
      </div>

      <hr />

      <div onClick={() => handleLinkClick(`/login`)} className="link">
        Sign Out
      </div>
    </div>
  );
};

export default ProfileMenu;
