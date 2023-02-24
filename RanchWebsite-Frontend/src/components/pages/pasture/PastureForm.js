import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout";
import useAbortEffect from "../../../hooks/useAbortEffect";

const orgIdCookie = Cookies.get("org_id");

const PastureForm = (props) => {
  console.log(props);
  const [pasture_id, setPastureId] = useState("");
  const [pasture_name, setPastureName] = useState("");
  const [description, setDescription] = useState("");
  const [date_moved_into_pasture, setDateMovedIntoPasture] = useState("");
  const [date_moved_out_of_pasture, setDateMovedOutOfPasture] = useState("");
  const [flocks, setFlocks] = useState("");

  const [active, setActive] = useState(1);
  const [editing, setEditing] = useState(props.editing || false);
  const [newPasture, setNewPasture] = useState(false);

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
      `/pasture/${fetch_url}`,
      "POST",
      body,
      null,
      (data) => {
        props.history.push(`/pasture`);
      },
      null
    );
  };

  useAbortEffect(
    (signal) => {
      let pasture_id = props.match.params.pasture_id;

      if (pasture_id && editing) {
        let auth_ok = asyncAPICall(
          `/pasture/get/${pasture_id}`,
          "GET",
          null,
          null,
          (data) => {
            if (!data.pasture_id) {
              console.log("ERROR: pasture not found");
            } else {
              setPastureId(data.pasture_id);
              setPastureName(data.pasture_name);
              setDescription(data.description);
              setDateMovedIntoPasture(data.date_moved_into_pasture);
              setDateMovedOutOfPasture(data.date_moved_out_of_pasture);
              setFlocks(data.flocks);
              setActive(data.active);

              setErrorMsg("");
            }
          },
          (err) => {
            if (!signal.aborted) {
              console.error("Error in Get Pasture Effect: ", err);
            }
          },
          signal
        );

        if (!auth_ok) {
          logout(props);
        }
      } else {
        setNewPasture(true);
      }
    },
    [props]
  );

  useEffect(() => {
    const title = editing ? "Edit Pasture" : "Add Pasture";

    setTitle(title);
  }, [editing]);

  return (
    <div className="form-container">
      <div className="form-field-wrapper">
        <div className="form-wrapper">
          <h2>{title}</h2>
          <div className="error-message">{error_msg}</div>

          <form className="form pasture-form" onSubmit={handleSubmit}>
            <label htmlFor="pasture_id">Pasture Id *</label>
            <input
              required
              id="pasture_id"
              name="pasture_id"
              type="text"
              value={pasture_id}
              onChange={(e) => setPastureId(e.target.value)}
            />

            <label htmlFor="pasture_name">PastureName *</label>
            <input
              required
              id="pasture_name"
              name="pasture_name"
              type="text"
              value={pasture_name}
              onChange={(e) => setPastureName(e.target.value)}
            />
            <label htmlFor="description">Description *</label>
            <input
              required
              id="description"
              name="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label htmlFor="date_moved_into_pasture">
              DateMovedIntoPasture *
            </label>
            <input
              required
              id="date_moved_into_pasture"
              name="date_moved_into_pasture"
              type="text"
              value={date_moved_into_pasture}
              onChange={(e) => setDateMovedIntoPasture(e.target.value)}
            />
            <label htmlFor="date_moved_out_of_pasture">
              DateMovedOutOfPasture *
            </label>
            <input
              required
              id="date_moved_out_of_pasture"
              name="date_moved_out_of_pasture"
              type="text"
              value={date_moved_out_of_pasture}
              onChange={(e) => setDateMovedOutOfPasture(e.target.value)}
            />
            <label htmlFor="flocks">Flocks *</label>
            <input
              id="flocks"
              name="flocks"
              type="text"
              value={flocks}
              onChange={(e) => setFlocks(e.target.value)}
            />

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

            {pasture_id ? (
              <input type="hidden" name="pasture_id" value={pasture_id} />
            ) : (
              ""
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PastureForm;
