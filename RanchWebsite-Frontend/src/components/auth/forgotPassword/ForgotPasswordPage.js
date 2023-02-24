import { useState } from "react";

import asyncAPICall from "../../../util/apiWrapper";
import Logo from "../../../static/images/logo.svg";

const ForgotPassword = (props) => {
  const [email, setEmail] = useState("");

  const routeChange = (route = "/login") => {
    props.history.push(route);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    asyncAPICall(
      "/user/pw_change_request",
      "POST",
      {
        email: email,
      },
      null,
      routeChange("/login/email/sent"),
      null,
      false
    );
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-wrapper">
        <div className="logo">
          <img src={Logo} alt="Logo" height="32px" />
        </div>

        <div className="recovery-wrapper">
          <h2>Recover Password</h2>

          <hr color="#6C8CB5" />

          <div>Don't worry, it happens to the best of us.</div>

          <input
            required
            type="email"
            placeholder="Your email here..."
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* TODO: Disable button if no email */}
          <button className="recovery-btn" type="submit" onClick={handleSubmit}>
            send me recovery link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
