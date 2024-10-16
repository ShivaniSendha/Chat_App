import { Link } from "react-router-dom";
import { useState } from "react";
import useSignup from "../../User/UserSignup";
import GenderCheckbox from "./GenderCheckbox";
import '../../Styling/Signup.css'
const SignUp = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		password: "",
		confirmPassword: "",
		gender: "",
	});

	const { loading, signup } = useSignup();

	const handleCheckboxChange = (gender) => {
		setInputs({ ...inputs, gender });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(inputs);
	};

	return (
		<div className="signup-container">
			<div className="signup-box">
				<h1 className="signup-title">
					Sign Up <span className="highlight"> ChatApp</span>
				</h1>

				<form onSubmit={handleSubmit}>
					<div>
						<label className="label">
							<span className="label-text">Full Name</span>
						</label>
						<input
							type="text"
							placeholder="John Doe"
							className="input-field"
							value={inputs.fullName}
							onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
						/>
					</div>

					<div>
						<label className="label">
							<span className="label-text">Username</span>
						</label>
						<input
							type="text"
							placeholder="johndoe"
							className="input-field"
							value={inputs.username}
							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
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
							value={inputs.password}
							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
						/>
					</div>

					<div>
						<label className="label">
							<span className="label-text">Confirm Password</span>
						</label>
						<input
							type="password"
							placeholder="Confirm Password"
							className="input-field"
							value={inputs.confirmPassword}
							onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
						/>
					</div>

					<GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />

					<Link to="/login" className="signup-link">
						Already have an account?
					</Link>

					<div>
						<button className="submit-btn" disabled={loading}>
							{loading ? <span className="loading-spinner"></span> : "Sign Up"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
