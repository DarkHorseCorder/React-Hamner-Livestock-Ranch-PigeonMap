import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../UserProvider";
function LoginPage() {
  const history = useHistory();
  const { setUser, setAuthIsLoading } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    setAuthIsLoading(true);
    setErrorMsg("");
    fetch("https://devpipeline-mock-api.herokuapp.com/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setAuthIsLoading(false);
        if (data.message === "Logged In") {
          history.push("/wizards");
          setUser(data.user);
        }
      })
      .catch((err) => {
        setAuthIsLoading(false);
        setErrorMsg("Invalid Credentials");
        console.error("Login Error: ", err);
      });
  }
  return (
    <div className="loginpage">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <input type="submit" />
        </div>
        {errorMsg}
      </form>
    </div>
  );
}
export default LoginPage;
