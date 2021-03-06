import Home from "./pages/home/Home.jsx";
import Login from "./pages/login/Login.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Register from "./pages/register/Register.jsx";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Messenger from "./pages/messenger/Messenger.jsx";

function App() {
  const user = useSelector((state) => state.user.currentUser)

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login />}></Route>
      </Routes>
      <Routes>
        <Route path="/login" element={user ? <Navigate to='/' /> : <Login />}></Route>
      </Routes>
      <Routes>
        <Route path="/register" element={user ? <Navigate to='/' /> : <Register />}></Route>
      </Routes>
      <Routes>
        <Route path="/profile/:username" element={user ? <Profile /> : <Login />}></Route>
      </Routes>
      <Routes>
        <Route path="/messenger" element={user ? <Messenger /> : <Login />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
