import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout";
import useAbortEffect from "../../../hooks/useAbortEffect";

const orgIdCookie = Cookies.get("org_id");

const RegistrationForm = (props) => {
  console.log(props);
  const [registration_id, setRegistrationId] = useState("");
  const [association, setAssociation] = useState("");
  // const [flocks, setFlocks] = useState("");

  const [active, setActive] = useState(1);
  const [editing, setEditing] = useState(props.editing || false);
  const [newRegistration, setNewRegistration] = useState(false);

  const [error_msg, setErrorMsg] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    let fetch_url = "add";
    const form_body = new FormData(e.target);
    const body = Object.fromEntries(form_body);

    if (editing) {
      fetch_url = "update";
    }

    asyncAPICall(
      `/registration/${fetch_url}`,
      "POST",
      body,
      null,
      (data) => {
        props.history.push(`/registration`);
      },
      null
    );
  };

  useAbortEffect(
    (signal) => {
      let registration_id = props.match.params.registration_id;

      if (registration_id && editing) {
        let auth_ok = asyncAPICall(
          `/registration/get/${registration_id}`,
          "GET",
          null,
          null,
          (data) => {
            if (!data.registration_id) {
              console.log("ERROR: registration not found");
            } else {
              setRegistrationId(data.registration_id);
              setAssociation(data.association);
              // setFlocks(data.flocks);
              setActive(data.active);

              setErrorMsg("");
            }
          },
          (err) => {
            if (!signal.aborted) {
              console.error("Error in Get Registration Effect: ", err);
            }
          },
          signal
        );

        if (!auth_ok) {
          logout(props);
        }
      } else {
        setNewRegistration(true);
      }
    },
    [props]
  );

  useEffect(() => {
    const title = editing ? "Edit Registration" : "Add Registration";

    setTitle(title);
  }, [editing]);

  return (
    <div className="form-container">
      <div className="form-field-wrapper">
        <div className="form-wrapper">
          <h2>{title}</h2>
          <div className="error-message">{error_msg}</div>

          <form className="form registration-form" onSubmit={handleSubmit}>
            <label htmlFor="registration_id">Registration Id *</label>
            <input
              required
              id="registration_id"
              name="registration_id"
              type="text"
              value={registration_id}
              onChange={(e) => setRegistrationId(e.target.value)}
            />

            <label htmlFor="association">Association *</label>
            <input
              required
              id="association"
              name="association"
              type="text"
              value={association}
              onChange={(e) => setAssociation(e.target.value)}
            />
            {/* <label htmlFor="flocks">Flocks *</label>
            <input
              required
              id="flocks"
              name="flocks"
              type="text"
              value={flocks}
              onChange={(e) => setFlocks(e.target.value)}
            /> */}
            <button
              className="cancel-button"
              type="button"
              onClick={() => props.history.goBack()}
            >
              Cancel
            </button>

            <button className="confirm-button" type="submit">
              {title}
            </button>

            {registration_id ? (
              <input
                type="hidden"
                name="registration_id"
                value={registration_id}
              />
            ) : (
              ""
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
