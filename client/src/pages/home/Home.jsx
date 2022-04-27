import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Feed from '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';
import './home.css'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

export default function Home() {
    const [socket, setSocket] = useState()
    const user = useSelector(state => state.user.currentUser)

    useEffect(() => {
        setSocket(io("ws://localhost:8900"));
    }, []);
    useEffect(() => {
        socket?.emit("addUser", user.id);
    }, [user, socket]);
    return (
        <>
            <Topbar socket={socket} />
            <div className="homeContainer">
                <Sidebar />
                <Feed />
                <Rightbar socket={socket} />
            </div>
        </>
    )
}
