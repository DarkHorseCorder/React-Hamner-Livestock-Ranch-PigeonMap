import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import "../styles/util/toastNotifications.scss";

toast.configure();

export const errorToast = () => {
  toast.error("Photo not added!");
};

export const updateSuccessfulToast = () => {
  toast.success("User Account Updated!");
};

export const accountDeletedToast = () => {
  toast.success(
    <div>
      <FontAwesomeIcon icon="fas fa-check-circle" /> User Account Deleted
    </div>,
    { hideProgressBar: true, autoClose: 2987 }
  );
};

export const messageSentToast = () => {
  toast.success("Message Sent");
};

export const successfulToast = (message) => {
  toast.success(
    <div>
      <FontAwesomeIcon icon="fas fa-check-circle" />
      {message}
    </div>,
    { hideProgressBar: true, autoClose: 2987 }
  );
};
