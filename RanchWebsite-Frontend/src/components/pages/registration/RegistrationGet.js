import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ConfirmDelete from "../../modals/ConfirmDelete";
import { formatPhone, validateUUID } from "../../../util/stringUtils";
import SecurityWrapper from "../../auth/SecurityWrapper";
import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout";
import useAbortEffect from "../../../hooks/useAbortEffect";

const RegistrationGet = (props) => {
  const [registration, setRegistration] = useState({});
  const [cannotChangeActiveState, setCannotChangeActiveState] = useState(false);

  const handleActivation = () => {
    const endpoint = registration.active ? "deactivate" : "activate";

    asyncAPICall(
      `/registration/${endpoint}/${registration.registration_id}`,
      "PUT",
      null,
      null,
      (data) => {
        setRegistration(data);
      },
      (error) => {
        console.log("Unable to deactivate your own registration", error);
      }
    );
  };

  const redirectTo = (path) => {
    props.history.push(path);
  };

  useAbortEffect(
    (signal) => {
      const registration_id = props.match.params.registration_id;

      if (!validateUUID(registration_id)) {
        props.history.push("/notfound");
      }

      let auth_ok = asyncAPICall(
        `/registration/get/${registration_id}`,
        "GET",
        null,
        null,
        (data) => {
          setRegistration(data);
          setCannotChangeActiveState(false);
        },
        (err) => console.error("Get Registration effect error: ", err),
        signal
      );

      if (!auth_ok) {
        logout(props);
      }
    },
    [props]
  );

  return (
    <div className="get-wrapper">
      <div className="get-detail-wrapper">
        <button className="back-button" onClick={() => props.history.goBack()}>
          <FontAwesomeIcon icon="fas fa-chevron-left" className="button-Icon" />
          Back
        </button>

        <div className="detail-wrapper wrapper">
          <div className="form-wrapper narrow-paper">
            <div className="details">
              <div className="top-section">
                <h1>
                  {registration.registration_id} {registration.association}{" "}
                  {/* {registration.flocks} */}
                </h1>

                <SecurityWrapper restrict_roles="registration">
                  <div className="switch-wrapper">
                    Active:
                    <label className="switch">
                      <input
                        type="checkbox"
                        disabled={cannotChangeActiveState}
                        onClick={handleActivation}
                        defaultChecked={registration.active}
                      />

                      <span className="slider round">
                        <span>On</span>
                        <span>Off</span>
                      </span>
                    </label>
                  </div>
                </SecurityWrapper>
              </div>

              <div className="middle-section">
                <div className="icon-and-details">
                  <FontAwesomeIcon icon="fas fa-registration" />

                  <div>
                    <p>Association:{registration.association}</p>
                    <Link
                      className="no-decoration"
                      to={`/registration/${registration.registration_id}`}
                    >
                      <h3>
                        Org name does not exist within registration, make new
                        api call to grab the correct data
                        {registration.registration?.association || "unknown"}
                      </h3>
                    </Link>

                    <SecurityWrapper restrict_roles="registration">
                      <p className="role">{registration.role}</p>
                    </SecurityWrapper>

                    <p className="association">{registration.association}</p>
                    {/* <p className="flocks">{registration.flocks}</p> */}
                  </div>
                </div>

                <div className="flex-row">
                  <SecurityWrapper restrict_roles="registration">
                    <button
                      className="confirm-button"
                      onClick={() =>
                        redirectTo(
                          `/registration/edit/${registration.registration_id}`
                        )
                      }
                    >
                      Edit
                    </button>

                    <ConfirmDelete
                      objectType="registration"
                      id={registration.registration_id}
                      redirectTo={redirectTo}
                    />
                  </SecurityWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationGet;
