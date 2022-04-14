import "./topbar.css";
import { Search, Person, Chat, Notifications } from '@mui/icons-material';
import { Link, useNavigate } from "react-router-dom";
// import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/apiCalls";
// import { AuthContext } from "../../context/AuthContext";
export default function Topbar() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const user = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = (e) => {
        e.preventDefault()
        logout(dispatch).then(navigate('/login'))
    }

    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <Link to='/' style={{ textDecoration: "none" }}>
                    <span className="logo">SMClone</span>
                </Link>
            </div>
            <div className="topbarCenter">
                <div className="searchbar">
                    <Search className="searchIcon" />
                    <input placeholder="Search friends, posts or videos" className="searchInput" />
                </div>
            </div>
            <div className="topbarRight">
                <div className="topbarLinks">
                    <span className="topbarLink">Timeline</span>
                    <span className="topbarLink" onClick={handleLogout}>Log out</span>
                </div>
                <div className="topbarIcons">
                    <div className="topbarIconItem">
                        <Person />
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <div className="topbarIconItem">
                        <Chat />
                        <span className="topbarIconBadge">2</span>
                    </div>
                    <div className="topbarIconItem">
                        <Notifications />
                        <span className="topbarIconBadge">3</span>
                    </div>
                </div>
                <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none' }}>
                    <img src={user.profile_picture ? PF + user.profile_picture : PF + "person/noAvatar.png"} alt="" className="topbarImg" />
                </Link>
            </div>
        </div>
    )
}
