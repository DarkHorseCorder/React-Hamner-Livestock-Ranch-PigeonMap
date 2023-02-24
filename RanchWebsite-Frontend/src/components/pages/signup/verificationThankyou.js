import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Logo from "../../../img/famlinc-logo.png";
import Button from "../../core/Button";
import asyncAPICall from "../../../util/apiWrapper";
import Loading from "../../core/loading";

const VerificationThankYou = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const encodedString = props.match.params.encoded;

    asyncAPICall(
      `/user/email_verified/${encodedString}`,
      "GET",
      null,
      (res) => {
        if (res.status === 200) {
          setIsLoading(false);
          setVerified(true);
        } else {
          setIsLoading(false);
          setVerified(false);
        }
      },
      null,
      (err) => {
        setIsLoading(false);
        console.error("Email verify error", err);
      },
      false
    );
  }, [props.match.params.encoded]);

  if (isLoading) {
    return <Loading />;
  }

  if (!verified) {
    return (
      <div className="email-verification-thank-you-wrapper">
        <a href="/login">
          <img src={Logo} alt="FamLinc-logo" />
        </a>
        <div className="text-wrapper">
          <h2>Uh-Oh! It looks like you will need to request a new link.</h2>

          <Link to="/verify-email">
            <Button
              className="verify-btn"
              variant="dark"
              type="submit"
              command="Request A New Link"
            />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="email-verification-thank-you-wrapper">
      <Link to="/sign-in">
        <img src={Logo} alt="FamLinc-logo" />
      </Link>
      <div className="text-wrapper">
        <h2>Thank you for verifying your email!</h2>

        <a href="/login">
          {" "}
          <Button
            className="verify-btn"
            variant="dark"
            type="submit"
            command="Log in"
          />
        </a>
      </div>
    </div>
  );
};

export default VerificationThankYou;
