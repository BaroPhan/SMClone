import { createSlice } from '@reduxjs/toolkit'

const postSlice = createSlice({
    name: 'post',
    initialState: {
        posts: [],
        isFetching: false,
        error: false,
    },
    reducers: {
        //GET PostS
        getPostsStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        getPostsSuccess: (state, action) => {
            state.isFetching = false;
            state.posts = action.payload;
            state.error = false;
        },
        getPostsFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
        //DELETE Post
        deletePostStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        deletePostSuccess: (state, action) => {
            state.isFetching = false;
            state.posts.splice(
                state.posts.findIndex(item => item._id === action.payload), 1
            )
            state.error = false;
        },
        deletePostFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
        //UPDATE Post
        updatePostStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updatePostSuccess: (state, action) => {
            state.isFetching = false;
            state.posts[state.posts.findIndex(item => item._id === action.payload.id)] = action.payload.data;
            state.error = false;
        },
        updatePostFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
        //ADD COMMENT
        // addCommentStart: (state) => {
        //     state.isFetching = true;
        //     state.error = false;
        // },
        // addCommentSuccess: (state, action) => {
        //     state.isFetching = false;
        //     state.posts[state.posts.findIndex(item => item.id === action.payload.post_id)].Comments.push(action.payload)
        //     state.error = false;
        // },
        // addCommentFailure: (state) => {
        //     state.error = true; state.isFetching = false;
        // },
        //LIKE POST
        likePostStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        likePostSuccess: (state, action) => {
            state.isFetching = false;
            state.posts[state.posts.findIndex(item => item.id === action.payload.id)].PostLikes = action.payload.package
            state.error = false;
        },
        likePostFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
        //LIKE COMMENT
        // likeCommentStart: (state) => {
        //     state.isFetching = true;
        //     state.error = false;
        // },
        // likeCommentSuccess: (state, action) => {
        //     const comment_index = state.posts[state.posts.findIndex(item => item.id === action.payload.data.post_id)].Comments.findIndex(item => item.id === action.payload.data.id)
        //     state.isFetching = false;
        //     state.posts[state.posts.findIndex(item => item.id === action.payload.data.post_id)].Comments[comment_index].CommentLikes = action.payload.package
        //     state.error = false;
        // },
        // likeCommentFailure: (state) => {
        //     state.error = true; state.isFetching = false;
        // },
        //ADD Post
        addPostStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        addPostSuccess: (state, action) => {
            state.isFetching = false;
            state.posts.push(action.payload)
            state.error = false;
        },
        addPostFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
    },
})

export const {
    getPostsStart, getPostsSuccess, getPostsFailure,
    deletePostStart, deletePostSuccess, deletePostFailure,
    updatePostFailure, updatePostSuccess, updatePostStart,
    addPostFailure, addPostSuccess, addPostStart,
    // addCommentStart, addCommentSuccess, addCommentFailure,
    likePostStart, likePostSuccess, likePostFailure,
    // likeCommentStart, likeCommentSuccess, likeCommentFailure
} = postSlice.actions
export default postSlice.reducer