import { publicRequest, userRequest } from "../requestMethods"
import { addPostFailure, addPostStart, addPostSuccess, getPostsFailure, getPostsStart, getPostsSuccess, likePostStart, likePostSuccess, likePostFailure, updatePostStart, updatePostSuccess, updatePostFailure, deletePostStart, deletePostSuccess, deletePostFailure } from "./postRedux";
import { loginFailure, loginStart, loginSuccess, resetState, updateUserFailure, updateUserStart } from "./userRedux";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../firebase'
import { addCommentFailure, addCommentStart, addCommentSuccess, getCommentsFailure, getCommentsStart, getCommentsSuccess, likeCommentFailure, likeCommentStart, likeCommentSuccess, updateCommentFailure, updateCommentStart, updateCommentSuccess } from "./commentRedux";
import { addMessageFailure, addMessageStart, addMessageSuccess, getConversationsFailure, getConversationsStart, getConversationsSuccess } from "./conversationRedux";
import { io } from "socket.io-client";

//USER
//LOGIN
export const login = async (userCredientals, dispatch) => {
    dispatch(loginStart());
    try {
        const res = await publicRequest.post('/auth/login', userCredientals)

        const TOKEN = res.data.accessToken
        userRequest.defaults.headers.token = `Bearer ${TOKEN}`

        res.data.profile_picture = res.data.profile_picture ? res.data.profile_picture : 'person/noAvatar.png'
        console.log(res.data)
        dispatch(loginSuccess(res.data));
    } catch (error) {
        console.log(error)
        dispatch(loginFailure());
    }
}
//LOGOUT
export const logout = async (dispatch) => {
    const socket = io("ws://localhost:8900");
    socket.disconnect()
    dispatch(resetState())
};

//POST
//CREATE POST
export const addPost = async (post, dispatch) => {
    dispatch(addPostStart());
    try {
        const res = await userRequest.post('/post/', post);
        dispatch(addPostSuccess(res.data));
    } catch (err) {
        dispatch(addPostFailure());
    }
}
//UPDATE POST
export const updatePost = async (post, dispatch) => {
    dispatch(updatePostStart());
    try {
        const res = await userRequest.put(`/post/${post.id}`, post);
        console.log(res.data)
        dispatch(updatePostSuccess(res.data));
    } catch (err) {
        dispatch(updatePostFailure());
    }
}
//DELETE POST
export const deletePost = async (post, dispatch) => {
    dispatch(deletePostStart());
    try {
        const res = await userRequest.delete(`/post/${post.id}`, { data: post })
        console.log(res.data)
        dispatch(deletePostSuccess(post.id));
    } catch (err) {
        dispatch(deletePostFailure());
    }
}
//GET POSTS
export const getPosts = async (username, currentUser, dispatch) => {
    dispatch(getPostsStart());
    try {
        const res = username
            ? await publicRequest.get("/post/profile/" + username,)
            : await userRequest.get("/post/timeline/" + currentUser.id, { user_id: currentUser.id })
        res.data.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt)
        })
        console.log(res.data)
        dispatch(getPostsSuccess(res.data));
    } catch (err) {
        dispatch(getPostsFailure());
    }
}
//GET COMMENTS
export const getComments = async (dispatch) => {
    dispatch(getCommentsStart());
    try {
        const res = await publicRequest.get("/comment/")
        dispatch(getCommentsSuccess(res.data));
    } catch (err) {
        dispatch(getCommentsFailure());
    }
}
//ADD COMMENT
export const addComment = async (comment, dispatch) => {
    dispatch(addCommentStart());
    try {
        const res = await userRequest.post('/comment/', comment);
        getComments(dispatch)
        dispatch(addCommentSuccess(res.data));
    } catch (err) {
        dispatch(addCommentFailure());
    }
}
//LIKE HANDLER 
export const likeHandler = async (type, data, currentUser, socket, dispatch) => {
    if (type === "post") {
        dispatch(likePostStart());
        try {
            const res = await userRequest.post(`/like/post/${data.id}`, { user_id: currentUser.id })
            res.data.some(item => item.user_id === currentUser.id) && socket.emit("sendNotification", {
                senderName: currentUser.username,
                receiverId: data.user_id,
                type: "postLike",
            });

            dispatch(likePostSuccess({ package: res.data, id: data.id }));
        } catch (error) {
            console.log(error)
            dispatch(likePostFailure());
        }
    }
    if (type === "comment") {
        dispatch(likeCommentStart());
        try {
            const res = await userRequest.post(`/like/comment/${data.id}`, { user_id: currentUser.id })
            res.data.some(item => item.user_id === currentUser.id) && socket.emit("sendNotification", {
                senderName: currentUser.username,
                receiverId: data.user_id,
                type: "commentLike",
            });

            dispatch(likeCommentSuccess({ package: res.data, id: data.id }));
        } catch (error) {
            dispatch(likeCommentFailure());
        }
    }
}

//CONVERSATIONS & MESSAGES
//GET CONVOS
export const getConvos = async (user, dispatch) => {
    dispatch(getConversationsStart());
    try {
        const res = await publicRequest.get(`/conversation/${user.id}`)
        dispatch(getConversationsSuccess(res.data));
    } catch (err) {
        dispatch(getConversationsFailure());
    }
}
//ADD MESSAGE
export const addMessage = async (message, dispatch) => {
    dispatch(addMessageStart());
    try {
        const res = await userRequest.post('/message/', message);
        dispatch(addMessageSuccess(res.data));
    } catch (err) {
        dispatch(addMessageFailure());
    }
}

//UPLOAD IMG
export const uploadImg = async (file) => {
    return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, new Date().getTime() + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        reject(error)
                        break;
                    case 'storage/canceled':
                        reject(error)
                        break;

                    // ...

                    case 'storage/unknown':
                        reject(error)
                        break;
                    default:
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL)
                });
            }
        );
    })
}