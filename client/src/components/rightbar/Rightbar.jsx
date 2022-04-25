import './rightbar.css'
import Online from '../../components/online/Online'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { publicRequest, userRequest } from '../../requestMethods';
import { Add, Edit, Remove } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import Popup from 'reactjs-popup'

export default function Rightbar({ user }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const currentUser = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch()

    const [friends, setFriends] = useState([])
    const [profileImage, setProfileImage] = useState()
    const [coverImage, setCoverImage] = useState()

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

    //edit profile
    const updateProfile = async (e, close) => {
        e.preventDefault()
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
                {user.username !== currentUser.username
                    ? (
                        <button className="rightbarFollowButton" onClick={handleClick}>
                            {followed ? "Unfollow" : "Follow"}
                            {followed ? <Remove /> : <Add />}
                        </button>
                    )
                    : (
                        <Popup
                            trigger={
                                <button className="rightbarFollowButton" >
                                    Edit profile <Edit style={{ marginLeft: "10px" }} />
                                </button>
                            }
                            modal
                        >
                            {close => (
                                <form onSubmit={e => updateProfile(e, close)} className="modalProfile">
                                    <button className="close" onClick={close}>
                                        &times;
                                    </button>
                                    <div className="header"> Edit profile </div>
                                    <hr className="editProfileHr" />
                                    <div className="content">
                                        <div className="editContainer">
                                            <div className="editCard">
                                                <div className="titleContainer">
                                                    <div className="title">Profile picture</div>
                                                    <label className="editProfileImg">
                                                        <span className='editProfileImgText'>Edit</span>
                                                        <input id="file" name="file" type="file" accept=".png, .jpeg, .jpg" onChange={(e) => setProfileImage(e.target.files[0])} style={{ display: "none" }} />
                                                    </label>
                                                </div>
                                                <div className="imageContainer">
                                                    <img src={profileImage ? URL.createObjectURL(profileImage) : user?.profile_picture ? PF + user?.profile_picture : PF + "person/noAvatar.png"} alt="" className="profileImg" />
                                                </div>
                                            </div>
                                            <div className="editCard">
                                                <div className="titleContainer">
                                                    <div className="title">Cover picture</div>
                                                    <label className="editProfileImg">
                                                        <span className='editProfileImgText'>Edit</span>
                                                        <input id="file" name="file" type="file" accept=".png, .jpeg, .jpg" onChange={(e) => setCoverImage(e.target.files[0])} style={{ display: "none" }} />
                                                    </label>
                                                </div>
                                                <div className="imageContainer">
                                                    <img src={coverImage ? URL.createObjectURL(coverImage) : user?.cover_picture ? PF + user?.cover_picture : PF + "person/noCover.png"} alt="" className="coverImg" />
                                                </div>
                                            </div>
                                            <div className="editCard">
                                                <div className="titleContainer">
                                                    <div className="title">Username</div>
                                                </div>
                                                <input
                                                    className="editProfileInput"
                                                    type="text"
                                                    defaultValue={user?.username}
                                                />
                                            </div>
                                            <div className="editCard">
                                                <div className="titleContainer">
                                                    <div className="title">Username</div>
                                                </div>
                                                <input
                                                    className="editProfileInput"
                                                    type="text"
                                                    defaultValue={user?.username}
                                                />
                                            </div>
                                            <div className="editCard">
                                                <div className="titleContainer">
                                                    <div className="title">Username</div>
                                                </div>
                                                <input
                                                    className="editProfileInput"
                                                    type="text"
                                                    defaultValue={user?.username}
                                                />
                                            </div>
                                            <div className="editCard">
                                                <div className="titleContainer">
                                                    <div className="title">Username</div>
                                                </div>
                                                <input
                                                    className="editProfileInput"
                                                    type="text"
                                                    defaultValue={user?.username}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className="actions">
                                        <button className="editProfileBtn" type="submit">Edit your profile</button>
                                    </div>
                                </form>
                            )}
                        </Popup>
                    )
                }
                <h4 className="rightbarTitle">User information</h4>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Email:</span>
                        <span className="rightbarInfoValue">{user.email}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From:</span>
                        <span className="rightbarInfoValue">{user.from}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship:</span>
                        <span className="rightbarInfoValue">{user.relationship}</span>
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
