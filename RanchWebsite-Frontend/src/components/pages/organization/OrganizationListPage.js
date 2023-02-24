import Cookies from "js-cookie";

import OrganizationList from "./OrganizationList";
import SecurityWrapper from "../../auth/SecurityWrapper";

export default function OrganizationListPage(props) {
  const authToken = Cookies.get("auth_token");

  if (!authToken) {
    props.history.push("/login");
  }

  //  function redirectTo(path) {
  //      props.history.push(path);
  //  } X

  return (
    <div className="organization-container">
      <SecurityWrapper roles="super-admin,admin">
        <OrganizationList {...props} authToken={authToken} />
      </SecurityWrapper>

      <SecurityWrapper roles="user">
        <OrganizationList
          {...props}
          authToken={authToken}
          columns="name,city,state,active"
        />
      </SecurityWrapper>
    </div>
  );
}
