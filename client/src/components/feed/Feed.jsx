import './feed.css'
import Share from '../../components/share/Share'
import Post from '../../components/post/Post'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getComments, getPosts, getUsers } from '../../redux/apiCalls'
export default function Feed({ username }) {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user.currentUser)
    const posts = useSelector(state => state.post.posts)

    useEffect(() => {     
        getUsers(dispatch)
        getPosts(username, currentUser, dispatch)
        getComments(dispatch)

    }, [username, currentUser, dispatch])
    return (
        <div className="feed">
            <div className="feedWrapper">
                {(!username || username === username.username) && <Share />}
                {posts.map(p => (
                    <Post key={p.id} post={p} />
                ))}
            </div>
        </div>
    )
}
