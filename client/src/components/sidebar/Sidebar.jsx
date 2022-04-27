import './sidebar.css'
import {
    RssFeed,
    Chat,
    PlayCircleFilledOutlined,
    Group,
    Event,
} from "@mui/icons-material";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CloseFriend from '../closeFriend/CloseFriend';

export default function Sidebar() {
    const users = useSelector(state => state.user.users)
    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <ul className="sidebarList">
                    <Link to='/' style={{ textDecoration: 'none', color: 'black' }}>
                        <li className="sidebarListItem">
                            <RssFeed className="sidebarIcon" />
                            <span className="sidebarListItemText">Feed</span>
                        </li>
                    </Link>
                    <Link to='/messenger' style={{ textDecoration: 'none', color: 'black' }}>
                        <li className="sidebarListItem">
                            <Chat className="sidebarIcon" />
                            <span className="sidebarListItemText">Chats</span>
                        </li>
                    </Link>

                    <li className="sidebarListItemDisabled">
                        <PlayCircleFilledOutlined className="sidebarIcon" />
                        <span className="sidebarListItemText" >Videos</span>
                    </li>
                    <li className="sidebarListItemDisabled">
                        <Group className="sidebarIcon" />
                        <span className="sidebarListItemText">Groups</span>
                    </li>
                    <li className="sidebarListItemDisabled">
                        <Event className="sidebarIcon" />
                        <span className="sidebarListItemText">Events</span>
                    </li>

                </ul>
                {/* <button className="sidebarButton">Show More</button> */}
                <hr className="sidebarHr" />
                <ul className="sidebarFriendList">
                    {users.map(u => (
                        <CloseFriend key={u.id} user={u} />
                    ))}
                </ul>
            </div>
        </div>
    );
}
