import { useSelector } from "react-redux"
import { Comment } from "../comment/Comment"
import './commentTree.css'

export const CommentTree = ({ comments }) => {
    const feed = useSelector(state => state.comment.comments).filter(item => {
        return comments.some((c) => (item.id === c.id))
    })

    return (
        <div>
            {feed?.map(comment => {
                return (<>
                    <Comment key={comment.id} comment={comment} />
                    {comment.Comments?.length > 0 && <>
                        <div className="replyContainer">
                            <CommentTree comments={comment?.Comments} />
                        </div>
                    </>}
                </>)
            })}
        </div>
    )
}
