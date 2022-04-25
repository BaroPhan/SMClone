import "./topbar.css";
import { Search, Person, Chat, Notifications } from '@mui/icons-material';
import { Link, useNavigate } from "react-router-dom";
// import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/apiCalls";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import Popup from "reactjs-popup";
// import { AuthContext } from "../../context/AuthContext";
export default function Topbar() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const user = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [notifications, setNotifications] = useState([]);

    const socket = useRef()

    const handleLogout = (e) => {
        e.preventDefault()
        logout(dispatch).then(navigate('/login'))
    }
    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getNotification", (data) => {
            switch (data.type){
                case "postLike":
                    setNotifications((prev) => [...prev, data]);
                    break
                case "commentLike":
                    setNotifications((prev) => [...prev, data]);
                    break
                default:
                    break
            }
        });
    }, []);
    useEffect(() => {
        socket.current.emit("addUser", user.id);
        // socket.current.on("getUsers", (users) => {
        //     console.log(users)
        // });
    }, [user]);
    const displayNotification = ({ senderName, type }) => {
        let action;

        if (type === "postLike") {
            action = "liked your post";
        } else if (type === "commentLike") {
            action = "liked your comment";
        } else {
            action = "shared";
        }
        return (
            <span >{`${senderName} ${action}`}</span>
        );
    };

    const handleRead = () => {
        setNotifications([]);
    };

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
                    <Popup
                        trigger={
                            <div className="topbarIconItem">
                                <Person />
                                {notifications.length > 0 &&
                                    <span className="topbarIconBadge">{notifications.length}</span>
                                }
                            </div>
                        }
                        position="bottom right"
                        closeOnDocumentClick
                    >
                        <div className="notifications">
                            {notifications.map((n) => displayNotification(n))}
                            <button className="nButton" onClick={handleRead}>
                                Mark as read
                            </button>
                        </div>
                    </Popup>

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
