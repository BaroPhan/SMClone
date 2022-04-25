import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addComment, likeHandler, uploadImg } from '../../redux/apiCalls'
import { format } from 'timeago.js'
import { CameraAltOutlined, Cancel } from '@mui/icons-material'
import './comment.css'
import { io } from 'socket.io-client'

export const Comment = ({ comment }) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const currentUser = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch()
    const replyRef = useRef()
    const [showReply, setShowReply] = useState(false)
    const [file, setFile] = useState()
    const socket = io.connect("ws://localhost:8900");

    const replyHandler = (e) => {
        e.preventDefault()
        var newReply = {
            user_id: currentUser.id,
            desc: replyRef.current.value,
            parent_id: comment.id
        }
        if (file) {
            uploadImg(file).then((res, err) => {
                newReply = { ...newReply, img: res }
                cancel()
                addComment(newReply, dispatch)
            })
        } else {
            addComment(newReply, dispatch)
        }
        document.getElementById('replyInput').value = ''
        document.getElementById('replyInput').blur()
        setShowReply(!showReply)
    }
    const cancel = () => {
        setFile(null)
        document.getElementById('reply').value = ""
    }
    return (
        <div className="container">
            <Link to={`/profile/${comment.user?.username}`} style={{ textDecoration: 'none' }}>
                <img src={comment.user?.profile_picture ? PF + comment.user?.profile_picture : PF + "person/noAvatar.png"} alt="" className="commentProfileImg" />
            </Link>
            <div className="commentContainer">
                <div className="comment">
                    <div className="commentBar">
                        <div className="bar">
                            <span className="commentUsername">{comment.user?.username}</span>
                            <span className="commentTxt">{comment.desc}</span>
                        </div>
                        {comment.CommentLikes?.length > 0 &&
                            <div className="commentLikes">
                                <img className="like" src={`${PF}like.png`} alt="" />
                                <span className="likeNumber">{comment.CommentLikes.length}</span>
                            </div>
                        }
                    </div>

                    <img src={comment.img} alt="" className="commentImg" />
                    <div className="commentResponses">
                        <span id="comment" className="commentRes" onClick={(e) => likeHandler("comment", comment, currentUser, socket, dispatch)}>Like</span>
                        <span className="commentRes" onClick={() => setShowReply(!showReply)}>Reply</span>
                        <span className="commentRes">{format(comment.createdAt)}</span>
                    </div>
                </div>

                {showReply &&
                    <form onSubmit={replyHandler}>
                        <div className="reply">
                            <Link to={`/profile/${currentUser.username}`} style={{ textDecoration: 'none' }}>
                                <img src={currentUser.profile_picture ? PF + currentUser.profile_picture : PF + "person/noAvatar.png"} alt="" className="replyProfileImg" />
                            </Link>
                            <div className="replyInputBar">
                                <input id='replyInput' placeholder="Write a reply..." className="replyInput" ref={replyRef} />
                                <label className="replyOptions">
                                    <CameraAltOutlined className="replyIcon" />
                                    <input hidden type="file" id="reply" name="reply" accept=".png, .jpg, .jpeg" onChange={e => setFile(e.target.files[0])} />
                                </label>
                            </div>
                        </div>
                        {file &&
                            <div className="reply">
                                <div className="imgContainer">
                                    <img src={URL.createObjectURL(file)} alt="" className="img" />
                                    <Cancel className="cancel" onClick={cancel} />
                                </div>
                            </div>
                        }
                    </form>
                }
            </div>
        </div>
    )
}
