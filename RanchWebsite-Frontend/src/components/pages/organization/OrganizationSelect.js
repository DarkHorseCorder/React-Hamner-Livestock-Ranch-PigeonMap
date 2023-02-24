import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout";

const OrganizationSelect = (props) => {
  const [organizations, setOrganizations] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const handleChange = (e) => {
    props.handleOrgValues(e.target.value);
  };

  const mapOrganizations = () => {
    return organizations.map((org) => {
      return (
        <option
          key={org.value}
          value={JSON.stringify({ org_id: org.value, org_name: org.name })}
        >
          {org.name}
        </option>
      );
    });
  };

  useEffect(() => {
    const auth_token = Cookies.get("auth_token");

    if (auth_token) {
      let auth_ok = asyncAPICall(
        `/organization/get`,
        "GET",
        null,
        null,
        (data) => {
          const options = data.map((option) => {
            return {
              name: option.name,
              value: option.org_id,
              active: option.active,
            };
          });

          setOrganizations(options);
          setLoaded(true);
        },
        (err) => console.error("Error in Get Organization Effect: ", err)
      );

      if (!auth_ok) {
        logout();
      }
    }
  }, []);

  return (
    <div className="org-select-container">
      <select onChange={handleChange}>
        <option value="">Select Organization</option>
        {loaded && mapOrganizations()}
      </select>
    </div>
  );
};

export default OrganizationSelect;
