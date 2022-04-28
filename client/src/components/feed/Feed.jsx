import './feed.css'
import Share from '../../components/share/Share'
import Post from '../../components/post/Post'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getComments, getPosts, getUsers } from '../../redux/apiCalls'
import { Users } from '../users/Users'
export default function Feed({ username, search, socket }) {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user.currentUser)
    const posts = useSelector(state => state.post.posts)
    const users = useSelector(state => state.user.users)

    useEffect(() => {
        getUsers(dispatch)
        getPosts(username, currentUser, dispatch)
        getComments(dispatch)

    }, [username, currentUser, dispatch])
    return (
        <div className="feed">
            <div className="feedWrapper">
                {((!username || username === username.username) && !search) && <Share />}
                {search &&
                    <div className="searchContainer">
                        <span className="search">SEARCH RESULT</span>
                        <Users socket={socket} users={users.filter(u => (
                            u.username.toLowerCase().includes(search.toLowerCase())
                        ))} />
                    </div>
                }

                {search
                    ? posts.filter(p => (
                        p.desc.toLowerCase().includes(search.toLowerCase())
                    )).map(post => (
                        <Post key={post.id} post={post} />
                    ))
                    : posts.map(p => (
                        <Post key={p.id} post={p} />
                    ))
                }
            </div>
        </div>
    )
}
