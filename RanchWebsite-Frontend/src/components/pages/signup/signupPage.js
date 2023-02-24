import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Logo from "../../../img/FamLincLogo.png";
import asyncAPICall from "../../../util/apiWrapper";
import {
  isValidName,
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  stripCharactersFromPhone,
  areMatchingPasswords,
} from "../../../util/stringUtils";

export default function SignupPage(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [validLastName, setValidLastName] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPhone, setValidPhone] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [validBirthDate, setValidBirthDate] = useState(false);
  const [validConfirmedPassword, setValidConfirmedPassword] = useState(false);
  const [validForm, setValidForm] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [birthDateError, setBirthDateError] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState("");

  const handleChange = (e) => {
    switch (e.target.name) {
      case "firstName":
        setFirstName(e.target.value);
        setValidFirstName(isValidName(e.target.value));
        break;
      case "lastName":
        setLastName(e.target.value);
        setValidLastName(isValidName(e.target.value));
        break;
      case "email":
        setEmail(e.target.value);
        if (e.target.value === "") {
          setValidEmail(false);
          setErrorAlert(false);
        } else {
          setValidEmail(isValidEmail(e.target.value));
        }
        break;
      case "phone":
        setPhone(e.target.value);
        const isValid = isValidPhoneNumber(e.target.value);
        setValidPhone(isValid);
        break;
      case "birthDate":
        if (Date.now() > Date.parse(e.target.value)) {
          setBirthDate(e.target.value);
          setValidBirthDate(true);
          setBirthDateError(false);
        } else {
          setBirthDateError(true);
        }
        break;
      case "password":
        setPassword(e.target.value);
        setValidPassword(isValidPassword(e.target.value));
        setValidConfirmedPassword(
          areMatchingPasswords(e.target.value, confirmedPassword)
        );
        break;
      case "confirmedPassword":
        setConfirmedPassword(e.target.value);
        setValidConfirmedPassword(
          areMatchingPasswords(password, e.target.value)
        );
        break;
      default:
        return;
    }
  };

  const checkFormValidity = () => {
    if (
      validFirstName &&
      validLastName &&
      validEmail &&
      (validPhone || !phone) &&
      validPassword &&
      validConfirmedPassword &&
      validPassword === validConfirmedPassword &&
      validBirthDate
    ) {
      setValidForm(true);
    } else {
      setValidForm(false);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (validForm) {
      asyncAPICall(
        "/user/add",
        "POST",
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: stripCharactersFromPhone(phone),
          birth_date: birthDate,
          password: password,
        },
        null,
        () => props.history.push("/verify-email"),
        (err) => console.error("handleSubmit Error: ", err),
        false
      );
    }
  }

  const renderError = () => {
    if (email) {
      if (errorAlert) {
        return "Email already exists";
      } else if (!validEmail) {
        return "Invalid Email";
      } else if (validEmail) {
        return <span style={{ color: "green" }}>Email Available</span>;
      }
    } else {
      return "";
    }
  };

  useEffect(() => {
    if (validEmail) {
      asyncAPICall(
        "/check-email",
        "POST",
        {
          email: email,
        },
        (res) => {
          if (res.status >= 400) {
            setErrorAlert(true);
          } else {
            setErrorAlert(false);
          }
        },
        null,
        null,
        false
      );
    }
  }, [email, validEmail]);

  useEffect(() => {
    checkFormValidity();
  });

  useEffect(() => {
    if (!validPhone && phone) {
      setPhoneMessage("Invalid Phone Number");
    } else {
      setPhoneMessage("");
    }
  }, [validPhone, phone]);
  return (
    <div className="signup-page-wrapper">
      <div className="signup-page-logo-wrapper">
        <Link to="/login">
          <img src={Logo} alt="FamLinc-logo" />
        </Link>
      </div>

      <div className="signup-text-wrapper">
        <h1>Sign Up</h1>
      </div>

      <div className="form-wrapper">
        <div className="form">
          <div className="name-input-wrapper">
            <input
              required
              name="firstName"
              placeholder="First Name*"
              style={{ marginRight: "14px" }}
              onChange={handleChange}
            />

            <input
              required
              name="lastName"
              placeholder="Last Name*"
              style={{ marginLeft: "14px" }}
              onChange={handleChange}
            />
          </div>

          <div className="other-input-wrapper">
            <input
              required
              name="email"
              placeholder="Email*"
              type="email"
              autoComplete="email"
              onChange={handleChange}
            />

            <div className="error-message">{renderError()}</div>

            <input
              name="phone"
              placeholder="Phone (Optional)"
              type="text"
              onChange={handleChange}
            />
            <div className="phone-message">{phoneMessage}</div>

            <div className="date-wrapper">
              <label htmlFor="birthDate">Birth Date</label>
              <input
                required
                className="date"
                type="date"
                name="birthDate"
                onChange={handleChange}
              />
            </div>

            {birthDateError && (
              <div className="error-message">Invalid Birth Date</div>
            )}

            <input
              required
              name="password"
              placeholder="Password*"
              type="password"
              onChange={handleChange}
            />

            <input
              required
              name="confirmedPassword"
              placeholder="Confirm Password*"
              type="password"
              onChange={handleChange}
            />

            {!validConfirmedPassword && confirmedPassword && (
              <div className="error-message">Password does not match.</div>
            )}
          </div>

          <div className="signup-button-wrapper">
            <button
              className="button-dark"
              disabled={!validForm ? "disabled" : ""}
              onClick={handleSubmit}
            >
              Sign Up
            </button>
          </div>

          <div className="bottom-link-wrapper">
            <p>Already have an account?</p>

            <Link to="/login">Login.</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
