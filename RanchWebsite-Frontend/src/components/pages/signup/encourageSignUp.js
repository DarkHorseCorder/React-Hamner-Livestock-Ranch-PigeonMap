import React from "react";
import { Link } from "react-router-dom";

import Logo from "../../../img/FamLincLogo.png";

export default function signupConfirmation() {
	return (
		<div className="signup-confirmation-page-wrapper">
			<div className="logo-wrapper">
				<Link to="/login">
					<img src={Logo} alt="FamLinc-logo" />
				</Link>
			</div>
			<div className="confirmation-text-wrapper">
				<p>
					Learn how you can stay connected with your family easier than ever
					before. Get beyond social media, spreadsheets, and Grandmas' address
					book.
				</p>
			</div>
			<div className="login-button-wrapper">
				<Link to="/register">
					<button>Sign Up</button>
				</Link>
			</div>
		</div>
	);
}
