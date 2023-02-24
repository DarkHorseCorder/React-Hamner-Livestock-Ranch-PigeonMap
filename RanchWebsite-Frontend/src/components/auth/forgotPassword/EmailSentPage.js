import Logo from "../../../static/images/logo.svg";

const ForgotPassword = () => {
  return (
    <div className="forgot-password-container">
      <div className="forgot-password-wrapper">
        <div className="logo">
          <img src={Logo} alt="Logo" height="32px" />
        </div>

        <div className="recovery-wrapper" style={{ width: "500px" }}>
          <h2>Recover Password</h2>

          <div className="recovery-message">
            An email has been sent. Please click the link when you get it.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
