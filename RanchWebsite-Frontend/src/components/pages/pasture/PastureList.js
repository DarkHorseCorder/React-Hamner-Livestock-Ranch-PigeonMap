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
  pasture_name: {
    name: "Pasture Name",
    selector: "pasture_name",
    sortable: true,
    cell: (row) => (
      <Link
        className="table-link"
        to={{ pathname: `/pasture/${row.pasture_id}` }}
      >
        {row.pasture_name}
      </Link>
    ),
  },

  pasture_id: {
    name: "ID",
    selector: "pasture_id",
    sortable: false,
  },
  description: {
    name: "Description",
    selector: "description",
    sortable: false,
  },
  date_moved_into_pasture: {
    name: "Date Moved Into Pasture",
    selector: "date_moved_into_pasture",
    sortable: false,
  },
  date_moved_out_of_pasture: {
    name: "Date Moved Out Of Pasture",
    selector: "date_moved_out_of_pasture",
    sortable: false,
  },
  flocks: {
    name: "Flocks",
    selector: "flocks",
    sortable: false,
  },

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
      <Link to={{ pathname: `/pasture-form/edit/${row.pasture_id}` }}>
        <button className="confirm-button">Edit</button>
      </Link>
    ),
    width: "150px",
  },
};

const PastureList = (props) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [list, setList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const loadResults = useCallback(
    (signal) => {
      if (props.pastureList) {
        setList(props.pastureList);
        setFilterText("");
        setFilteredList(props.pastureList);
      } else {
        let auth_ok = asyncAPICall(
          "/pasture/get",
          "GET",
          null,
          null,
          (data) => {
            setList(data);
            setFilterText("");
            setFilteredList(data);
          },
          (err) => console.error("Pasture get error: ", err),
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
        columns.pasture_id,
        columns.pasture_name,
        columns.description,
        columns.date_moved_into_pasture,
        columns.date_moved_out_of_pasture,
        columns.flocks,

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
    [props.pastureList, loadResults]
  );

  const handleFilter = (e) => {
    let newFilterText = e.target.value;
    let filteredList = [...list];

    if (newFilterText) {
      newFilterText = newFilterText.toLowerCase();
      filteredList = filteredList.filter((item) => {
        return (
          (item.pasture_id &&
            item.pasture_id.toLowerCase().includes(newFilterText)) ||
          (item.pasture_name &&
            item.pasture_name.toLowerCase().includes(newFilterText)) ||
          (item.description &&
            item.description.toLowerCase().includes(newFilterText)) ||
          (item.date_moved_into_pasture &&
            item.date_moved_into_pasture
              .toLowerCase()
              .includes(newFilterText)) ||
          (item.date_moved_out_of_pasture &&
            item.date_moved_out_of_pasture
              .toLowerCase()
              .includes(newFilterText)) ||
          (item.flocks && item.flocks.toLowerCase().includes(newFilterText))
        );
      });
    }
    setFilterText(newFilterText);
    setFilteredList(filteredList);
  };

  return (
    <div className="pasture-list-container">
      <div className="button-and-search">
        {!props.showAddButton || props.showAddButton === false ? (
          <Link to="/pasture-form">
            <button className="confirm-button">
              <FontAwesomeIcon icon="fas fa-plus" /> Add A New Pasture
            </button>
          </Link>
        ) : null}

        {!props.showFilter || props.showFilter === false ? (
          <input
            id="search"
            className="pasture-filter"
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
            <h2>Pasture</h2>
          </span>
        }
      />
    </div>
  );
};

export default PastureList;
