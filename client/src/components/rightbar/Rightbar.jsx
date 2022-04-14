import './rightbar.css'
import Online from '../../components/online/Online'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { publicRequest, userRequest } from '../../requestMethods';
import { Add, Remove } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'

export default function Rightbar({ user }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const currentUser = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch()

    const [friends, setFriends] = useState([])

    //bool state to check if user is followed or not
    const [followed, setFollowed] = useState()

    useEffect(() => {
        const getFriends = async () => {
            try {
                const res = await publicRequest.get('/user/friends/' + currentUser?.id)
                setFriends(res.data)
            } catch (error) {
                console.log(error);
            }
        }
        getFriends()
    }, [currentUser, user])
    useEffect(() => {
        const getFollowed = async () => {
            try {
                const res = await publicRequest.get('/user/friends/' + user?.id, { user_id: currentUser?.id })
                console.log(res.data)
                setFollowed(res.data)
            } catch (error) {
                console.log(error);
            }
        }
        getFollowed()
    }, [currentUser, user])

    //handle follow button in profile
    const handleClick = async () => {
        try {
            if (followed) {
                await axios.put(`/user/${user.id}/unfollow`, { userId: currentUser.id })
                dispatch({ type: "UNFOLLOW", payload: user.id })
            } else {
                await axios.put(`/user/${user.id}/follow`, { userId: currentUser.id })
                dispatch({ type: "FOLLOW", payload: user.id })
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

                <img alt="" className="rightbarAd" />
                <h4 className="rightbarTitle">Online Friends</h4>
                <ul className="rightbarFriendList">
                    {friends.map(u => (
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
                        <Link key={u.id} to={"/profile/" + u.username} style={{ textDecoration: "none", color: "black" }}>
                            <div className="rightbarFollowing">
                                <img
                                    src={u.profile_picture ? PF + u.profile_picture : PF + "person/noAvatar.png"}
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
