import './closeFriend.css'

export default function CloseFriend({ user }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    return (
        <li className="sidebarFriend">
            <img src={user.profile_picture ? user.profile_picture : PF + "person/noAvatar.png"} alt="" className="sidebarFriendImg" />
            <span className="sidebarFriendName">{user.username}</span>
        </li>
    )
}
