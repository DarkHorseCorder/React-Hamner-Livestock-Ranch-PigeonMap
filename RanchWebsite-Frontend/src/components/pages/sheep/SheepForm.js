import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout";
import useAbortEffect from "../../../hooks/useAbortEffect";

const orgIdCookie = Cookies.get("org_id");

const SheepForm = (props) => {
  console.log(props);
  const [ear_tag_id, setSheepId] = useState("");
  const [name, setName] = useState("");
  const [scrapie_tag, setScrapieTag] = useState("");

  const [sex, setSex] = useState("");
  const [sheep_color, setSheepColor] = useState("");
  const [weight, setWeight] = useState("");
  const [raised, setRaised] = useState("");
  const [owner, setOwner] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [vaccines, setVaccines] = useState("");

  const [active, setActive] = useState(1);
  const [editing, setEditing] = useState(props.editing || false);
  const [newSheep, setNewSheep] = useState(false);
  const [error_msg, setErrorMsg] = useState("");
  const [title, setTitle] = useState("");

  const [registration_id, setRegistrationId] = useState("");
  // const [registry_name, setRegistryName] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    let fetch_url = "add";
    const form_body = new FormData(e.target);
    const body = Object.fromEntries(form_body);

    if (editing) {
      fetch_url = "update";
    }

    asyncAPICall(
      `/sheep/${fetch_url}`,
      "POST",
      body,
      null,
      (data) => {
        props.history.push(`/sheep`);
      },
      null
    );
  };

  useAbortEffect(
    (signal) => {
      let ear_tag_id = props.match.params.ear_tag_id;

      if (ear_tag_id && editing) {
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
              setSheepColor(data.sheep_color);
              setSex(data.sex);
              setWeight(data.weight);
              setRaised(data.raised);
              setOwner(data.owner);
              setBirthdate(data.birthdate);
              setVaccines(data.vaccines);
              setRegistrationId(data.registration_id);
              // setRegistryName(data.registry_name);

              setActive(data.active);

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
        setNewSheep(true);
      }
    },
    [props]
  );

  useEffect(() => {
    const title = editing ? "Edit Sheep" : "Add Sheep";

    setTitle(title);
  }, [editing]);

  return (
    <div className="form-container">
      <div className="form-field-wrapper">
        <div className="form-wrapper">
          <h2>{title}</h2>
          <div className="error-message">{error_msg}</div>

          <form className="form sheep-form" onSubmit={handleSubmit}>
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
              id="sex"
              name="sex"
              type="sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            />

            <label htmlFor="sheep_color">SheepColor *</label>
            <input
              id="sheep_color"
              name="sheep_color"
              type="text"
              value={sheep_color}
              onChange={(e) => setSheepColor(e.target.value)}
            />

            <label htmlFor="weight">Weight *</label>
            <input
              id="weight"
              name="weight"
              type="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />

            <label htmlFor="raised">Raised *</label>
            <input
              id="raised"
              name="raised"
              type="raised"
              value={raised}
              onChange={(e) => setRaised(e.target.value)}
            />

            <label htmlFor="owner">Owner *</label>
            <input
              id="owner"
              name="owner"
              type="owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
            <label htmlFor="birthdate">Birthdate *</label>
            <input
              id="birthdate"
              name="birthdate"
              type="birthdate"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
            <label htmlFor="vaccines">Vaccines *</label>
            <input
              id="vaccines"
              name="vaccines"
              type="vaccines"
              value={vaccines}
              onChange={(e) => setVaccines(e.target.value)}
            />

            <label htmlFor="registration_id">Registration Id *</label>
            <input
              id="registration_id"
              name="registration_id"
              type="text"
              value={registration_id}
              onChange={(e) => setRegistrationId(e.target.value)}
            />
            {/* <label htmlFor="registry_name">RegistryName *</label>
            <input
              id="registry_name"
              name="registry_name"
              type="text"
              value={registry_name}
              onChange={(e) => setRegistryName(e.target.value)}
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
