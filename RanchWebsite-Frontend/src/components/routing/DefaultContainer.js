import { useState, useEffect, createContext } from "react";
import { Route } from "react-router-dom";
import Cookies from "js-cookie";

// import Home from "../pages/Home";
// import Header from "../navigation/Header";
import Organization from "../pages/organization/OrganizationGet";
import User from "../pages/user/UserGet";
import OrganizationListPage from "../pages/organization/OrganizationListPage";
import OrganizationForm from "../pages/organization/OrganizationForm";
import UserListPage from "../pages/user/UserListPage";
import UserForm from "../pages/user/UserForm";
import Loading from "../../util/Loading";
import ProfileEditPage from "../pages/ProfileEditPage";
import UniversalSearch from "../pages/UniversalSearch";

import logout from "../../util/logout";
import awaitAPICall from "../../util/apiWrapper";
import useAbortEffect from "../../hooks/useAbortEffect";

import SheepForm from "../pages/sheep/SheepForm";
import SheepGet from "../pages/sheep/SheepGet";
import SheepListPage from "../pages/sheep/SheepListPage";

import RegistrationForm from "../pages/registration/RegistrationForm";
import RegistrationGet from "../pages/registration/RegistrationGet";
import RegistrationListPage from "../pages/registration/RegistrationListPage";

import PastureForm from "../pages/pasture/PastureForm";
import PastureGet from "../pages/pasture/PastureGet";
import PastureListPage from "../pages/pasture/PastureListPage";
import Comments from "../../util/comments";
import Meat from "../pages/meat/meat";

// import Trailer from "../pages/Trailer";
// import AboutUs from "../pages/AboutUs";
export const MeContext = createContext();

const DefaultContainer = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [me, setMe] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let auth_token_from_cookie = Cookies.get("auth_token");
    let expiration = Cookies.get("auth_expires");
    let is_expired = Date.parse(expiration) < Date.now();

    if (!auth_token_from_cookie || is_expired) {
      logout(props);
    }
  });

  useAbortEffect((signal) => {
    setIsLoading(true);
    awaitAPICall(
      "/user/get/me",
      "GET",
      null,
      null,
      (data) => {
        if (data) {
          setMe(data);
        }
        setIsLoading(false);
      },
      (err) => {
        if (!signal.aborted) {
          console.error("Error in Get Me Effect: ", err);
        }
        setIsLoading(false);
      },
      signal
    );
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <MeContext.Provider value={me}>
      {/* <Route
        path="/"
        render={(routeProps) => (
          <Header
            {...routeProps}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}
      /> */}

      <div className="body-container">
        {/* <Route path="/home" component={Home} />
        <Route path="/about_us" component={AboutUs} /> */}

        <Route path="/users" component={UserListPage} />
        <Route exact path="/user_add" component={UserForm} />
        <Route path="/user_add/:org_id/:org_name" component={UserForm} />
        <Route exact path="/user/:user_id" component={User} />
        <Route path="/user/edit/:user_id" component={UserForm} />
        <Route path="/profile/edit/:user_id" component={ProfileEditPage} />

        <Route exact path="/organization-form" component={OrganizationForm} />
        <Route path="/organization-form/:org_id" component={OrganizationForm} />
        <Route path="/organizations" component={OrganizationListPage} />
        <Route path="/organization/:org_id" component={Organization} />

        <Route path="/sheep" component={SheepListPage} />
        <Route exact path="/sheep-form" component={SheepForm} />
        <Route exact path="/sheep-form/:ear_tag_id" component={SheepForm} />
        <Route exact path="/sheep/:ear_tag_id" component={SheepGet} />
        <Route
          path="/sheep-form/edit/:ear_tag_id"
          render={(routeProps) => <SheepForm {...routeProps} editing />}
        />
        <Route path="/profile/edit/:ear_tag_id" component={ProfileEditPage} />

        <Route path="/registration" component={RegistrationListPage} />
        <Route exact path="/registration-form" component={RegistrationForm} />
        <Route
          exact
          path="/registration-form/:registration_id"
          component={RegistrationForm}
        />
        <Route
          exact
          path="/registration/:registration_id"
          component={RegistrationGet}
        />
        <Route
          path="/profile/edit/:registration_id"
          component={ProfileEditPage}
        />
        <Route
          path="/registration-form/edit/:registration_id"
          render={(routeProps) => <RegistrationForm {...routeProps} editing />}
        />

        <Route path="/pasture" component={PastureListPage} />
        <Route exact path="/pasture-form" component={PastureForm} />
        <Route exact path="/pasture-form/:pasture_id" component={PastureForm} />
        <Route exact path="/pasture/:pasture_id" component={PastureGet} />
        <Route
          path="/pasture-form/edit/:pasture_id"
          render={(routeProps) => <PastureForm {...routeProps} editing />}
        />
        <Route path="/profile/edit/:pasture_id" component={ProfileEditPage} />
        <Route path="/comments" component={Comments} />
        <Route path="/meat" component={Meat} />

        <Route
          path="/universal-search"
          render={(routeProps) => {
            return (
              <UniversalSearch
                {...routeProps}
                searchTerm={searchTerm}
                authToken={props.authToken}
              />
            );
          }}
        />
      </div>
    </MeContext.Provider>
  );
};

export default DefaultContainer;
