import './rightbar.css'
import { Users } from '../../dummyData'
import Online from '../../components/online/Online'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { Add, Remove } from '@mui/icons-material'

export default function Rightbar({ user }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const { user: currentUser, dispatch } = useContext(AuthContext)

    const [friends, setFriends] = useState([])
    const [followed, setFollowed] = useState(currentUser.followings.includes(user?._id))

    useEffect(() => {
        const getFriends = async () => {
            try {
                const res = await axios.get('/user/friends/' + user?._id)
                setFriends(res.data)
            } catch (error) {
                console.log(error);
            }
        }
        getFriends()
    }, [user])
    useEffect(() => {
        setFollowed(currentUser.followings.includes(user?._id))
    }, [currentUser, user])

    const handleClick = async () => {
        try {
            if (followed) {
                await axios.put(`/user/${user._id}/unfollow`, { userId: currentUser._id })
                dispatch({ type: "UNFOLLOW", payload: user._id })
            } else {
                await axios.put(`/user/${user._id}/follow`, { userId: currentUser._id })
                dispatch({ type: "FOLLOW", payload: user._id })
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const HomeRightBar = () => {
        return (
            <>
                <div className="birthdayContainer">
                    <img src={`${PF}gift.png`} alt="" className="birthdayImg" />
                    <span className="birthdayText">
                        <b>Person 1</b> and <b>3 other friends</b> have a birthday today
                    </span>
                </div>

                <img src={`${PF}ad.png`} alt="" className="rightbarAd" />
                <h4 className="rightbarTitle">Online Friends</h4>
                <ul className="rightbarFriendList">
                    {Users.map(u => (
                        <Online key={u.id} user={u} />
                    ))}
                </ul>
            </>
        )
    }
    const ProfileRightBar = () => {
        return (
            <>
                {user.username !== currentUser.username && (
                    <button className="rightbarFollowButton" onClick={handleClick}>
                        {followed ? "Unfollow" : "Follow"}
                        {followed ? <Remove /> : <Add />}
                    </button>
                )}
                <h4 className="rightbarTitle">User information</h4>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">City:</span>
                        <span className="rightbarInfoValue">{user.email}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From:</span>
                        <span className="rightbarInfoValue">{user.email}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship:</span>
                        <span className="rightbarInfoValue">{user.email}</span>
                    </div>
                </div>
                <h4 className="rightbarTitle">User friends</h4>
                <div className="rightbarFollowings">
                    {friends.map(u => (
                        <Link key={u._id} to={"/profile/" + u.username} style={{ textDecoration: "none" }}>
                            <div className="rightbarFollowing">
                                <img
                                    src={u.profilePicture ? PF + u.profilePicture : PF + "person/noAvatar.png"}
                                    alt=""
                                    className="rightbarFollowingImg"
                                />
                                <span className="rightbarFollowingName">{u.username}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </>
        )
    }
    return (
        <div className="rightbar">
            <div className="rightbarWrapper">

                {user ? <ProfileRightBar /> : <HomeRightBar />}
            </div>
        </div>
    )
}
