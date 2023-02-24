// import { useState, useCallback } from "react";
// import { Link } from "react-router-dom";
// import DataTable from "react-data-table-component";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import "../../../styles/pages/user/user-list.scss";
// import ActiveBadge from "../../custom-components/ActiveBadge";
// import { formatPhone } from "../../../util/stringUtils";
// import SecurityWrapper from "../../auth/SecurityWrapper";
// import asyncAPICall from "../../../util/apiWrapper";
// import logout from "../../../util/logout.js";
// import useDeepEffect from "../../../hooks/useDeepEffect.js";
// import useAbortEffect from "../../../hooks/useAbortEffect.js";

// const columns = {
//   first_name: {
//     name: "First Name",
//     selector: "first_name",
//     sortable: true,
//     cell: (row) => (
//       <Link className="table-link" to={{ pathname: `/user/${row.user_id}` }}>
//         {row.first_name}
//       </Link>
//     ),
//   },
//   last_name: {
//     name: "Last Name",
//     selector: "last_name",
//     sortable: true,
//     cell: (row) => (
//       <Link className="table-link" to={{ pathname: `/user/${row.user_id}` }}>
//         {row.last_name}
//       </Link>
//     ),
//   },
//   email: {
//     name: "Email",
//     selector: "email",
//     sortable: true,
//   },
//   phone: {
//     name: "Phone",
//     selector: "phone",
//     sortable: true,
//     cell: (row) => formatPhone(row.phone),
//   },
//   org_name: {
//     name: "Org",
//     selector: "organization.name",
//     sortable: true,
//   },
//   role: {
//     name: "Role",
//     selector: "role",
//     sortable: true,
//   },
//   active: {
//     name: "Active",
//     selector: "active",
//     sortable: true,
//     cell: (row) => <ActiveBadge active={row.active} />,
//     // center: true
//     // style: {width: '1px'}
//     width: "150px",
//   },
//   edit_button: {
//     name: "",
//     sortable: false,
//     cell: (row) => (
//       <Link to={{ pathname: `/user/edit/${row.user_id}` }}>
//         <button className="user-edit-confirm-button">Edit</button>
//       </Link>
//     ),
//     width: "150px",
//   },
//   user_id: {
//     name: "ID",
//     selector: "user_id",
//     sortable: false,
//   },
// };

// const UserList = (props) => {
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const [list, setList] = useState([]);
//   const [filterText, setFilterText] = useState("");
//   const [filteredList, setFilteredList] = useState([]);
//   const [linkToAddUser, setLinkToAddUser] = useState("/user_add");

//   const loadResults = useCallback(
//     (signal) => {
//       if (props.userList) {
//         setList(props.userList);
//         setFilterText("");
//         setFilteredList(props.filteredList || props.userList);
//       } else {
//         let fetchUrl = "/user/get";

//         if (props.org_id) {
//           fetchUrl = `/user/get/organization/${props.org_id}`;
//         }

//         const auth_ok = asyncAPICall(
//           fetchUrl,
//           "GET",
//           null,
//           null,
//           (data) => {
//             setList(data);
//             setFilterText("");
//             setFilteredList(data);
//           },
//           (err) => {
//             if (!signal.aborted) {
//               console.error("Error in Get Users Effect: ", err);
//             }
//           },
//           signal
//         );

//         if (!auth_ok) {
//           logout(props);
//         }
//       }
//     },
//     [props]
//   );

//   const handleFilter = (e) => {
//     let newFilterText = e.target.value;
//     let filteredList = [...list];

//     if (newFilterText) {
//       newFilterText = newFilterText.toLowerCase();
//       filteredList = filteredList.filter((item) => {
//         return (
//           (item.first_name &&
//             item.first_name.toLowerCase().includes(newFilterText)) ||
//           (item.last_name &&
//             item.last_name.toLowerCase().includes(newFilterText)) ||
//           (item.phone && item.phone.toLowerCase().includes(newFilterText)) ||
//           (item.email && item.email.toLowerCase().includes(newFilterText))
//         );
//       });
//     }

//     setFilterText(e.target.value);
//     setFilteredList(filteredList);
//   };

//   useDeepEffect(() => {
//     const org_id = props.org_id || "";
//     const org_name = props.org_name || "";
//     let selectedColumns;

//     if (props.columns) {
//       selectedColumns = props.columns.split(",").map((item) => {
//         return columns[item];
//       });
//     } else {
//       selectedColumns = [
//         columns.first_name,
//         columns.last_name,
//         columns.email,
//         columns.phone,
//         columns.org_name,
//         columns.role,
//         columns.active,
//         columns.edit_button,
//       ];
//     }

//     setSelectedColumns(selectedColumns);

//     if (org_id) {
//       setLinkToAddUser(`/user_add/${org_id}/${org_name}/`);
//     }
//   }, [props.columns, props.org_id, props.org_name]);

//   useAbortEffect(
//     (signal) => {
//       loadResults(signal);
//     },
//     [props.userList, loadResults]
//   );

//   return (
//     <div className="user-list-container-list-page">
//       <div className="user-button-and-search">
//         <SecurityWrapper restrict_roles="user">
//           {!props.showAddButton || props.showAddButton === false ? (
//             <button
//               disabled={props.disableAddUser}
//               onClick={() => props.history.push(linkToAddUser)}
//               className="user-add-confirm-button"
//             >
//               <FontAwesomeIcon
//                 icon="fas fa-plus"
//                 className="user-button-icon"
//               />
//               Add New User
//             </button>
//           ) : null}
//         </SecurityWrapper>
//       </div>
//       <div className="user-filter-list">
//         {!props.showFilter || props.showFilter === false ? (
//           <input
//             id="search"
//             className="user-filter-listb"
//             type="text"
//             placeholder="Filter results..."
//             value={filterText}
//             onChange={handleFilter}
//           />
//         ) : null}
//       </div>

//       <div className="user-seperator" />

//       <DataTable
//         columns={selectedColumns}
//         data={filteredList}
//         title={
//           <span>
//             <FontAwesomeIcon icon="fas fa-user" /> Users
//           </span>
//         }
//       />
//     </div>
//   );
// };

// export default UserList;

import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ActiveBadge from "../../custom-components/ActiveBadge";
import { formatPhone } from "../../../util/stringUtils";
import SecurityWrapper from "../../auth/SecurityWrapper";
import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout.js";
import useDeepEffect from "../../../hooks/useDeepEffect.js";
import useAbortEffect from "../../../hooks/useAbortEffect.js";

const columns = {
  first_name: {
    name: "First Name",
    selector: "first_name",
    sortable: true,
    cell: (row) => (
      <Link className="table-link" to={{ pathname: `/user/${row.user_id}` }}>
        {row.first_name}
      </Link>
    ),
  },
  last_name: {
    name: "Last Name",
    selector: "last_name",
    sortable: true,
    cell: (row) => (
      <Link className="table-link" to={{ pathname: `/user/${row.user_id}` }}>
        {row.last_name}
      </Link>
    ),
  },
  email: {
    name: "Email",
    selector: "email",
    sortable: true,
  },
  phone: {
    name: "Phone",
    selector: "phone",
    sortable: true,
    cell: (row) => formatPhone(row.phone),
  },
  org_name: {
    name: "Org",
    selector: "organization.name",
    sortable: true,
  },
  role: {
    name: "Role",
    selector: "role",
    sortable: true,
  },
  active: {
    name: "Active",
    selector: "active",
    sortable: true,
    cell: (row) => <ActiveBadge active={row.active} />,
    // center: true
    // style: {width: '1px'}
    width: "150px",
  },
  edit_button: {
    name: "",
    sortable: false,
    cell: (row) => (
      <Link to={{ pathname: `/user/edit/${row.user_id}` }}>
        <button className="confirm-button">Edit</button>
      </Link>
    ),
    width: "150px",
  },
  user_id: {
    name: "ID",
    selector: "user_id",
    sortable: false,
  },
};

const UserList = (props) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [list, setList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [linkToAddUser, setLinkToAddUser] = useState("/user_add");

  const loadResults = useCallback(
    (signal) => {
      if (props.userList) {
        setFilterText("");
        setFilteredList(props.filteredList || props.userList);
      } else {
        let fetchUrl = "/user/get";

        if (props.org_id) {
          fetchUrl = `/user/get/organization/${props.org_id}`;
        }

        const auth_ok = asyncAPICall(
          fetchUrl,
          "GET",
          null,
          null,
          (data) => {
            setList(data);
            setFilterText("");
            setFilteredList(data);
          },
          (err) => {
            if (!signal.aborted) {
              console.error("Error in Get Users Effect: ", err);
            }
          },
          signal
        );

        if (!auth_ok) {
          logout(props);
        }
      }
    },
    [props]
  );

  const handleFilter = (e) => {
    let newFilterText = e.target.value;
    let filteredList = [...list];

    if (newFilterText) {
      newFilterText = newFilterText.toLowerCase();
      filteredList = filteredList.filter((item) => {
        return (
          (item.first_name &&
            item.first_name.toLowerCase().includes(newFilterText)) ||
          (item.last_name &&
            item.last_name.toLowerCase().includes(newFilterText)) ||
          (item.phone && item.phone.toLowerCase().includes(newFilterText)) ||
          (item.email && item.email.toLowerCase().includes(newFilterText))
        );
      });
    }

    setFilterText(e.target.value);
    setFilteredList(filteredList);
  };

  useDeepEffect(() => {
    const org_id = props.org_id || "";
    const org_name = props.org_name || "";
    let selectedColumns;

    if (props.columns) {
      selectedColumns = props.columns.split(",").map((item) => {
        return columns[item];
      });
    } else {
      selectedColumns = [
        columns.first_name,
        columns.last_name,
        columns.email,
        columns.phone,
        columns.org_name,
        columns.role,
        columns.active,
        columns.edit_button,
      ];
    }

    setSelectedColumns(selectedColumns);

    if (org_id) {
      setLinkToAddUser(`/user_add/${org_id}/${org_name}/`);
    }
  }, [props.columns, props.org_id, props.org_name]);

  useAbortEffect(
    (signal) => {
      loadResults(signal);
    },
    [props.userList, loadResults]
  );

  return (
    <div className="user-list-container list-page">
      <div className="button-and-search">
        <SecurityWrapper restrict_roles="user">
          {!props.showAddButton || props.showAddButton === false ? (
            <button
              disabled={props.disableAddUser}
              onClick={() => props.history.push(linkToAddUser)}
              className="confirm-button"
            >
              <FontAwesomeIcon icon="fas fa-plus" className="button-icon" />
              Add New User
            </button>
          ) : null}
        </SecurityWrapper>

        {!props.showFilter || props.showFilter === false ? (
          <input
            id="search"
            className="user-filter"
            type="text"
            placeholder="Filter results..."
            value={filterText}
            onChange={handleFilter}
          />
        ) : null}
      </div>

      <div className="seperator" />

      <DataTable
        columns={selectedColumns}
        data={filteredList}
        title={
          <span>
            <FontAwesomeIcon icon="fas fa-user" /> Users
          </span>
        }
      />
    </div>
  );
};

export default UserList;
