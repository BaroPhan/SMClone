import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
// import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import Rightbar from "../../components/rightbar/Rightbar";
import { addMessage, getConvos } from "../../redux/apiCalls";

export default function Messenger() {
    // const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    // const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    // const [onlineUsers, setOnlineUsers] = useState([]);
    const socket = useRef();

    const msgRef = useRef()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.currentUser)
    const convos = useSelector(state => state.conversation.conversations)
    const [messages, setMessages] = useState([]);

    // const { user } = useContext(AuthContext);
    const scrollRef = useRef();

    useEffect(() => {
        getConvos(user, dispatch)
    }, [user, dispatch, arrivalMessage])
    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                message: data.message,
                createdAt: Date.now(),
            });
        });
    }, []);
    useEffect(() => {
        setMessages(convos?.find(item => item.id === currentChat?.id)?.Messages)
    }, [currentChat, convos]);

    useEffect(() => {
        if (arrivalMessage) {
            if (currentChat?.members.includes(arrivalMessage.sender_id)) {
                setMessages((prev) => [...prev, arrivalMessage]);
            }
        }
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        socket.current.emit("addUser", user.id);
        // socket.current.on("getUsers", (users) => {
        //     console.log(users)
        // });
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender_id: user.id,
            message: msgRef.current.value,
            conversation_id: currentChat.id,
        };

        const receiverId = currentChat.members.find(
            (member) => member !== user.id
        );

        socket.current.emit("sendMessage", {
            senderId: user.id,
            receiverId,
            message: message,
        });

        addMessage(message, dispatch)
        document.getElementById('txt').value = ''
        document.getElementById('txt').blur()
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for friends" className="chatMenuInput" />
                        {convos.map((c) => (
                            <div onClick={() => setCurrentChat(c)}>
                                <Conversation key={c.id} conversation={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {currentChat ? (
                            <>
                                <div className="chatBoxTop">
                                    {messages?.map((m) => (
                                        <div ref={scrollRef}>
                                            <Message message={m} own={m.sender_id === user.id} />
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleSubmit} className="chatBoxBottom">
                                    <textarea
                                        id="txt"
                                        className="chatMessageInput"
                                        placeholder="Write something..."
                                        ref={msgRef}
                                    ></textarea>
                                    <button className="chatSubmitButton" type="submit">
                                        Send
                                    </button>
                                </form>
                            </>
                        ) : (
                            <span className="noConversationText">
                                Open a conversation to start a chat.
                            </span>
                        )}
                    </div>
                </div>
                <div className="chatOnline">
                    {/* <div className="chatOnlineWrapper">
                        <ChatOnline
                            onlineUsers={onlineUsers}
                            currentId={user._id}
                            setCurrentChat={setCurrentChat}
                        />
                    </div> */}
                    <Rightbar />
                </div>
            </div>
        </>
    );
}