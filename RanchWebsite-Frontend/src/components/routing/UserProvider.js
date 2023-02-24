import { useState, useEffect, createContext } from "react";
import { useHistory } from "react-router-dom";
export const UserContext = createContext();
function UserProvider({ children }) {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [authIsLoading, setAuthIsLoading] = useState(true);
  // const logout = () => {
  //   localStorage.removeItem("user");
  // };
  // export default {
  //   regisger,
  //   login,
  //   logout,
  // }
  function logout() {
    fetch("https://devpipeline-mock-api.herokuapp.com/api/auth/logout", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Logged out") {
          setUser(null);
          history.push("/login");
        }
        setAuthIsLoading(false);
      })
      .catch((err) => {
        console.error("Logout Error: ", err);
        setAuthIsLoading(false);
      });
  }
  const userState = {
    user,
    setUser,
    authIsLoading,
    setAuthIsLoading,
    logout,
  };

  useEffect(() => {
    fetch("https://devpipeline-mock-api.herokuapp.com/api/auth/check-login", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.role) {
          setUser(data.user);
        } else {
          setUser(null);
        }
        setAuthIsLoading(false);
      })
      .catch((err) => {
        console.error("Check Login Error: ", err);
        setAuthIsLoading(false);
      });
  }, []);

  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  );
}
export default UserProvider;
