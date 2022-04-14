import { publicRequest, userRequest } from "../requestMethods"
import { addPostFailure, addPostStart, addPostSuccess, getPostsFailure, getPostsStart, getPostsSuccess, addCommentStart, addCommentSuccess, addCommentFailure, likePostStart, likePostSuccess, likePostFailure, likeCommentStart, likeCommentSuccess } from "./postRedux";
import { loginFailure, loginStart, loginSuccess, resetState } from "./userRedux";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../firebase'

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
//ADD COMMENT
export const addComment = async (comment, dispatch) => {
    dispatch(addCommentStart());
    try {
        const res = await userRequest.post('/comment/', comment);
        dispatch(addCommentSuccess(res.data));
    } catch (err) {
        dispatch(addCommentFailure());
    }
}
//GET REPLIES
export const fetchReplies = async (comments, dispatch) => {
    dispatch(addCommentStart());
    try {
        const res = await publicRequest.post('/comment/get_replies', comments)
        dispatch(addCommentSuccess(res.data));
    } catch (err) {
        dispatch(addCommentFailure());
    }
}
//LIKE HANDLER 
export const likeHandler = async (type, data, currentUser, dispatch) => {
    if (type === "post") {
        dispatch(likePostStart());
        try {
            const res = await userRequest.post(`/like/post/${data.id}`, { user_id: currentUser.id })
            dispatch(likePostSuccess({ package: res.data, id: data.id }));
        } catch (error) {
            dispatch(likePostFailure());
        }
    }
    if (type === "comment") {
        dispatch(likeCommentStart());
        try {
            const res = await userRequest.post(`/like/comment/${data.id}`, { user_id: currentUser.id })
            dispatch(likeCommentSuccess({ package: res.data, data: data }));
        } catch (error) {
            dispatch(likePostFailure());
        }
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