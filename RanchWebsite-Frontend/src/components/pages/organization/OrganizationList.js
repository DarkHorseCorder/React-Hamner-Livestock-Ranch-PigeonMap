import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ActiveBadge from "../../custom-components/ActiveBadge";
import { formatPhone } from "../../../util/stringUtils";
import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout.js";
import useAbortEffect from "../../../hooks/useAbortEffect.js";
import useDeepEffect from "../../../hooks/useDeepEffect.js";

{
  /* <div className="table-info"> */
}
const columns = {
  name: {
    name: "Name",
    selector: "name",
    sortable: true,
    cell: (row) => (
      <Link
        className="table-link"
        to={{ pathname: `/organization/${row.org_id}` }}
      >
        {row.name}
      </Link>
    ),
  },
  city: {
    name: "City",
    selector: "city",
    sortable: true,
  },
  state: {
    name: "State",
    selector: "state",
    sortable: true,
  },
  phone: {
    name: "Phone",
    selector: "phone",
    sortable: true,
    cell: (row) => formatPhone(row.phone),
  },
  org_id: {
    name: "ID",
    selector: "org_id",
    sortable: false,
  },
  active: {
    name: "Active",
    selector: "active",
    sortable: true,
    cell: (row) => <ActiveBadge active={row.active} />,
    // center: true
    width: "150px",
  },
  edit_button: {
    name: "",
    sortable: false,
    cell: (row) => (
      <Link to={{ pathname: `/organization-form/${row.org_id}` }}>
        <button className="edit-confirm-button">Edit</button>
      </Link>
    ),
    width: "150px",
  },
};
// </div>

const OrganizationList = (props) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [list, setList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const loadResults = useCallback(
    (signal) => {
      if (props.orgList) {
        setList(props.orgList);
        setFilterText("");
        setFilteredList(props.orgList);
      } else {
        let auth_ok = asyncAPICall(
          "/organization/get",
          "GET",
          null,
          null,
          (data) => {
            setList(data);
            setFilterText("");
            setFilteredList(data);
          },
          (err) => console.error("Organization get error: ", err),
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
        columns.name,
        columns.city,
        columns.state,
        columns.org_id,
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
    [props.orgList, loadResults]
  );

  const handleFilter = (e) => {
    let newFilterText = e.target.value;
    let filteredList = [...list];

    if (newFilterText) {
      newFilterText = newFilterText.toLowerCase();
      filteredList = filteredList.filter((item) => {
        return (
          (item.name && item.name.toLowerCase().includes(newFilterText)) ||
          (item.city && item.city.toLowerCase().includes(newFilterText)) ||
          (item.state && item.state.toLowerCase().includes(newFilterText))
        );
      });
    }
    setFilterText(newFilterText);
    setFilteredList(filteredList);
  };

  return (
    <div className="organization-list-container">
      <div className="button-and-search">
        {!props.showAddButton || props.showAddButton === false ? (
          <Link to="/organization-form">
            <button className="add-confirm-button">
              <FontAwesomeIcon icon="fas fa-plus" /> Add New Company
            </button>
          </Link>
        ) : null}
        <div className="filter">
          {!props.showFilter || props.showFilter === false ? (
            <input
              id="search"
              className="org-filter"
              type="text"
              placeholder="Filter results..."
              value={filterText}
              onChange={handleFilter}
            />
          ) : null}
        </div>
      </div>

      <div className="seperator">
        {/* Refactor Datatable to be our own */}
        <DataTable
          className="info"
          columns={selectedColumns}
          data={filteredList}
          title={<span>Companies</span>}
        />
      </div>
    </div>
  );
};

export default OrganizationList;
