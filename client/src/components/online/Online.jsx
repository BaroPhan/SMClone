import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import './online.css'
export default function Online({ user, online }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const users = useSelector(state => state.user.users).find(item => online ? item.id === user.userId : item.username === user.username)


    return (
        <li className="rightbarFriend">
            <Link to={`/profile/${users?.username}`} style={{ textDecoration: 'none' }}>
                <div className="rightbarProfileImgContainer">
                    <img src={users?.profile_picture ? users?.profile_picture : PF + "person/noAvatar.png"} alt="" className="rightbarProfileImg" />
                    {online ? <span className="rightbarOnline"></span> : <span className="rightbarOffline"></span>}
                </div>
            </Link>
            <span className="rightbarUsername">{users?.username}</span>
        </li>
    )
}
