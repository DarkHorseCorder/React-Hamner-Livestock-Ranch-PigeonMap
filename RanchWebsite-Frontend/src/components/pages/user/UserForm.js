// import { useState, useEffect } from "react";
// import Cookies from "js-cookie";

// import OrganizationSelect from "../organization/OrganizationSelect";
// import UserRoleSelect from "./UserRoleSelect";
// import SecurityWrapper from "../../auth/SecurityWrapper";
// import asyncAPICall from "../../../util/apiWrapper";
// import logout from "../../../util/logout";
// import useAbortEffect from "../../../hooks/useAbortEffect";

// const orgIdCookie = Cookies.get("org_id");

// const UserForm = (props) => {
//   const [user_id, setUserId] = useState("");
//   const [org_id, setOrgId] = useState("");
//   const [org_name, setOrgName] = useState("");
//   const [first_name, setFirstName] = useState("");
//   const [last_name, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [role, setRole] = useState("");
//   // const [active, setActive] = useState(1);
//   const [editing, setEditing] = useState(false);
//   const [newUser, setNewUser] = useState(false);
//   const [error_msg, setErrorMsg] = useState("");
//   const [title, setTitle] = useState("");

//   const handleOrgValues = (org) => {
//     const parsed = JSON.parse(org);
//     setOrgId(parsed.org.value);
//     setOrgName(parsed.org.name);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     let fetch_url = "add";

//     if (editing) {
//       fetch_url = "update";
//     }

//     let form_body = new FormData(e.target);
//     let body = Object.fromEntries(form_body);

//     let auth_ok = asyncAPICall(
//       `/user/${fetch_url}`,
//       "POST",
//       body,
//       (response) => {
//         if (response.ok) {
//           return response.json();
//         } else if (response.status === 403) {
//           setErrorMsg(
//             "Cannot add a User to this Organization. The Organization is disabled."
//           );
//           return null;
//         }
//       },
//       (data) => {
//         if (!error_msg) {
//           props.history.push(`/users`);
//         }
//       }
//       // (err) => console.error(err),
//       // null,
//       // props
//     );

//     if (!auth_ok) {
//       logout(props);
//     }
//   };

//   useAbortEffect(
//     (signal) => {
//       let user_id = props.match.params.user_id;
//       let org_id = props.match.params.org_id;
//       let org_name = props.match.params.org_name;

//       if (user_id) {
//         let auth_ok = asyncAPICall(
//           `/user/get/${user_id}`,
//           "GET",
//           null,
//           null,
//           (data) => {
//             if (!data.user_id) {
//               console.log("ERROR: user not found");
//             } else {
//               setUserId(data.user_id);
//               setOrgId(data.organization?.org_id || "");
//               setOrgName(data.organization?.name || "");
//               setFirstName(data.first_name);
//               setLastName(data.last_name);
//               setEmail(data.email);
//               setPassword(data.password);
//               setPhone(data.phone);
//               // setRole(data.role);
//               // setActive(data.active);
//               setEditing(true);
//               setErrorMsg("");
//             }
//           },
//           (err) => {
//             if (!signal.aborted) {
//               console.error("Error in Get User Effect: ", err);
//             }
//           },
//           signal
//         );

//         if (!auth_ok) {
//           logout(props);
//         }
//       } else {
//         // This is a new user. If the logged in user is an 'admin', then we need to display the
//         // logged in user's organization name and set the hidden value of org_id to the org_id
//         // of the logged in user
//         setNewUser(true);
//         setOrgId(org_id || "");
//         setOrgName(org_name);
//         // setRole("user");
//       }
//     },
//     [props]
//   );

//   useEffect(() => {
//     const title = editing ? "Edit User" : "Add User";

//     setTitle(title);
//   }, [editing]);

//   if (!org_id && !newUser) {
//     return null;
//   }

//   return (
//     <div className="form-container">
//       <div className="form-field-wrapper">
//         <div className="form-wrapper">
//           <h2>{title}</h2>
//           <div className="error-message">{error_msg}</div>

//           <form className="form" onSubmit={handleSubmit}>
//             <SecurityWrapper roles="super-admin, admin">
//               <label htmlFor="org_name" className="drop-down-label org-label">
//                 Organization
//               </label>
//               <OrganizationSelect
//                 handleOrgValues={handleOrgValues}
//                 org_id={org_id}
//                 org_name={org_name}
//               />

//               <input type="hidden" name="org_id" value={org_id} />
//             </SecurityWrapper>

//             <SecurityWrapper restrict_roles="super-admin, admin">
//               {editing ? (
//                 <>
//                   <label
//                     htmlFor="org_name"
//                     className="drop-down-label org-label"
//                   >
//                     Organization
//                   </label>

//                   <h3>{org_name}</h3>
//                 </>
//               ) : (
//                 ""
//               )}
//               <input type="hidden" name="org_id" value={orgIdCookie} />
//             </SecurityWrapper>

//             <label htmlFor="role" className="drop-down-label role-label">
//               Role
//             </label>
//             <UserRoleSelect />

//             <label htmlFor="first_name">First Name *</label>
//             <input
//               required
//               id="first_name"
//               name="first_name"
//               type="text"
//               value={first_name}
//               onChange={(e) => setFirstName(e.target.value)}
//             />

//             <label htmlFor="last_name">Last Name *</label>
//             <input
//               required
//               id="last_name"
//               name="last_name"
//               type="text"
//               value={last_name}
//               onChange={(e) => setLastName(e.target.value)}
//             />

//             <label htmlFor="email">Email *</label>
//             <input
//               required
//               id="email"
//               name="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />

//             {newUser ? (
//               <>
//                 <label htmlFor="password">Password *</label>
//                 <input
//                   required
//                   id="password"
//                   name="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </>
//             ) : (
//               ""
//             )}

//             <label htmlFor="phone">Phone</label>
//             <input
//               id="phone"
//               name="phone"
//               type="phone"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//             />

//             <button
//               className="cancel-button"
//               type="button"
//               onClick={() => props.history.goBack()}
//             >
//               Cancel
//             </button>

//             <button className="confirm-button" type="submit">
//               {title}
//             </button>

//             {user_id ? (
//               <input type="hidden" name="user_id" value={user_id} />
//             ) : (
//               ""
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserForm;

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import OrganizationSelect from "../organization/OrganizationSelect";
import UserRoleSelect from "./UserRoleSelect";
import SecurityWrapper from "../../auth/SecurityWrapper";
import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout";
import useAbortEffect from "../../../hooks/useAbortEffect";

const orgIdCookie = Cookies.get("org_id");

const UserForm = (props) => {
  const [user_id, setUserId] = useState("");
  const [org_id, setOrgId] = useState("");
  const [org_name, setOrgName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  // const [role, setRole] = useState("");
  // const [active, setActive] = useState(1);
  const [editing, setEditing] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [error_msg, setErrorMsg] = useState("");
  const [title, setTitle] = useState("");

  const handleOrgValues = (org) => {
    const parsed = JSON.parse(org);

    setOrgId(parsed.org_id);
    setOrgName(parsed.org_name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let fetch_url = "add";
    if (editing) {
      fetch_url = "update";
    }

    let form_body = new FormData(e.target);
    let body = Object.fromEntries(form_body);

    let auth_ok = asyncAPICall(
      `/user/${fetch_url}`,
      "POST",
      body,
      (response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 403) {
          setErrorMsg(
            "Cannot add a User to this Organization. The Organization is disabled."
          );
          return null;
        }
      },
      (data) => {
        if (!error_msg) {
          props.history.push(`/users`);
        }
      }
    );

    if (!auth_ok) {
      logout(props);
    }
  };

  useAbortEffect(
    (signal) => {
      let user_id = props.match.params.user_id;
      let org_id = props.match.params.org_id;
      let org_name = props.match.params.org_name;

      if (user_id) {
        let auth_ok = asyncAPICall(
          `/user/get/${user_id}`,
          "GET",
          null,
          null,
          (data) => {
            if (!data.user_id) {
              console.log("ERROR: user not found");
            } else {
              setUserId(data.user_id);
              setOrgId(data.organization?.org_id || "");
              setOrgName(data.organization?.name || "");
              setFirstName(data.first_name);
              setLastName(data.last_name);
              setEmail(data.email);
              setPassword(data.password);
              setPhone(data.phone);
              // setRole(data.role);
              // setActive(data.active);
              setEditing(true);
              setErrorMsg("");
            }
          },
          (err) => {
            if (!signal.aborted) {
              console.error("Error in Get User Effect: ", err);
            }
          },
          signal
        );

        if (!auth_ok) {
          logout(props);
        }
      } else {
        // This is a new user. If the logged in user is an 'admin', then we need to display the
        // logged in user's organization name and set the hidden value of org_id to the org_id
        // of the logged in user
        setNewUser(true);
        setOrgId(org_id || "");
        setOrgName(org_name);
        // setRole("user");
      }
    },
    [props]
  );

  useEffect(() => {
    const title = editing ? "Edit User" : "Add User";

    setTitle(title);
  }, [editing]);

  if (!org_id && !newUser) {
    return null;
  }

  return (
    <div className="form-container">
      <div className="form-field-wrapper">
        <div className="form-wrapper">
          <h2>{title}</h2>
          <div className="error-message">{error_msg}</div>

          <form className="form" onSubmit={handleSubmit}>
            <SecurityWrapper roles="super-admin">
              <label htmlFor="org_name" className="drop-down-label org-label">
                Organization
              </label>
              <OrganizationSelect
                handleOrgValues={handleOrgValues}
                org_id={org_id}
                org_name={org_name}
              />

              <input type="hidden" name="org_id" value={org_id} />
            </SecurityWrapper>

            <SecurityWrapper restrict_roles="super-admin">
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
            </SecurityWrapper>

            <label htmlFor="role" className="drop-down-label role-label">
              Role
            </label>
            <UserRoleSelect />

            <label htmlFor="first_name">First Name *</label>
            <input
              required
              id="first_name"
              name="first_name"
              type="text"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <label htmlFor="last_name">Last Name *</label>
            <input
              required
              id="last_name"
              name="last_name"
              type="text"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />

            <label htmlFor="email">Email *</label>
            <input
              required
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {newUser ? (
              <>
                <label htmlFor="password">Password *</label>
                <input
                  required
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </>
            ) : (
              ""
            )}

            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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

            {user_id ? (
              <input type="hidden" name="user_id" value={user_id} />
            ) : (
              ""
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
