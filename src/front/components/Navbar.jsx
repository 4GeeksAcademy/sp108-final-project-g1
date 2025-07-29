import { Link } from "react-router-dom";
import Login from "../pages/Login"

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					
					<Link to="/login" className="btn btn-primary">Login</Link>
				</div>
				
			</div>
		</nav>
	);
};
