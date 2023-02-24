// TODO: Cookie cleanup. Wire up props.from
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

import Logo from "../../../static/images/logo.svg";
import logout from "../../../util/logout";
import { awaitAPICall } from "../../../util/apiWrapper";

const LoginPage = (props) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [from, setFrom] = useState("");

  useEffect(() => {
    setFrom(props.from || "/home");
    logout();
  }, [props.from]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form_body = new FormData(e.target);

    awaitAPICall(
      "/user/auth",
      "POST",
      Object.fromEntries(form_body),
      (response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          const error_msg = "Invalid Email/Password";

          setErrorMsg(error_msg);

          return null;
        } else if (response.status === 403) {
          const error_msg =
            "Your account has been deactivated. Please contact your administrator.";

          setErrorMsg(error_msg);

          return null;
        }
      },
      (data) => {
        if (data) {
          let auth_token = data.auth_token;
          let user_role = data.user.role;
          let user_name = data.user.first_name;
          let org_id_cookie = data.user.org_id;

          Cookies.set("auth_token", auth_token);
          Cookies.set("user_role", user_role);
          Cookies.set("user_name", user_name);
          Cookies.set("org_id", org_id_cookie);
          Cookies.set("auth_expires", data.expiration);

          props.setAuthToken(auth_token);
          props.history.push(from);
        }
      },
      null,
      null,
      false
    );
  };

  return (
    <div className="login-page-container">
      <div className="login-page-wrapper">
        <img src={Logo} alt="Logo" height="32px" />

        <div className="form-wrapper">
          <h2>Please log in</h2>
          <div className="error-message">{errorMsg}</div>

          <form className="login-form" onSubmit={handleSubmit} method="POST">
            <div className="email-wrapper">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" width="10px" />
            </div>

            <div className="password-wrapper">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" />
            </div>

            <div className="fp-login-link">
              <Link className="no-decoration" to="/login/password/recovery">
                Forgot Password?
              </Link>
            </div>

            {/* TODO: Disable button if no email */}
            <button className="login-button" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
