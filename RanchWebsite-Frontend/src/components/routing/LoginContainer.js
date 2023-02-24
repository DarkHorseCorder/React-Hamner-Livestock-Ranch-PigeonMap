import { Route } from "react-router-dom";
import "../../styles/pages/auth/login-page.scss";
import ForgotPassword from "../auth/forgotPassword/ForgotPasswordPage";
import EmailSent from "../auth/forgotPassword/EmailSentPage";
import TempPassword from "../auth/forgotPassword/TempPassword";
import ChangePassword from "../auth/forgotPassword/ChangePassword";
import LoginPage from "../pages/auth/LoginPage";

export default function loginContainer(props) {
  return (
    <>
      <Route
        exact
        path="/login"
        render={(routeProps) => (
          <LoginPage
            {...routeProps}
            authToken={props.authToken}
            setAuthToken={props.setAuthToken}
          />
        )}
      />
      <Route path="/login/password/recovery" component={ForgotPassword} />
      <Route path="/login/password/temporary" component={TempPassword} />
      <Route path="/login/password/change" component={ChangePassword} />
      <Route path="/login/email/sent" component={EmailSent} />
    </>
  );
}
