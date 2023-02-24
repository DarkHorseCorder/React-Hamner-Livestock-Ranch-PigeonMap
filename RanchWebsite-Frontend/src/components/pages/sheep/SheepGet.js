import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ConfirmDelete from "../../modals/ConfirmDelete";
import { formatPhone, validateUUID } from "../../../util/stringUtils";
import SecurityWrapper from "../../auth/SecurityWrapper";
import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout";
import useAbortEffect from "../../../hooks/useAbortEffect";

const SheepGet = (props) => {
  const [sheep, setSheep] = useState({});
  const [cannotChangeActiveState, setCannotChangeActiveState] = useState(false);

  const handleActivation = () => {
    const endpoint = sheep.active ? "deactivate" : "activate";

    asyncAPICall(
      `/sheep/${endpoint}/${sheep.ear_tag_id}`,
      "PUT",
      null,
      null,
      (data) => {
        setSheep(data);
      },
      (error) => {
        console.log("Unable to deactivate your own sheep", error);
      }
    );
  };

  const redirectTo = (path) => {
    props.history.push(path);
  };

  useAbortEffect(
    (signal) => {
      const ear_tag_id = props.match.params.ear_tag_id;

      if (!validateUUID(ear_tag_id)) {
        props.history.push("/notfound");
      }

      let auth_ok = asyncAPICall(
        `/sheep/get/${ear_tag_id}`,
        "GET",
        null,
        null,
        (data) => {
          setSheep(data);
          setCannotChangeActiveState(false);
        },
        (err) => console.error("Get Sheep effect error: ", err),
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
                  {sheep.ear_tag_id} {sheep.name}
                </h1>

                <SecurityWrapper restrict_roles="sheep">
                  <div className="switch-wrapper">
                    Active:
                    <label className="switch">
                      <input
                        type="checkbox"
                        disabled={cannotChangeActiveState}
                        onClick={handleActivation}
                        defaultChecked={sheep.active}
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
                  <FontAwesomeIcon icon="fas fa-sheep" />

                  <div>
                    <p>Name:{sheep.name}</p>
                    <Link
                      className="no-decoration"
                      to={`/sheep/${sheep.ear_tag_id}`}
                    >
                      <h3>
                        registry_name name does not exist within sheep, make new
                        api call to grab the correct data
                        {sheep.sheep?.name || "unknown"}
                      </h3>
                    </Link>

                    <SecurityWrapper restrict_roles="sheep">
                      <p className="role">{sheep.role}</p>
                    </SecurityWrapper>

                    <p className="name">{sheep.name}</p>
                    <p className="scrapie_tag">{sheep.scrapie_tag}</p>
                    <p className="sex">{sheep.sex}</p>
                    <p className="sheep_color">{sheep.sheep_color}</p>
                    <p className="weight">{sheep.weight}</p>
                    <p className="raised">{sheep.raised}</p>
                    <p className="owner">{sheep.owner}</p>
                    <p className="birthdate">{sheep.birthdate}</p>
                    <p className="vaccines">{sheep.vaccines}</p>

                    <p className="registration_id">{sheep.registration_id}</p>
                    {/* <p className="registry_name">{sheep.registry_name}</p> */}
                  </div>
                </div>

                <div className="flex-row">
                  <SecurityWrapper restrict_roles="sheep">
                    <button
                      className="confirm-button"
                      onClick={() =>
                        redirectTo(`/sheep/edit/${sheep.ear_tag_id}`)
                      }
                    >
                      Edit
                    </button>

                    <ConfirmDelete
                      objectType="sheep"
                      id={sheep.ear_tag_id}
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

export default SheepGet;
