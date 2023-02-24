import React, { useState } from "react";
import { Link } from "react-router-dom";

import Logo from "../../../img/famlinc-logo.png";
import Button from "../../core/Button";
import asyncAPICall from "../../../util/apiWrapper";
import { isValidEmail } from "../../../util/stringUtils";

const EmailVerification = (props) => {
	const [email, setEmail] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();

		asyncAPICall(
			"/user/email_verification",
			"POST",
			{ email },
			null,
			() => props.history.push(`/check-email`),
			(err) => {
				console.error("Email Verifcation Error: ", err);
			},
			false
		);
	};

	return (
		<div className="email-verification-wrapper">
			<Link to="/login">
				<img src={Logo} alt="FamLinc-logo" />
			</Link>
			<div className="text-wrapper">
				<h2>Thank you for signing up!</h2>

				<h2>Please verify your email before signing in. </h2>

				<form onSubmit={handleSubmit}>
					<input
						type="email"
						placeholder="email address"
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Button
						isDisabled={isValidEmail(email) ? false : true}
						className="verify-btn"
						variant="dark"
						type="submit"
						command="Verify Email"
					/>
				</form>
			</div>
		</div>
	);
};

export default EmailVerification;
