import Cookies from "js-cookie";

// Usage: <SecurityWrapper roles="super-admin" user_role="admin">
//   <TagsToDisplayIfSuperAdmin />
// </SecurityWrapper>;

export default function SecurityWrapper({ roles, restrict_roles, children }) {
  const userRole = Cookies.get("user_role");
  let childrenVisible = false;

  if (userRole) {
    if (roles && roles.split(",").indexOf(userRole) > -1) {
      childrenVisible = true;
    } else if (restrict_roles) {
      childrenVisible = true;
      if (restrict_roles.split(",").indexOf(userRole) > -1) {
        childrenVisible = false;
      }
    }
  }
  return childrenVisible ? children : "";
}
