import { useEffect, useState } from "react";
import { publicRequest } from "../../requestMethods";
import "./conversation.css";

export default function Conversation({ conversation, currentUser }) {
    const [user, setUser] = useState(null);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(() => {
        const friendId = conversation.members.find((m) => m !== currentUser.id);

        const getUser = async () => {
            try {
                const res = await publicRequest(`/user/?userId=${friendId}`);
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getUser();
    }, [currentUser, conversation]);

    return (
        <div className="conversation">
            <img
                className="conversationImg"
                src={user?.profile_picture ? user?.profile_picture : PF + "person/noAvatar.png"} 
                alt=""
            />
            <span className="conversationName">{user?.username}</span>
        </div>
    );
}