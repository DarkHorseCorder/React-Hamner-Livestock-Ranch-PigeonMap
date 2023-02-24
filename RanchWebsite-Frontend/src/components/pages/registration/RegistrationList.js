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
  association: {
    name: "Association",
    selector: "association",
    sortable: true,
    cell: (row) => (
      <Link
        className="table-link"
        to={{ pathname: `/registration/${row.registration_id}` }}
      >
        {row.association}
      </Link>
    ),
  },

  registration_id: {
    name: "ID",
    selector: "registration_id",
    sortable: false,
  },
  // flocks: {
  //   name: "Flocks",
  //   selector: "flocks",
  //   sortable: false,
  // },

  active: {
    name: "Active",
    selector: "active",
    sortable: true,
    cell: (row) => <ActiveBadge active={row.active} />,

    width: "150px",
  },
  edit_button: {
    name: "",
    sortable: false,
    cell: (row) => (
      <Link to={{ pathname: `/registration-form/edit/${row.registration_id}` }}>
        <button className="confirm-button">Edit</button>
      </Link>
    ),
    width: "150px",
  },
};

const RegistrationList = (props) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [list, setList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const loadResults = useCallback(
    (signal) => {
      if (props.registrationList) {
        setList(props.registrationList);
        setFilterText("");
        setFilteredList(props.registrationList);
      } else {
        let auth_ok = asyncAPICall(
          "/registration/get",
          "GET",
          null,
          null,
          (data) => {
            setList(data);
            setFilterText("");
            setFilteredList(data);
          },
          (err) => console.error("Registration get error: ", err),
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
        columns.registration_id,
        columns.association,
        // columns.flocks,

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
    [props.registrationList, loadResults]
  );

  const handleFilter = (e) => {
    let newFilterText = e.target.value;
    let filteredList = [...list];

    if (newFilterText) {
      newFilterText = newFilterText.toLowerCase();
      filteredList = filteredList.filter((item) => {
        return (
          (item.registration_id &&
            item.registration_id.toLowerCase().includes(newFilterText)) ||
          (item.association &&
            item.association.toLowerCase().includes(newFilterText))
          // (item.flocks && item.flocks.toLowerCase().includes(newFilterText))
        );
      });
    }
    setFilterText(newFilterText);
    setFilteredList(filteredList);
  };

  return (
    <div className="registration-list-container">
      <div className="button-and-search">
        {!props.showAddButton || props.showAddButton === false ? (
          <Link to="/registration-form">
            <button className="confirm-button">
              <FontAwesomeIcon icon="fas fa-plus" /> Add A New Registration
            </button>
          </Link>
        ) : null}

        {!props.showFilter || props.showFilter === false ? (
          <input
            id="search"
            className="registration-filter"
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
            <h2>Registration</h2>
          </span>
        }
      />
    </div>
  );
};

export default RegistrationList;
