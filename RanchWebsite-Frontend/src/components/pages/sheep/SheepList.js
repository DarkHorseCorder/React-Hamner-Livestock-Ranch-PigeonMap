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
  sheep_color: {
    name: "Sheep Color",
    selector: "sheep_color",
    sortable: true,
  },
  weight: {
    name: "Weight",
    selector: "weight",
    sortable: true,
  },
  raised: {
    name: "Raised",
    selector: "raised",
    sortable: true,
  },
  owner: {
    name: "Owner",
    selector: "owner",
    sortable: true,
  },
  birthdate: {
    name: "Birthdate",
    selector: "birthdate",
    sortable: true,
  },
  vaccines: {
    name: "Vaccines",
    selector: "vaccines",
    sortable: true,
  },
  registration_id: {
    name: "Registration Id",
    selector: "registration_id",
    sortable: true,
  },
  // registry_name: {
  //   name: "RegistryName",
  //   selector: "registry_name",
  //   sortable: true,
  // },

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

    width: "150px",
  },
  edit_button: {
    name: "",
    sortable: false,
    cell: (row) => (
      <Link to={{ pathname: `/sheep-form/edit/${row.ear_tag_id}` }}>
        <button className="confirm-button">Edit</button>
      </Link>
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
        columns.sheep_color,
        columns.weight,
        columns.raised,
        columns.owner,
        columns.birthdate,
        columns.vaccines,

        columns.registration_id,
        // columns.registry_name,
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
          (item.sheep_color &&
            item.sheep_color.toLowerCase().includes(newFilterText)) ||
          (item.weight && item.weight.toLowerCase().includes(newFilterText)) ||
          (item.raised && item.raised.toLowerCase().includes(newFilterText)) ||
          (item.owner && item.owner.toLowerCase().includes(newFilterText)) ||
          (item.birthdate &&
            item.birthdate.toLowerCase().includes(newFilterText)) ||
          (item.vaccines &&
            item.vaccines.toLowerCase().includes(newFilterText)) ||
          (item.registration_id &&
            item.registration_id.toLowerCase().includes(newFilterText))
          // (item.registry_name &&
          //   item.registry_name.toLowerCase().includes(newFilterText))
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
            <h2> Sheep </h2>
          </span>
        }
      />
    </div>
  );
};

export default SheepList;
