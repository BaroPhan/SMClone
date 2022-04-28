import './rightbar.css'
import Online from '../../components/online/Online'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Add, Edit, Remove } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import Popup from 'reactjs-popup'
import { followUser, updateUser, uploadImg } from '../../redux/apiCalls'

export default function Rightbar({ user, socket }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const currentUser = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch()

    const [online, setOnline] = useState()
    const [profileImage, setProfileImage] = useState()
    const [coverImage, setCoverImage] = useState()

    const relationship = useRef()
    const username = useRef()
    const email = useRef()
    const password = useRef()
    const desc = useRef()
    const from = useRef()

    useEffect(() => {
        socket?.on("getUsers", (users) => {
            setOnline(users.filter(item => item.userId !== currentUser.id))
        });
    }, [socket, currentUser])


    const handleClick = async () => {
        if (!user.user_id_User_Follows?.some(item => item.username === currentUser.username)) {
            socket?.emit("sendNotification", {
                senderName: currentUser.username,
                receiverId: user.id,
                type: "follow",
            });
        }
        followUser(currentUser, user, dispatch)
    }

    //edit profile
    const updateProfile = async (e, close) => {
        e.preventDefault()
        console.log(username.current.value);
        var updatedUser = {
            ...currentUser,
            id: currentUser.id,
            desc: desc.current.value,
            username: username.current.value,
            email: email.current.value,
            password: password.current.value,
            from: from.current.value,
            relationship: relationship.current.value,
        }
        if (profileImage) {
            uploadImg(profileImage).then((res, err) => {
                updatedUser = { ...updatedUser, profile_picture: res }
                updateUser(updatedUser, dispatch)
            })
        } else {
            console.log(updatedUser)
            updateUser(updatedUser, dispatch)
        }
        close()
    }

    const HomeRightBar = () => {
        return (
            <>
                {/* <div className="birthdayContainer">
                    <img src={`${PF}gift.png`} alt="" className="birthdayImg" />
                    <span className="birthdayText">
                        <b>Person 1</b> and <b>3 other friends</b> have a birthday today
                    </span>
                </div> */}
                {/* <img alt="" className="rightbarAd" /> */}
                <h4 className="rightbarTitle">Online Friends</h4>
                <ul className="rightbarFriendList">
                    {online && online?.map(u => (
                        <Online key={u.id} user={u} online="online" />
                    ))}
                </ul>
                <h4 className="rightbarTitle">Offline Friends</h4>
                <ul className="rightbarFriendList">
                    {online?.length > 0
                        ? currentUser.follow_user_id_Users.filter(item => {
                            return online?.some((c) => (item.Follow.follow_user_id !== c.userId))
                        })?.map(u => (
                            <Online key={u.id} user={u} />
                        ))
                        : currentUser.follow_user_id_Users.map(u => (
                            <>
                                {console.log(u)}
                                <Online key={u.id} user={u} />
                            </>
                        ))
                    }
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
                            {user.user_id_User_Follows?.some(item => item.username === currentUser.username) ? "Unfollow" : "Follow"}
                            {user.user_id_User_Follows?.some(item => item.username === currentUser.username) ? <Remove /> : <Add />}
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
                                <form onSubmit={e => updateProfile(e, close)} className="profile_modal">
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
                                                        <input id="profileFile" name="profileFile" type="file" accept=".png, .jpeg, .jpg" onChange={e => setProfileImage(e.target.files[0])} style={{ display: "none" }} />
                                                    </label>
                                                </div>
                                                <div className="imageContainer">
                                                    <img src={profileImage ? URL.createObjectURL(profileImage) : currentUser.profile_picture ? currentUser.profile_picture : PF + "person/noAvatar.png"} alt="" className="profileImg" />
                                                </div>
                                            </div>
                                            <div className="editCard">
                                                <div className="titleContainer">
                                                    <div className="title">Cover picture</div>
                                                    <label className="editProfileImg">
                                                        <span className='editProfileImgText'>Edit</span>
                                                        <input id="coverFile" name="coverFile" type="file" accept=".png, .jpeg, .jpg" onChange={e => setCoverImage(e.target.files[0])} style={{ display: "none" }} />
                                                    </label>
                                                </div>
                                                <div className="imageContainer">
                                                    <img src={coverImage ? URL.createObjectURL(coverImage) : currentUser.cover_picture ? currentUser.cover_picture : PF + "person/noCover.png"} alt="" className="coverImg" />
                                                </div>
                                            </div>
                                            <div className="editCard">
                                                <div className="titleContainer">
                                                    <div className="title">Username</div>
                                                </div>
                                                <input
                                                    className="editProfileInput"
                                                    type="text"
                                                    defaultValue={currentUser.username}
                                                    ref={username}
                                                />
                                            </div>
                                            <div className="editCard">
                                                <div className="titleContainer">
                                                    <div className="title">Email</div>
                                                </div>
                                                <input
                                                    className="editProfileInput"
                                                    type="email"
                                                    required
                                                    defaultValue={currentUser.email}
                                                    ref={email}
                                                />
                                            </div>
                                            <div className="editCard">
                                                <div className="titleContainer">
                                                    <div className="title">Password</div>
                                                </div>
                                                <input
                                                    className="editProfileInput"
                                                    type="password"
                                                    required minLength="4"
                                                    defaultValue={currentUser.password}
                                                    ref={password}
                                                />
                                            </div>
                                            <div className="editCard">
                                                <div className="titleContainer">
                                                    <div className="title">Description</div>
                                                </div>
                                                <input
                                                    className="editProfileInput"
                                                    type="text"
                                                    defaultValue={currentUser.desc}
                                                    ref={desc}
                                                />
                                            </div>
                                            <div className="editCard">
                                                <div className="titleContainer">
                                                    <div className="title">From</div>
                                                </div>
                                                <input
                                                    className="editProfileInput"
                                                    type="text"
                                                    defaultValue={currentUser.from}
                                                    ref={from}
                                                />
                                            </div>
                                            <div className="editCard">
                                                <div className="titleContainer">
                                                    <div className="title">Relationship</div>
                                                </div>
                                                <select className='relationshipSelect' name="color" ref={relationship} >
                                                    <option>Single</option>
                                                    <option>In a relationship</option>
                                                    <option>Complicated</option>
                                                </select>
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
                        <span className="rightbarInfoValue">{currentUser.email}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From:</span>
                        <span className="rightbarInfoValue">{currentUser.from}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship:</span>
                        <span className="rightbarInfoValue">{currentUser.relationship}</span>
                    </div>
                </div>
                <h4 className="rightbarTitle">User follows</h4>
                <div className="rightbarFollowings">
                    {user.follow_user_id_Users?.map(u => (
                        <Link key={u.id} to={"/profile/" + u.username} style={{ textDecoration: "none", color: "black" }}>
                            <div className="rightbarFollowing">
                                <img
                                    src={u.profile_picture ? u.profile_picture : PF + "person/noAvatar.png"}
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
