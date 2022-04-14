import { useEffect, useState } from "react"
import { Comment } from "../../comment/Comment"
import { publicRequest } from "../../requestMethods"
import './commentTree.css'

export const CommentTree = ({ comments }) => {
    const [replies, setReplies] = useState()
    useEffect(() => {
        const fetchReplies = async () => {
            const res = await publicRequest.post('/comment/get_replies', comments)
            console.log(res.data);
            setReplies(res.data)
        }
        fetchReplies()
    }, [comments])

    return (
        <div>
            {console.log(replies)}
            {replies?.map(comment => {
                return (<>
                    {/* {console.log(replies)}*/}
                    <Comment key={comment.id} comment={comment} />
                    {comment?.Comments?.length > 0 && <>
                        <div className="replyContainer">
                            <CommentTree comments={comment?.Comments} />
                        </div>
                    </>}
                </>)
            })}
        </div>
    )
}
