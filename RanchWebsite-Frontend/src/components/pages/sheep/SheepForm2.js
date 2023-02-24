import { useState, useEffect } from "react";

import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout";
import useAbortEffect from "../../../hooks/useAbortEffect";

const SheepForm = (props) => {
  const [ear_tag_id, setSheepId] = useState("");

  const [name, setName] = useState("");
  const [scrapie_tag, setScrapieTag] = useState("");

  const [sex, setSex] = useState("");
  const [registration_id, setRegistrationId] = useState("");
  const [registry_name, setRegistryName] = useState("");
  const [active, setActive] = useState(1);
  const [editing, setEditing] = useState(false);
  const [newSheep, setNewSheep] = useState(false);
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

    // let form_body = new FormData(e.target);
    // let body = Object.fromEntries(form_body);
    asyncAPICall(
      `/sheep/${fetch_url}`,
      "POST",
      body,
      null,
      (data) => {
        props.history.push(`/sheeps`);
      },
      null
    );
  };

  useAbortEffect(
    (signal) => {
      let ear_tag_id = props.match.params.ear_tag_id;

      if (ear_tag_id) {
        let auth_ok = asyncAPICall(
          `/sheep/get/${ear_tag_id}`,
          "GET",
          null,
          null,
          (data) => {
            if (!data.ear_tag_id) {
              console.log("ERROR: sheep not found");
            } else {
              setSheepId(data.ear_tag_id);
              setName(data.name);
              setScrapieTag(data.scrapie_tag);
              setSex(data.sex);
              setRegistrationId(data.registration_id);
              setRegistryName(data.registry_name);
              // setActive(data.active);
              setEditing(false);
              setErrorMsg("");
            }
          },
          (err) => {
            if (!signal.aborted) {
              console.error("Error in Get Sheep Effect: ", err);
            }
          },
          signal
        );

        if (!auth_ok) {
          logout(props);
        }
      } else {
        // This is a new sheep. If the logged in sheep is an 'admin', then we need to display the
        // logged in sheep's organization name and set the hidden value of org_id to the org_id
        // of the logged in sheep
        // setNewSheep(true);
        // setOrgId(org_id || "");
        // setOrgName(org_name);
        // setRole("sheep");
      }
    },
    [props]
  );

  useEffect(() => {
    const title = editing ? "Edit Sheep" : "Add Sheep";

    setTitle(title);
  }, [editing]);

  if (!newSheep) {
    return null;
  }

  return (
    <div className="form-container">
      <div className="form-field-wrapper">
        <div className="form-wrapper">
          <h2>{title}</h2>
          <div className="error-message">{error_msg}</div>

          <form className="form sheep-form" onSubmit={handleSubmit}>
            {/* <SecurityWrapper roles="super-admin">
              <label htmlFor="org_name" className="drop-down-label org-label">
                Organization
              </label>
              <OrganizationSelect
                handleOrgValues={handleOrgValues}
                org_id={org_id}
                org_name={org_name}
              />

              <input type="hidden" name="org_id" value={org_id} />
            </SecurityWrapper> */}

            {/* <SecurityWrapper restrict_roles="super-admin">
              {editing ? (
                <>
                  <label
                    htmlFor="org_name"
                    className="drop-down-label org-label"
                  >
                    Organization
                  </label>

                  <h3>{org_name}</h3>
                </>
              ) : (
                ""
              )}
              <input type="hidden" name="org_id" value={orgIdCookie} />
            </SecurityWrapper> */}

            {/* <label htmlFor="role" className="drop-down-label role-label">
              Role
            </label> */}
            <label htmlFor="ear_tag_id">Ear Tag *</label>
            <input
              required
              id="ear_tag_id"
              name="ear_tag_id"
              type="text"
              value={ear_tag_id}
              onChange={(e) => setSheepId(e.target.value)}
            />

            <label htmlFor="name">Name *</label>
            <input
              required
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="scrapie_tag">Scrapie Tag *</label>
            <input
              required
              id="scrapie_tag"
              name="scrapie_tag"
              type="text"
              value={scrapie_tag}
              onChange={(e) => setScrapieTag(e.target.value)}
            />

            <label htmlFor="sex">Sex *</label>
            <input
              required
              id="sex"
              name="sex"
              type="sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            />
            <label htmlFor="registration_id">setRegistrationId *</label>
            <input
              required
              id="registration_id"
              name="registration_id"
              type="registration_id"
              value={registration_id}
              onChange={(e) => setRegistrationId(e.target.value)}
            />
            <label htmlFor="registry_name">setRegistryName *</label>
            <input
              required
              id="registry_name"
              name="registry_name"
              type="registry_name"
              value={registry_name}
              onChange={(e) => setRegistryName(e.target.value)}
            />
            {/* {newSheep ? (
              <>
                <label htmlFor="ear_tag_id">Ear Tag *</label>
                <input
                  required
                  id="ear_tag_id"
                  name="ear_tag_id"
                  type="text"
                  value={ear_tag_id}
                  onChange={(e) => setSheepId(e.target.value)}
                />
              </>
            ) : (
              ""
            )} */}

            {/* <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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

            {ear_tag_id ? (
              <input type="hidden" name="ear_tag_id" value={ear_tag_id} />
            ) : (
              ""
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SheepForm;
