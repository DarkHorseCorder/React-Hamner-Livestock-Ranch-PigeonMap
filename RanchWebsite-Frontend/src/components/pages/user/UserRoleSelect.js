import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const userRolesAllowedByRole = {
  "super-admin": {
    roles: ["super-admin", "admin", "user"],
    name: "Super Admin",
    value: "super-admin",
  },
  admin: {
    roles: ["admin", "user"],
    name: "Admin",
    value: "admin",
  },
  user: {
    roles: ["user"],
    name: "User",
    value: "user",
  },
  // standard_user: {
  //   roles: ["standard_user"],
  //   name: "Standard User",
  //   value: "standard_user",
  // },
};

const UserRoleSelect = () => {
  const [roleSelect, setRoleSelect] = useState("");
  const [allowedUserRoles, setAllowedUserRoles] = useState([]);

  useEffect(() => {
    const loggedInUsersRole = Cookies.get("user_role");

    if (typeof userRolesAllowedByRole[loggedInUsersRole] === "undefined") {
      // No allowed roles by user role
      return;
    } else {
      const loggedInUserObj = userRolesAllowedByRole[loggedInUsersRole];
      const roleNamesAllowed = [...loggedInUserObj.roles];
      const allowRoles = [];

      roleNamesAllowed.forEach((role) => {
        if (userRolesAllowedByRole[role].value === role) {
          allowRoles.push({
            name: userRolesAllowedByRole[role].name,
            value: userRolesAllowedByRole[role].value,
          });
        }
      });

      setAllowedUserRoles([...allowRoles]);
    }
  }, []);

  return (
    <div className="role-select-container">
      <select onChange={(e) => setRoleSelect(e.target.value)}>
        <option value="">Select Role</option>

        {allowedUserRoles.map((role) => {
          return (
            <option key={role.name} value={role.value}>
              {role.name}
            </option>
          );
        })}
      </select>

      <input type="hidden" name="role" value={roleSelect} />
    </div>
  );
};

export default UserRoleSelect;
