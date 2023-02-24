import { useCallback, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import UserList from "./user/UserList";
import OrganizationList from "./organization/OrganizationList";
import asyncAPICall from "../../util/apiWrapper";
import useDebounce from "../../hooks/useDebounce";
import Loading from "../../util/Loading";
import useAbortEffect from "../../hooks/useAbortEffect";
// import logout from './util/logout';

export default function UniversalSearch(props) {
  const searchDebounce = useDebounce(props.searchTerm);
  const results = useRef(false);

  const [organizations, setOrganizations] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const loadResults = useCallback(
    (signal) => {
      const auth_token = Cookies.get("auth_token");
      if (auth_token) {
        asyncAPICall(
          `/search/${searchDebounce}`,
          "GET",
          null,
          null,
          (data) => {
            for (let result in data) {
              if (data[result].length) {
                results.current = true;
                break;
              }
            }

            setOrganizations(data.organizations);
            setUsers(data.users);
            setIsSearching(false);
          },
          (err) => {
            if (!signal.aborted) {
              console.error("loadResults Error: ", err);
              setIsSearching(false);
            }
          },
          signal
        );
      }
    },
    [searchDebounce]
  );

  const renderOrganizations = () => {
    if (organizations.length) {
      return (
        <OrganizationList
          showFilter="false"
          showAddButton="false"
          columns="name,city,state,phone,active"
          orgList={organizations}
        />
      );
    }
    return false;
  };

  const renderUsers = () => {
    if (users.length) {
      return (
        <UserList
          showFilter="false"
          showAddButton="false"
          columns="first_name,last_name,email,phone,active"
          userList={users}
        />
      );
    }
    return false;
  };

  useEffect(() => {
    if (props.searchTerm === "") setIsSearching(false);
    else setIsSearching(true);
  }, [props.searchTerm]);

  useAbortEffect(
    (signal) => {
      results.current = false;
      if (searchDebounce) {
        loadResults(signal);
      } else {
        setOrganizations([]);
        setUsers([]);
        setIsSearching(false);
      }
    },
    [searchDebounce, loadResults]
  );

  return (
    <div className="search-data-wrapper">
      <button
        className="confirm-button back-button search-title"
        onClick={() => props.history.goBack()}
      >
        <FontAwesomeIcon icon="fas fa-chevron-left" /> Back
      </button>

      <h1 className="search-title">Search Results</h1>

      {isSearching ? (
        <Loading
          content="Searching...."
          styles={{
            marginRight: "0",
            height: "50%",
            backgroundColor: "white",
          }}
        />
      ) : results.current ? (
        <>
          <div className="organizations">{renderOrganizations()}</div>
          <div className="users">{renderUsers()}</div>
        </>
      ) : (
        <h4 className="no-results">There are no records to display</h4>
      )}
      <div className="vertical-spacing">
        {/* REFACTOR FOR A SPACE */}
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}
