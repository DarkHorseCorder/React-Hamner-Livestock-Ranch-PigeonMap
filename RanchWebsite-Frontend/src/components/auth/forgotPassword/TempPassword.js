import Logo from "../../../static/images/logo.svg";

const tempPassword = "dhalkfheluhalkjhdkjlfhiue";
const username = "Tim";

const TempPassword = (props) => {
  const redirectTo = (path) => {
    props.history.push(path);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-wrapper">
        <div className="logo">
          <img src={Logo} alt="Logo" height="32px" />
        </div>

        <div className="recovery-wrapper" style={{ width: "600px" }}>
          <h2>Password Reset</h2>
          <div>Your temporary password for {username} is:</div>
          <h2>{tempPassword}</h2>

          <div>
            Please push the button, after which you will be asked to create a
            new password
          </div>

          <button className="recovery-btn" onClick={() => redirectTo(`/login`)}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default TempPassword;
