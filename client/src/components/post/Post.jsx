import './post.css'
import { CameraAltOutlined, Cancel, MoreVert } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom'
import { addComment, likeHandler, uploadImg } from '../../redux/apiCalls'
import { useDispatch, useSelector } from 'react-redux';
import { CommentTree } from '../commentTree/CommentTree';

export default function Post({ post }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER

    // const [user, setUser] = useState([])
    // const [like, setLike] = useState()
    const [commentImg, setCommentImg] = useState()
    // const [comments, setComments] = useState()
    const [showComment, setshowComment] = useState(false)
    // const [isLiked, setIsLiked] = useState(false)
    const currentUser = useSelector(state => state.user.currentUser)
    const comments = useSelector(state => state.comment.comments).filter(item => item.post_id === post.id);
    const commentRef = useRef()
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

    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${post.user?.username}`} style={{ textDecoration: 'none' }}>
                            <img src={post.user?.profile_picture ? PF + post.user?.profile_picture : PF + "person/noAvatar.png"} alt="" className="postProfileImg" />
                        </Link>
                        <span className="postUsername">{post.user?.username}</span>
                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    <img src={post.img} alt="" className="postImg" />
                </div>
                <hr className="postHr" />
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img className="likeIcon" src={`${PF}like.png`} onClick={(e) => likeHandler("post", post, currentUser, dispatch)} alt="" />
                        <img className="likeIcon" src={`${PF}heart.png`} onClick={(e) => likeHandler("post", post, currentUser, dispatch)} alt="" />
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
                                    <img src={currentUser.profile_picture ? PF + currentUser.profile_picture : PF + "person/noAvatar.png"} alt="" className="postProfileImg" />
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
