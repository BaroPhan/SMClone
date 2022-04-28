import './users.css'
import { useDispatch, useSelector } from 'react-redux'
import { followUser } from '../../redux/apiCalls'
import { Link } from 'react-router-dom'

export const Users = ({ users, socket }) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user.currentUser)

    const handleFollow = async (e, user) => {
        e.preventDefault()
        if (!user.user_id_User_Follows?.some(item => item.username === currentUser.username)) {
            socket?.emit("sendNotification", {
                senderName: currentUser.username,
                receiverId: user.id,
                type: "follow",
            });
        }
        followUser(currentUser, user, dispatch)
    }

    return (
        <div className="users">
            {users.length > 0 &&
                <div className="usersWrapper">
                    <div className="usersTitle">
                        People
                    </div>
                    {users.map(user => (
                        <form className="usersContent" onSubmit={e => handleFollow(e, user)}>
                            <div className="usersImgContainer">
                                <Link to={`/profile/${user?.username}`} style={{ textDecoration: 'none' }}>
                                    <img className="usersImg" src={user.profile_picture ? user.profile_picture : PF + "person/noAvatar.png"} alt="" />
                                </Link>
                                <span className="usersName">{user.username}</span>
                            </div>
                            {user.id !== currentUser.id &&
                                <button className="usersBtn" type="submit">
                                    {user.user_id_User_Follows?.some(item => item.username === currentUser.username) ? "Unfollow" : "Follow"}
                                </button>}
                        </form>
                    ))}
                </div>
            }
        </div >
    );
}