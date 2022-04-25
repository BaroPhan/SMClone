import "./message.css";
import { format } from "timeago.js";

export default function Message({ message, own }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    return (
        <div className={own ? "message own" : "message"}>
            {own
                ? <div className="messageTop">
                    <p className="messageText">{message.message}</p>
                    <img
                        className="messageImg"
                        src={message.sender?.profile_picture ? message.sender?.profile_picture : PF + "person/noAvatar.png"}
                        alt=""
                    />
                </div>
                : <div className="messageTop">
                    <img
                        className="messageImg"
                        src={message.sender?.profile_picture ? message.sender?.profile_picture : PF + "person/noAvatar.png"}
                        alt=""
                    />
                    <p className="messageText">{message.message}</p>
                </div>
            }
            <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
    );
}