import { Link } from 'react-router-dom'
import './online.css'
export default function Online({ user }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER

    return (
        <li className="rightbarFriend">
            <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none' }}>
                <div className="rightbarProfileImgContainer">
                    <img rc={user.profile_picture ? user.profile_picture : PF + "person/noAvatar.png"} alt="" className="rightbarProfileImg" />
                    <span className="rightbarOnline"></span>
                </div>
            </Link>
            <span className="rightbarUsername">{user.username}</span>
        </li>
    )
}
