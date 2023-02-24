import Logo from "../../../static/images/logo.svg";

const ChangePassword = () => {
  return (
    <div className="forgot-password-container">
      <div className="forgot-password-wrapper">
        <div className="logo">
          <img src={Logo} alt="Logo" height="32px" />
        </div>

        <div className="recovery-wrapper">
          <h2>Change Password</h2>

          <form className="recovery-form">
            <input
              required
              className="send-recovery"
              type="password"
              placeholder="New Password"
            />

            <input
              required
              className="send-recovery"
              type="password"
              placeholder="Re-enter Your New Password"
            />

            <button
              style={{ width: "100%", marginTop: "20px" }}
              className="recovery-btn"
              type="submit"
              onClick={() => this.redirectTo(`/home`)}
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
