import Cookies from "js-cookie";

import SheepList from "./SheepList";
import SecurityWrapper from "../../auth/SecurityWrapper";

export default function SheepListPage(props) {
  const authToken = Cookies.get("auth_token");

  if (!authToken) {
    props.history.push("/login");
  }

  return (
    <div className="organization-container">
      <SecurityWrapper roles="super-admin,admin">
        <SheepList {...props} authToken={authToken} />
      </SecurityWrapper>

      <SecurityWrapper roles="user">
        <SheepList
          {...props}
          authToken={authToken}
          columns="name, scrapie_tag, sex, sheep_color, weight, raised, owner, birthdate, vaccines, ear_tag_id, registration_id, active"
        />
      </SecurityWrapper>
    </div>
  );
}
