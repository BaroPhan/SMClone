import "./topbar.css";
import { Search, Person, Chat, Notifications } from '@mui/icons-material';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/apiCalls";
import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
export default function Topbar({ socket }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const user = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [notifications, setNotifications] = useState([]);
    const [person, setPerson] = useState([]);
    const [message, setMessage] = useState([]);


    const handleLogout = (e) => {
        e.preventDefault()
        logout(dispatch).then(navigate('/login'))
    }
    useEffect(() => {
        socket?.on("getNotification", (data) => {
            console.log(data)
            switch (data.type) {
                case "postLike":
                    setNotifications((prev) => [...prev, data]);
                    break
                case "commentLike":
                    setNotifications((prev) => [...prev, data]);
                    break
                case "follow":
                    setPerson((prev) => [...prev, data]);
                    break
                case "message":
                    setMessage((prev) => [...prev, data]);
                    break
                default:
                    break
            }
        });
    }, [socket]);

    const displayNotification = ({ senderName, type }) => {
        let action;

        if (type === "postLike") {
            action = "liked your post!";
        } else if (type === "commentLike") {
            action = "liked your comment!";
        } else if (type === "follow") {
            action = "follows you!";
        } else if (type === "message") {
            action = "messages you!";
        } else {
            action = "shared";
        }
        return (
            <span className="notification">{`${senderName} ${action}`}</span>
        );
    };

    const handleRead = (type, close) => {
        setNotifications([]);
        setMessage([]);
        setPerson([]);
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
                    <input placeholder="Search friends, posts..." className="searchInput" />
                </div>
            </div>
            <div className="topbarRight">
                <div className="topbarLinks">
                    {/* <span className="topbarLink">Timeline</span>
                    <span className="topbarLink" onClick={handleLogout}>Log out</span> */}
                </div>
                <div className="topbarIcons">
                    <Popup
                        trigger={
                            <div className="topbarIconItem">
                                <Person />
                                {person.length > 0 &&
                                    <span className="topbarIconBadge">{person.length}</span>
                                }
                            </div>
                        }
                        position="bottom right"
                        closeOnDocumentClick
                    >
                        <div className="notifications">
                            {person.map((n) => displayNotification(n))}
                            <button className="nButton" onClick={handleRead}>
                                Mark as read
                            </button>
                        </div>
                    </Popup>
                    <Popup
                        trigger={
                            <div className="topbarIconItem">
                                <Chat />
                                {message.length > 0 &&
                                    <span className="topbarIconBadge">{message.length}</span>
                                }
                            </div>
                        }
                        position="bottom right"
                        closeOnDocumentClick
                    >
                        {close => (
                            <div className="notifications">
                                {message.map((n) => displayNotification(n))}
                                <button className="nButton" onClick={handleRead}>
                                    Mark as read
                                </button>
                            </div>
                        )}
                    </Popup>
                    <Popup
                        trigger={
                            <div className="topbarIconItem">
                                <Notifications />
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
                </div>
                <Popup
                    trigger={
                        <img src={user.profile_picture ? user.profile_picture : PF + "person/noAvatar.png"} alt="" className="topbarImg" />
                    }
                    position="bottom right"
                    arrow="bottom right"
                    closeOnDocumentClick
                >
                    {close => (
                        <div className="notifications">
                            <Link to={`/profile/${user.username}`} className="profileOption" style={{ textDecoration: 'none' }}>
                                Your profile
                            </Link>
                            <Link to={`/messenger`} className="profileOption" style={{ textDecoration: 'none' }}>
                                Messenger
                            </Link>
                            <span onClick={handleLogout} className="profileOption">
                                Log Out
                            </span>
                        </div>
                    )}
                </Popup>

            </div>
        </div>
    )
}
