import './share.css'
import { PermMedia, Label, Room, EmojiEmotions, Cancel } from "@mui/icons-material"
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addPost, uploadImg } from '../../redux/apiCalls'

export default function Share({ username }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.currentUser)
    const desc = useRef()
    const [file, setFile] = useState()
    const submitHandler = async (e) => {
        e.preventDefault()
        var newPost = {
            user_id: user.id,
            desc: desc.current.value
        }
        if (file) {
            uploadImg(file).then((res, err) => {
                newPost = { ...newPost, img: res }
                addPost(newPost, dispatch)
                window.location.reload();
            })
        } else {
            addPost(newPost, dispatch)
            window.location.reload();
        }
    }

    return (
        <div className="share">
            <div className="shareWrapper">
                <form onSubmit={submitHandler}>
                    <div className="shareTop">
                        <img className="shareProfileImg" src={PF + user.profile_picture} alt="" />
                        <input
                            placeholder={"What's in your mind " + user.username + "?"}
                            className="shareInput"
                            ref={desc}
                        />
                    </div>
                    <hr className="shareHr" />
                    {file && (
                        <div className="shareImgContainer">
                            <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
                            <Cancel className="shareCancelImg" onClick={() => {
                                setFile(null)
                                document.getElementById("file").value = "";
                            }} />
                        </div>
                    )}
                    <div className="shareBottom">
                        <div className="shareOptions">
                            <label htmlFor="file" className="shareOption">
                                <PermMedia htmlColor="tomato" className="shareIcon" />
                                <span className="shareOptionText">Photo or Video</span>
                                <input id="file" name="file" type="file" accept=".png, .jpeg, .jpg" onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }} />
                            </label>
                            <div className="shareOption">
                                <Label htmlColor="blue" className="shareIcon" />
                                <span className="shareOptionText">Tag</span>
                            </div>
                            <div className="shareOption">
                                <Room htmlColor="green" className="shareIcon" />
                                <span className="shareOptionText">Location</span>
                            </div>
                            <div className="shareOption">
                                <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
                                <span className="shareOptionText">Feelings</span>
                            </div>
                        </div>
                        <button className="shareButton" type="submit">Share</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
