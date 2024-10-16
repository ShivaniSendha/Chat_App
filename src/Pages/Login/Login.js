import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../User/UserLogin";
import '../../Styling/Login.css'

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(username, password);
	};

	return (
		<div className="login-container">
			<div className="login-box">
				<h1 className="login-title">
					Login
					<span className="highlight"> ChatApp</span>
				</h1>

				<form onSubmit={handleSubmit}>
					<div>
						<label className="label">
							<span className="label-text">Username</span>
						</label>
						<input
							type="text"
							placeholder="Enter username"
							className="input-field"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div>
						<label className="label">
							<span className="label-text">Password</span>
						</label>
						<input
							type="password"
							placeholder="Enter Password"
							className="input-field"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<Link to="/signup" className="signup-link">
						{"Don't"} have an account?
					</Link>

					<div>
						<button className="submit-btn" disabled={loading}>
							{loading ? <span className="loading-spinner"></span> : "Login"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
