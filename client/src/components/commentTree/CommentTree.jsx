import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Comment } from "../../comment/Comment"
import { fetchReplies } from "../../redux/apiCalls"
import './commentTree.css'

export const CommentTree = ({ comments }) => {
    const dispatch = useDispatch()
    useEffect(() => {
        fetchReplies(comments, dispatch)
    },[comments, dispatch])
    return (
        <div>
            {comments?.map(comment => {
                return (<>
                    {/* {console.log(replies)}*/}
                    <Comment key={comment.id} comment={comment} />
                    {comment.Comments?.length > 0 && <>
                        {console.log("yes", comment.Comments)}
                        <div className="replyContainer">
                            <CommentTree comments={comment?.Comments} />
                        </div>
                    </>}
                </>)
            })}
        </div>
    )
}
