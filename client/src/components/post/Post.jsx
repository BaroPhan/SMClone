import './post.css'
import { CameraAltOutlined, Cancel, Delete, Edit, EmojiEmotions, Label, MoreVert, PermMedia, Room } from '@mui/icons-material';
import { useRef, useState, useEffect } from 'react';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom'
import { addComment, deletePost, likeHandler, updatePost, uploadImg } from '../../redux/apiCalls'
import { useDispatch, useSelector } from 'react-redux';
import { CommentTree } from '../commentTree/CommentTree';
import Popup from 'reactjs-popup';
import { io } from "socket.io-client";


export default function Post({ post }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER

    const [commentImg, setCommentImg] = useState()
    const [showComment, setshowComment] = useState(false)
    const [file, setFile] = useState()
    const currentUser = useSelector(state => state.user.currentUser)
    const comments = useSelector(state => state.comment.comments).filter(item => item.post_id === post.id)
    const commentRef = useRef()
    const socket = io.connect("ws://localhost:8900");
    const desc = useRef()
    const dispatch = useDispatch()

    const cancel = async () => {
        setCommentImg(null)
        document.getElementById('img').value = "";
    }
    const commentHandler = async (post_id, e) => {
        e.preventDefault()
        var newComment = {
            user_id: currentUser.id,
            post_id: post_id,
            desc: commentRef.current.value
        }
        if (commentImg) {
            uploadImg(commentImg).then((res, err) => {
                newComment = { ...newComment, img: res }
                cancel()
                addComment(newComment, dispatch)
            })
        } else {
            addComment(newComment, dispatch)
        }
        document.getElementById('input').value = ''
        document.getElementById('input').blur()
    }
    const updateHandler = (e, close_option) => {
        e.preventDefault()
        var updatedPost = {
            id: post.id,
            desc: desc.current.value,
            user_id: currentUser.id
        }
        if (file) {
            uploadImg(file).then((res, err) => {
                updatedPost = { ...updatedPost, img: res }
                updatePost(updatedPost, dispatch)
            })
        } else {
            updatePost(updatedPost, dispatch)
        }
        close_option()
    }
    const deleteHandler = (e, close_option) => {
        e.preventDefault()
        deletePost(post, dispatch)
        close_option()
    }

    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${post.user?.username}`} style={{ textDecoration: 'none' }}>
                            <img src={post.user?.profile_picture ? post.user?.profile_picture : PF + "person/noAvatar.png"} alt="" className="postProfileImg" />
                        </Link>
                        <span className="postUsername">{post.user?.username}</span>
                        <span className="postDate">{format(post.updatedAt)}</span>
                    </div>
                    {post.user?.username === currentUser.username &&
                        <Popup
                            trigger={
                                <div className="postTopRight">
                                    <MoreVert />
                                </div>
                            }
                            nested
                            position="bottom right"
                            arrow="bottom right"
                            closeOnDocumentClick>
                            {close_option => (
                                <div className="popup-menu">
                                    <div className="popup-wraper">
                                        <Popup
                                            trigger={
                                                <div className="popup-item">
                                                    <span className="popup-icon"><Edit /></span>
                                                    <div className="popup-text">Edit post</div>
                                                </div>
                                            }
                                            modal
                                        >
                                            {close => (
                                                <form onSubmit={e => updateHandler(e, close_option)} className="modal">
                                                    <button className="close" onClick={close_option}>
                                                        &times;
                                                    </button>
                                                    <div className="header"> Edit post </div>
                                                    <hr className="postHr" />
                                                    <div className="content">
                                                        <div className="postWrapper">
                                                            <div className="postTopLeft">
                                                                <Link to={`/profile/${post.user?.username}`} style={{ textDecoration: 'none' }}>
                                                                    <img src={post.user?.profile_picture ? PF + post.user?.profile_picture : PF + "person/noAvatar.png"} alt="" className="postProfileImg" />
                                                                </Link>
                                                                <span className="postUsername">{post.user?.username}</span>
                                                            </div>
                                                            <div className="postCenter">
                                                                <input
                                                                    defaultValue={post?.desc}
                                                                    className="editInput"
                                                                    type="text"
                                                                    ref={desc}
                                                                />
                                                                <img src={file ? URL.createObjectURL(file) : post.img} alt="" className="postImg" />
                                                            </div>
                                                        </div>
                                                        <hr className="postHr" />
                                                    </div>
                                                    <div className="actions">
                                                        <div className="editBottom">
                                                            <div className="editOptions">
                                                                <label className="editOption">
                                                                    <PermMedia htmlColor="tomato" className="editIcon" />
                                                                    <span className="editOptionText">Photo</span>
                                                                    <input id="file" name="file" type="file" accept=".png, .jpeg, .jpg" onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }} />
                                                                </label>
                                                                <div className="editOption">
                                                                    <Label htmlColor="blue" className="editIcon" />
                                                                    <span className="editOptionText">Tag</span>
                                                                </div>
                                                                <div className="editOption">
                                                                    <Room htmlColor="green" className="editIcon" />
                                                                    <span className="editOptionText">Location</span>
                                                                </div>
                                                                <div className="editOption">
                                                                    <EmojiEmotions htmlColor="goldenrod" className="editIcon" />
                                                                    <span className="editOptionText">Feelings</span>
                                                                </div>
                                                            </div>
                                                            <button className="editButton" type="submit">Add to your post</button>
                                                        </div>
                                                    </div>
                                                </form>
                                            )}
                                        </Popup>
                                        <Popup
                                            trigger={
                                                <div className="popup-item">
                                                    <span className="popup-icon"><Delete /></span>
                                                    <div className="popup-text">Delete post</div>
                                                </div>
                                            }
                                            modal
                                        >
                                            {close => (
                                                <form onSubmit={e => deleteHandler(e, close_option)} className="modal">
                                                    <button className="close" onClick={close_option}>
                                                        &times;
                                                    </button>
                                                    <div className="header"> Delete post </div>
                                                    <hr className="postHr" />
                                                    <div className="content">
                                                        <span className="deleteNotice">Are you sure you want to delete this post?</span>
                                                    </div>
                                                    <div className="actions">
                                                        <button className="deleteButtonNo" onClick={close_option} >NO</button>
                                                        <button className="deleteButtonYes" type="submit">YES</button>
                                                    </div>
                                                </form>
                                            )}
                                        </Popup>
                                    </div>
                                </div>
                            )}
                        </Popup>
                    }
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    <img src={post.img} alt="" className="postImg" />
                </div>
                <hr className="postHr" />
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img className="likeIcon" src={`${PF}like.png`} onClick={(e) => likeHandler("post", post, currentUser, socket, dispatch)} alt="" />
                        <img className="likeIcon" src={`${PF}heart.png`} onClick={(e) => likeHandler("post", post, currentUser, socket, dispatch)} alt="" />
                        <span className="postLikeCounter">{post.PostLikes?.length} people like it</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText" onClick={() => setshowComment(!showComment)}>{post.comment} comments</span>
                    </div>
                </div>
                {showComment &&
                    <>
                        <form onSubmit={(e) => commentHandler(post.id, e)}>
                            <hr className="postHr" />
                            <div className="postComment">
                                <Link to={`/profile/${currentUser.username}`} style={{ textDecoration: 'none' }}>
                                    <img src={currentUser.profile_picture ? currentUser.profile_picture : PF + "person/noAvatar.png"} alt="" className="postProfileImg" />
                                </Link>
                                <div className="commentInputBar">
                                    <input id="input" placeholder="Write a comment..." className="commentInput" ref={commentRef} />
                                    <label className='commentOptions'>
                                        <CameraAltOutlined className='commentIcon' />
                                        <input id='img' name='img' type='file' accept='.png, .jpg, .jpeg' onChange={(e) => setCommentImg(e.target.files[0])} style={{ display: 'none' }} />
                                    </label>
                                </div>
                            </div>
                            {commentImg && <div className="postComment">
                                <div className="commentImgContainer">
                                    <img src={URL.createObjectURL(commentImg)} alt="" className="commentImg" />
                                    <Cancel className='cancel' onClick={cancel} />
                                </div>
                            </div>}
                        </form>
                        {comments &&
                            <CommentTree comments={comments} />
                        }
                    </>
                }
            </div>
        </div>
    )
}
