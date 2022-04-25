import { createSlice } from '@reduxjs/toolkit'

const commentSlice = createSlice({
    name: 'comment',
    initialState: {
        comments: [],
        isFetching: false,
        error: false,
    },
    reducers: {
        //GET COMMENTS
        getCommentsStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        getCommentsSuccess: (state, action) => {
            state.isFetching = false;
            state.comments = action.payload;
            state.error = false;
        },
        getCommentsFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
        //DELETE COMMENT
        deleteCommentStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        deleteCommentSuccess: (state, action) => {
            state.isFetching = false;
            state.comments.splice(
                state.comments.findIndex(item => item._id === action.payload), 1
            )
            state.error = false;
        },
        deleteCommentFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
        //UPDATE COMMENT
        updateCommentStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateCommentSuccess: (state, action) => {
            state.isFetching = false;
            action.payload.map(comment => {
                state.comments[state.comments.findIndex(item => item.id === comment.id)] = comment;
            })
            state.error = false;
        },
        updateCommentFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
        //ADD COMMENT
        addCommentStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        addCommentSuccess: (state, action) => {
            state.isFetching = false;
            state.comments.push(action.payload)
            state.error = false;
        },
        addCommentFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
        //LIKE COMMENT
        likeCommentStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        likeCommentSuccess: (state, action) => {
            state.isFetching = false;
            state.comments[state.comments.findIndex(item => item.id === action.payload.id)].CommentLikes = action.payload.package
            state.error = false;
        },
        likeCommentFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
    },
})

export const {
    getCommentsStart, getCommentsSuccess, getCommentsFailure,
    deleteCommentStart, deleteCommentSuccess, deleteCommentFailure,
    updateCommentFailure, updateCommentSuccess, updateCommentStart,
    addCommentFailure, addCommentSuccess, addCommentStart,
    likeCommentStart, likeCommentSuccess, likeCommentFailure
} = commentSlice.actions
export default commentSlice.reducer