import { useState } from "react";
import ReactModal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { awaitAPICall } from "../../util/apiWrapper";
import logout from "../../util/logout";

ReactModal.setAppElement("#root");

const styles = {
  outline: "none",
};

const ConfirmDelete = (props) => {
  const [modalOpen, setModalOpen] = useState(false);

  function handleDelete() {
    let auth_ok = awaitAPICall(
      `/${props.objectType}/delete/${props.id}`,
      "DELETE",
      null,
      null,
      (data) => {
        console.log(`${props.objectType} deleted`);
        setModalOpen(false);
        props.redirectTo(`/${props.objectType}s`);
      },
      null
    );
    if (!auth_ok) {
      logout(props);
    }
  }

  return (
    <div>
      <button
        disabled={props.disabled}
        className="delete-button"
        onClick={() => setModalOpen(true)}
      >
        Delete
      </button>

      <ReactModal isOpen={modalOpen} className="delete-modal" style={styles}>
        <div className="icon">
          <FontAwesomeIcon icon="fas fa-exclamation-triangle" />
        </div>

        <div className="are-you-sure">
          Are you sure you want to delete this {props.objectType}?
        </div>

        <button className="cancel-button" onClick={() => setModalOpen(false)}>
          Cancel
        </button>

        <button className="delete-button" onClick={() => handleDelete()}>
          Yes
        </button>
      </ReactModal>
    </div>
  );
};

export default ConfirmDelete;
