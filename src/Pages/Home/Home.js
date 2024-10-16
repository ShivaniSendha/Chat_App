import MessageContainer from "../../Components/Messages/MessageContainer";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { useAuthContext } from "../../Context/AuthContext";
import '../../Styling/Home.css'
const Home = () => {
	const { authUser } = useAuthContext();

	return (
		<>
		<div className="authUser">
			<p>Welcome 👋 {authUser.fullName}</p>


			<div className="home-container">

				<Sidebar />
				<MessageContainer />
			</div>
			</div>
		</>
	);
};

export default Home;
