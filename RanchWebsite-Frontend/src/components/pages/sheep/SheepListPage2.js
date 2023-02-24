import SheepList from "./SheepList";
import Cookies from "js-cookie";
import SecurityWrapper from "../../auth/SecurityWrapper";
import logout from "../../../util/logout";

export default function SheepListPage(props) {
  const authToken = Cookies.get("auth_token");
  if (!authToken) {
    //props.history.push('/login');
    logout(props);
  }

  return (
    <div className="list-container">
      <SecurityWrapper roles="super-admin,admin">
        <SheepList {...props} authToken={authToken} />
      </SecurityWrapper>

      <SecurityWrapper roles="sheep">
        <SheepList
          {...props}
          authToken={authToken}
          columns="scrapie_tag, name, sex, registration_id,  active"
        />
      </SecurityWrapper>
    </div>
  );
}
