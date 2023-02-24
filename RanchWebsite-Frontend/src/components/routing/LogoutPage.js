import { useEffect, useContext } from "react";
import { UserContext } from "../../UserProvider";

function LogoutPage() {
  const { logout } = useContext(UserContext);

  useEffect(() => {
    logout();
  }, [logout]);

  return <div>...Logging Out</div>;
}
export default LogoutPage;
