import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ActiveBadge from "../../custom-components/ActiveBadge";
// import { formatPhone } from "../../../util/stringUtils";
import SecurityWrapper from "../../auth/SecurityWrapper";
import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout.js";
import useDeepEffect from "../../../hooks/useDeepEffect.js";
import useAbortEffect from "../../../hooks/useAbortEffect.js";

const columns = {
  scrapie_tag: {
    name: "Scrapie Tag",
    selector: "scrapie_tag",
    sortable: true,
    cell: (row) => (
      <Link
        className="table-link"
        to={{ pathname: `/sheep/${row.ear_tag_id}` }}
      >
        {row.scrapie_tag}
      </Link>
    ),
  },
  name: {
    name: "Name",
    selector: "name",
    sortable: true,
    cell: (row) => (
      <Link
        className="table-link"
        to={{ pathname: `/sheep/${row.ear_tag_id}` }}
      >
        {row.name}
      </Link>
    ),
  },
  sex: {
    name: "Sex",
    selector: "sex",
    sortable: true,
  },
  ear_tag_id: {
    name: "ID",
    selector: "ear_tag_id",
    sortable: false,
  },
  registration_id: {
    name: "Registration Id",
    selector: "registration_id",
    sortable: true,
  },
  // org_name: {
  //   name: "Org",
  //   selector: "organization.name",
  //   sortable: true,
  // },
  // role: {
  //   name: "Role",
  //   selector: "role",
  //   sortable: true,
  // },
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
    sortable: true,
    cell: (row) => (
      <Link to={{ pathname: `/sheep-form/${row.ear_tag_id}` }}>
        <button className="confirm-button">Edit</button>
      </Link>
      // dont mess with lines 79-81!
      // <Link to={{ pathname: `/sheep-form/${row.ear_tag_id}` }}>
      //   <button className="confirm-button">Edit</button>
      // </Link>
    ),
    width: "150px",
  },
};

const SheepList = (props) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [list, setList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const loadResults = useCallback(
    (signal) => {
      if (props.sheepList) {
        setList(props.sheepList);
        setFilterText("");
        setFilteredList(props.sheepList);
      } else {
        let auth_ok = asyncAPICall(
          "/sheep/get",
          "GET",
          null,
          null,
          (data) => {
            setList(data);
            setFilterText("");
            setFilteredList(data);
          },
          (err) => console.error("Sheep get error: ", err),
          signal
        );

        if (!auth_ok) {
          logout(props);
        }
      }
    },
    [props]
  );

  useDeepEffect(() => {
    let selected;

    if (props.columns) {
      selected = [];
      props.columns.split(",").forEach((item) => {
        selected.push(columns[item]);
      });
    } else {
      selected = [
        columns.ear_tag_id,
        columns.name,
        columns.scrapie_tag,
        columns.sex,
        columns.registration_id,
        // columns.org_id,
        columns.active,
        columns.edit_button,
      ];
    }
    setSelectedColumns(selected);
  }, [props.columns]);

  useAbortEffect(
    (signal) => {
      loadResults(signal);
    },
    [props.sheepList, loadResults]
  );

  const handleFilter = (e) => {
    let newFilterText = e.target.value;
    let filteredList = [...list];

    if (newFilterText) {
      newFilterText = newFilterText.toLowerCase();
      filteredList = filteredList.filter((item) => {
        return (
          (item.ear_tag_id &&
            item.ear_tag_id.toLowerCase().includes(newFilterText)) ||
          (item.name && item.name.toLowerCase().includes(newFilterText)) ||
          (item.scrapie_tag &&
            item.scrapie_tag.toLowerCase().includes(newFilterText)) ||
          (item.sex && item.sex.toLowerCase().includes(newFilterText)) ||
          (item.registration_id &&
            item.registration_id.toLowerCase().includes(newFilterText))
        );
      });
    }
    setFilterText(newFilterText);
    setFilteredList(filteredList);
  };

  return (
    <div className="sheep-list-container">
      <div className="button-and-search">
        {!props.showAddButton || props.showAddButton === false ? (
          <Link to="/sheep-form">
            <button className="confirm-button">
              <FontAwesomeIcon icon="fas fa-plus" /> Add A New Sheep
            </button>
          </Link>
        ) : null}

        {!props.showFilter || props.showFilter === false ? (
          <input
            id="search"
            className="sheep-filter"
            type="text"
            placeholder="Filter results..."
            value={filterText}
            onChange={handleFilter}
          />
        ) : null}
      </div>

      <div className="seperator" />

      {/* Refactor Datatable to be our own */}
      <DataTable
        columns={selectedColumns}
        data={filteredList}
        title={
          <span>
            <FontAwesomeIcon icon="fas fa-building" /> Sheep
          </span>
        }
      />
    </div>
  );
};

export default SheepList;

//   const [linkToAddSheep, setLinkToAddSheep] = useState("/sheep-add");

//   const loadResults = useCallback(
//     (signal) => {
//       if (props.sheepList) {
//         setList(props.sheepList);
//         setFilterText("");
//         setFilteredList(props.sheepList);
//         // setFilteredList(props.filteredList || props.sheepList);
//       } else {
//         let auth_ok = asyncAPICall(
//           "/sheep/get",
//           "GET",
//           null,
//           null,
//           (data) => {
//             setList(data);
//             setFilterText("");
//             setFilteredList(data);
//           },
//           (err) => console.error("Sheep get error: ", err),
//           signal
//         );

//         if (!auth_ok) {
//           logout(props);
//         }
//       }
//     },
//     [props]
//   );
//   let fetchUrl = "/sheep/get";

//   if (props.org_id) {
//     fetchUrl = `/sheep/get/organization/${props.org_id}`;
//   }

//   const auth_ok = asyncAPICall(
//     fetchUrl,
//     "GET",
//     null,
//     null,
//     (data) => {
//       setList(data);
//       setFilterText("");
//       setFilteredList(data);
//     },
//     (err) => console.error("Sheep get error: ", err),
//     signal
//   );

//   if (!auth_ok) {
//     logout(props);
//   }
// };
// // },
// [props];
// // );

// const handleFilter = (e) => {
//   let newFilterText = e.target.value;
//   let filteredList = [...list];

//   if (newFilterText) {
//     newFilterText = newFilterText.toLowerCase();
//     filteredList = filteredList.filter((item) => {
//       return (
//         (item.scrapie_tag &&
//           item.scrapie_tag.toLowerCase().includes(newFilterText)) ||
//         (item.name && item.name.toLowerCase().includes(newFilterText)) ||
//         (item.sex && item.sex.toLowerCase().includes(newFilterText))
//       );
//     });
//   }

//   setFilterText(e.target.value);
//   setFilteredList(filteredList);
// };

// useDeepEffect(() => {
//   const org_id = props.org_id || "";
//   const org_name = props.org_name || "";
//   let selectedColumns;

//   if (props.columns) {
//     selectedColumns = props.columns.split(",").map((item) => {
//       return columns[item];
//     });
//   } else {
//     selectedColumns = [
//       columns.scrapie_tag,
//       columns.name,
//       columns.sex,

//       // columns.org_name,
//       // columns.role,
//       columns.active,
//       columns.edit_button,
//     ];
//   }

//   setSelectedColumns(selectedColumns);

//   if (org_id) {
//     setLinkToAddSheep(`/sheep-add/${org_id}/${org_name}/`);
//   }
// }, [props.columns, props.org_id, props.org_name]);

// useAbortEffect(
//   (signal) => {
//     loadResults(signal);
//   },
//   [props.sheepList, loadResults]
// );

// return (
//   <div className="sheep-list-container list-page">
//     <div className="button-and-search">
//       <SecurityWrapper restrict_roles="sheep">
//         {!props.showAddButton || props.showAddButton === false ? (
//           <button
//             disabled={props.disableAddSheep}
//             onClick={() => props.history.push(linkToAddSheep)}
//             className="confirm-button"
//           >
//             <FontAwesomeIcon icon="fas fa-plus" className="button-icon" />
//             Add New Sheep
//           </button>
//         ) : null}
//       </SecurityWrapper>

//       {!props.showFilter || props.showFilter === false ? (
//         <input
//           id="search"
//           className="sheep-filter"
//           type="text"
//           placeholder="Filter results..."
//           value={filterText}
//           onChange={handleFilter}
//         />
//       ) : null}
//     </div>

//     <div className="seperator" />

//     <DataTable
//       columns={selectedColumns}
//       data={filteredList}
//       title={
//         <span>
//           <FontAwesomeIcon icon="fas fa-sheep" /> Sheeps
//         </span>
//       }
//     />
//   </div>
// );
// // };

// export default SheepList;
