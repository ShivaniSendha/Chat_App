import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import { useAuthContext } from "./Context/AuthContext";
import { Toaster } from "react-hot-toast";
import Login from "./Pages/Login/Login";
import SignUp from "./Pages/SignUp/Signup";

function App() {
  const { authUser } = useAuthContext();
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
