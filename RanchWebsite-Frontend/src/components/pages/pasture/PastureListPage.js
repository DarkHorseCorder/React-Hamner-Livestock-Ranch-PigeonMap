import PastureList from "./PastureList";
import Cookies from "js-cookie";
import SecurityWrapper from "../../auth/SecurityWrapper";
import logout from "../../../util/logout";

export default function PastureListPage(props) {
  const authToken = Cookies.get("auth_token");
  if (!authToken) {
    props.history.push("/login");
    // logout(props);
  }

  return (
    <div className="list-container">
      <SecurityWrapper roles="super-admin,admin">
        <PastureList {...props} authToken={authToken} />
      </SecurityWrapper>

      {/* <SecurityWrapper roles="user">
        <PastureList
          {...props}
          authToken={authToken}
          columns="pasture_name, active"
        />
      </SecurityWrapper> */}
    </div>
  );
}
