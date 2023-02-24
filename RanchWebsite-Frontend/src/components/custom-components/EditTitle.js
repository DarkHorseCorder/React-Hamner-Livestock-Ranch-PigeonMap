import { useState } from "react";

import asyncAPICall from "../../util/apiWrapper";
import SecurityWrapper from "../auth/SecurityWrapper";
import { successfulToast } from "../../util/toastNotifications";

export default function EditTitle(props) {
  const [beingEdited, setBeingEdited] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  function onBlur() {
    if (props.title_name === "") {
      setErrorMsg("Please do not leave the title empty.");
    } else if (props.title_name !== "") {
      setBeingEdited(false);
      handleSubmit();
    }
  }

  function onFocus() {
    setErrorMsg(false);
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (props.title_name === "") {
        setErrorMsg("Please do not leave the title empty.");
      } else if (props.title_name !== "") {
        setBeingEdited(false);
        handleSubmit();
      }
    }
  };

  function handleSubmit() {
    let id = props.id;
    let org_id = props.data.org_id;
    let name = props.title_name;
    let active = props.data.active;

    if (props.type === "organization") {
      let body = {
        organization_id: id,
        org_id: org_id,
        active: active,
        name: name,
      };

      asyncAPICall(
        `/${props.type}/update`,
        "POST",
        body,
        (response) => {
          if (response.ok) {
            return response.json();
          }
        },
        (data) => {
          if (!errorMsg) {
            if (props.old_title !== props.title_name) {
              successfulToast(
                `${
                  props.type[0].toUpperCase() + props.type.substring(1)
                } Title Successfully Edited!`
              );
            }
            props.set_old_title(props.title_name);
          }
        },
        null
      );
    }
  }

  return (
    <div className="edit-title">
      <SecurityWrapper restrict_roles="user">
        {beingEdited ? (
          <div>
            <div className="error-msg">{errorMsg}</div>

            <input
              onKeyPress={handleKeyDown}
              onBlur={onBlur}
              value={props.title_name}
              onFocus={onFocus}
              onChange={(e) => props.set_title(e.target.value)}
              autoFocus
            />
          </div>
        ) : (
          <h1 onClick={() => setBeingEdited(true)}>{props.title_name}</h1>
        )}
      </SecurityWrapper>

      <SecurityWrapper roles="user">
        <h2>{props.title_name}</h2>
      </SecurityWrapper>
    </div>
  );
}
