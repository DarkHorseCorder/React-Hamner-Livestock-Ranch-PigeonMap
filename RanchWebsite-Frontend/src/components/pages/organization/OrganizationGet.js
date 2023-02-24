import { useState } from "react";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ConfirmDelete from "../../modals/ConfirmDelete";
import EditTitle from "../../custom-components/EditTitle";
import UserList from "../user/UserList";
import { validateUUID, formatPhone } from "../../../util/stringUtils";
import { successfulToast } from "../../../util/toastNotifications";
import SecurityWrapper from "../../auth/SecurityWrapper";
import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout";
import useAbortEffect from "../../../hooks/useAbortEffect";

export default function GetOrganization(props) {
  const [organization, setOrganization] = useState(null);
  const [orgName, setOrgName] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [userOrgId, setUserOrgId] = useState(null);
  const [title, setTitle] = useState(null);
  const [oldTitle, setOldTitle] = useState("");
  const [switchStyle, setSwitchStyle] = useState("slider round");
  const [disableButtons, setDisableButtons] = useState(false);
  const [users, setUsers] = useState([]);

  useAbortEffect(
    (signal) => {
      let org_id = props.match.params.org_id;

      if (!validateUUID(org_id)) {
        props.history.push("/notfound");
      }

      let user_org_id = Cookies.get("org_id");
      // /user/get/organization/<org_id>
      let auth_ok = asyncAPICall(
        `/organization/get/${org_id}`,
        "GET",
        null,
        null,
        (data) => {
          setOrganization(data);
          setOrgName(data.name);
          setOrgId(org_id);
          setUserOrgId(user_org_id);
          setTitle(data.name);
          setOldTitle(data.name);

          let disableButtons = data.org_id === data.user_org_id ? true : false;

          if (disableButtons) {
            setSwitchStyle("slider round disable-switch");
          }
          setDisableButtons(disableButtons);
        },
        (err) => console.error("Organization effect error: ", err),
        signal
      );

      asyncAPICall(
        `/user/get/organization/${org_id}`,
        "GET",
        null,
        null,
        (data) => setUsers(data),
        (err) => console.error("Get Org Users Error: ", err),
        signal
      );

      if (!auth_ok) {
        logout(props);
      }
    },
    [props]
  );

  const organizationActivateToast = () => {
    if (organization.active) {
      successfulToast("Organization Successfully Deactivated!");
    } else {
      successfulToast("Organization Successfully Activated!");
    }
  };

  function handleActivation() {
    let endpoint = organization.active ? "deactivate" : "activate";
    asyncAPICall(
      `/organization/${endpoint}/${organization.org_id}`,
      "PUT",
      null,
      null,
      (data) => {
        organizationActivateToast();
        setOrganization(data);
      },
      null
    );
  }

  function redirectTo(path) {
    props.history.push(path);
  }

  if (!organization) {
    return null;
  }

  return (
    <div className="companyprofile-get-wrapper">
      <div className="get-detail-wrapper">
        <button
          className="companyprofile-back-button"
          onClick={() => props.history.goBack()}
        >
          <FontAwesomeIcon icon="fas fa-chevron-left" className="button-icon" />
          Back
        </button>

        <div className="companyprofile-detail-wrapper-wrapper">
          <div className="companyprofile-form-wrapper">
            <div className="companyprofile-details">
              <div className="companyprofile-top-section">
                <EditTitle
                  title_name={title}
                  set_title={setTitle}
                  set_old_title={setOldTitle}
                  old_title={oldTitle}
                  type="organization"
                  id={organization.org_id}
                  data={organization}
                />

                <SecurityWrapper roles="super-admin, admin">
                  <div className="companyprofile-switch-wrapper">
                    Active:
                    <label className="companyprofile-switch">
                      <div className="box">
                        <input
                          type="checkbox"
                          disabled={disableButtons ? true : false}
                          onClick={() => handleActivation()}
                          defaultChecked={organization.active}
                        />
                      </div>
                      {/* <div className="onoff">
                        <span className={switchStyle}>
                          <span>On </span>

                          <span> Off</span>
                        </span>
                      </div> */}
                    </label>
                  </div>
                </SecurityWrapper>

                <SecurityWrapper restrict_roles="super-admin, admin">
                  <h2>Active</h2>
                </SecurityWrapper>
              </div>
              <div className="companyprofile-middle-section">
                <div className="companyprofile-icon-and-details">
                  {/* <FontAwesomeIcon icon="fas fa-building" /> */}

                  <div>
                    <p className="address">
                      {organization.address}
                      <br />
                      {organization.city} {organization.state} &nbsp;
                      {organization.zip_code}
                    </p>
                    <p className="phone">{formatPhone(organization.phone)}</p>
                  </div>
                </div>

                <div className="flex-row">
                  <SecurityWrapper restrict_roles="user">
                    <div className="edit-button-getprofile">
                      <button
                        className="companypro-confirm-button"
                        onClick={() =>
                          redirectTo(
                            `/organization-form/${organization.org_id}`
                          )
                        }
                      >
                        Edit
                      </button>
                    </div>
                    <div className="deletebutton">
                      <SecurityWrapper restrict_roles="admin">
                        <ConfirmDelete
                          disabled={orgId === userOrgId ? true : false}
                          objectType="organization"
                          id={organization.org_id}
                          redirectTo={redirectTo}
                          className="deletebutton2"
                        />
                      </SecurityWrapper>
                    </div>
                  </SecurityWrapper>
                </div>
              </div>
            </div>

            <br />

            <div className="companyprofile-user-list">
              <UserList
                {...props}
                disableAddUser={!organization.active}
                showFilter="false"
                columns="first_name,last_name,email,phone,active"
                org_name={orgName}
                org_id={props.match.params.org_id}
                userList={users}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
