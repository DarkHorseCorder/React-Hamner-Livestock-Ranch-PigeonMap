import RegistrationList from "./RegistrationList";
import Cookies from "js-cookie";
import SecurityWrapper from "../../auth/SecurityWrapper";
import logout from "../../../util/logout";

export default function RegistrationListPage(props) {
  const authToken = Cookies.get("auth_token");
  if (!authToken) {
    props.history.push("/login");
    // logout(props);
  }

  return (
    <div className="list-container">
      <SecurityWrapper roles="super-admin,admin">
        <RegistrationList {...props} authToken={authToken} />
      </SecurityWrapper>

      <SecurityWrapper roles="user">
        <RegistrationList
          {...props}
          authToken={authToken}
          columns="association, active"
        />
      </SecurityWrapper>
    </div>
  );
}
