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
				<p>Congratulations on Signing Up!</p>
			</div>
			<div className="login-button-wrapper">
				<div className="form-wrapper">
					<Link to="/verify-email">
						<button>Send Verification Link</button>
					</Link>
				</div>
			</div>
		</div>
	);
}
