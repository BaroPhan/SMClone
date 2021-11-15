import './feed.css'
import Share from '../../components/share/Share'
import Post from '../../components/post/Post'
// import { Posts, Users } from '../../dummyData'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'

export default function Feed({ username }) {
    const [posts, setPosts] = useState([])
    const { user } = useContext(AuthContext)

    useEffect(() => {
        const fetchPosts = async () => {
            const res = username
                ? await axios.get("/post/profile/" + username)
                : await axios.get("/post/timeline/" + user._id)
            setPosts(res.data.sort((p1, p2) => {
                return new Date(p2.createdAt) - new Date(p1.createdAt)
            }))
        }
        fetchPosts()
    }, [username, user._id])
    return (
        <div className="feed">
            <div className="feedWrapper">
                {(!username || username === user.username) && <Share />}
                {posts.map(p => (
                    <Post key={p._id} post={p} />
                ))}
            </div>
        </div>
    )
}
