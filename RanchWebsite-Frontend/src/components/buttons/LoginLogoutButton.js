import logout from "../../util/logout";

export default function LoginLogoutButton(props) {
  return (
    <div className="nav-item login-logout-button">
      <button className="confirm-button" onClick={() => logout(props)}>
        {props.authToken ? "Logout" : "Login"}
      </button>
    </div>
  );
}
