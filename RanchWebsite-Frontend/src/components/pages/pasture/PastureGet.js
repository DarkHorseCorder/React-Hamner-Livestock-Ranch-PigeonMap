import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ConfirmDelete from "../../modals/ConfirmDelete";
import { formatPhone, validateUUID } from "../../../util/stringUtils";
import SecurityWrapper from "../../auth/SecurityWrapper";
import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout";
import useAbortEffect from "../../../hooks/useAbortEffect";

const PastureGet = (props) => {
  const [pasture, setPasture] = useState({});
  const [cannotChangeActiveState, setCannotChangeActiveState] = useState(false);

  const handleActivation = () => {
    const endpoint = pasture.active ? "deactivate" : "activate";

    asyncAPICall(
      `/pasture/${endpoint}/${pasture.pasture_id}`,
      "PUT",
      null,
      null,
      (data) => {
        setPasture(data);
      },
      (error) => {
        console.log("Unable to deactivate your own pasture", error);
      }
    );
  };

  const redirectTo = (path) => {
    props.history.push(path);
  };

  useAbortEffect(
    (signal) => {
      const pasture_id = props.match.params.pasture_id;

      if (!validateUUID(pasture_id)) {
        props.history.push("/notfound");
      }

      let auth_ok = asyncAPICall(
        `/pasture/get/${pasture_id}`,
        "GET",
        null,
        null,
        (data) => {
          setPasture(data);
          setCannotChangeActiveState(false);
        },
        (err) => console.error("Get Pasture effect error: ", err),
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
                  {pasture.pasture_id} {pasture.pasture_name}
                </h1>

                <SecurityWrapper restrict_roles="pasture">
                  <div className="switch-wrapper">
                    Active:
                    <label className="switch">
                      <input
                        type="checkbox"
                        disabled={cannotChangeActiveState}
                        onClick={handleActivation}
                        defaultChecked={pasture.active}
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
                  <FontAwesomeIcon icon="fas fa-pasture" />

                  <div>
                    <p>Name:{pasture.pasture_name}</p>
                    <Link
                      className="no-decoration"
                      to={`/pasture/${pasture.pasture_id}`}
                    >
                      <h3>
                        registry_name name does not exist within pasture, make
                        new api call to grab the correct data
                        {pasture.pasture?.pasture_name || "unknown"}
                      </h3>
                    </Link>

                    <SecurityWrapper restrict_roles="pasture">
                      <p className="role">{pasture.role}</p>
                    </SecurityWrapper>

                    <p className="pasture_name">{pasture.pasture_name}</p>
                    <p className="description">{pasture.description}</p>
                    <p className="date_moved_into_pasture">
                      {pasture.date_moved_into_pasture}
                    </p>
                    <p className="date_moved_out_of_pasture">
                      {pasture.date_moved_out_of_pasture}
                    </p>
                    <p className="flocks">{pasture.flocks}</p>

                    {/* <p className="registry_name">{pasture.registry_name}</p> */}
                  </div>
                </div>

                <div className="flex-row">
                  <SecurityWrapper restrict_roles="pasture">
                    <button
                      className="confirm-button"
                      onClick={() =>
                        redirectTo(`/pasture/edit/${pasture.pasture_id}`)
                      }
                    >
                      Edit
                    </button>

                    <ConfirmDelete
                      objectType="pasture"
                      id={pasture.pasture_id}
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

export default PastureGet;
