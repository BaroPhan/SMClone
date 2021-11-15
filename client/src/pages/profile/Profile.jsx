import './profile.css'
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router'
import axios from 'axios';

export default function Profile() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const username = useParams().username
    const [user, setUser] = useState({})
    useEffect(() => {
        const fetchUser = async () => {
            const user = await axios.get(`/user?username=${username}`)
            setUser(user.data)
        }
        fetchUser()
    }, [username])

    return (
        <>
            <Topbar />
            <div className="profile">
                <Sidebar />
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            <img
                                className="profileCoverImg"
                                src={user.coverPicture ? PF + user.profilePicture : PF + "person/noCover.png"}
                                alt=""
                            />
                            <img
                                className="profileUserImg"
                                src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"}
                                alt=""
                            />
                        </div>
                        <div className="profileInfo">
                            <h4 className="profileInfoName">{user.username}</h4>
                            <span className="profileInfoDesc">{user.desc}</span>
                        </div>
                    </div>
                    <div className="profileRightBottom">
                        <Feed username={username} />
                        <Rightbar user={user} />
                    </div>
                </div>
            </div>
        </>
    );
}