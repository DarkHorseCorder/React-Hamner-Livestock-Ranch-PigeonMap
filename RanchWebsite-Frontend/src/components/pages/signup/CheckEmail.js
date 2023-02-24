import Logo from "../../../img/famlinc-logo.png";

export default function CheckEmail() {
	return (
		<div className="check-email-wrapper">
			<a href="/login">
				<img src={Logo} alt="Famlinc logo"></img>
			</a>
			<h1>Thank You!</h1>
			<h2>Check your email for a verification link. </h2>
		</div>
	);
}
