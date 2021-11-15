import axios from "axios"

export const loginCall = async (userCredientals, dispatch) => {
    dispatch({ type: "LOGIN_START" })
    try {
        const res = await axios.post('/auth/login', userCredientals)
        res.data.profilePicture  = res.data.profilePicture ? res.data.profilePicture : 'person/noAvatar.png' 
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data })
    } catch (error) {
        dispatch({ type: "LOGIN_FAILURE", payload: error })
    }
}