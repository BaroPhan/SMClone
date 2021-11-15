import './share.css'
import { PermMedia, Label, Room, EmojiEmotions, Cancel } from "@mui/icons-material"
import { useContext, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'

export default function Share({ username }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const { user } = useContext(AuthContext)
    const desc = useRef()
    const [file, setFile] = useState()
    const submitHandler = async (e) => {
        e.preventDefault()
        const newPost = {
            userId: user._id,
            desc: desc.current.value
        }
        if (file) {
            const data = new FormData()
            const fileName = Date.now() + '-' + file.name
            data.append("name", fileName)
            data.append("file", file)
            newPost.img = fileName
            try {
                await axios.post("/upload", data)
            } catch (error) {
                console.log(error);
            }
        }
        try {
            await axios.post("/post", newPost)
            window.location.reload()
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img className="shareProfileImg" src={PF + user.profilePicture} alt="" />
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
                <form className="shareBottom" onSubmit={submitHandler}>
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
                </form>
            </div>
        </div>
    );
}