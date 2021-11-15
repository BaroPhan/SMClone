import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    user: {
        _id: "6177951c8f0f1493def59df4",
        username: "Jane UPDATED",
        email: "jane@email.com",
        password: "$2b$10$ISMfbwrDtx2xqvpJOI5dOOS5duYvLn2ewA.8cjEfK0ZQKUuTURbb2",
        followers: [
            "61778fa17b605a4f80125217"
        ],
        isAdmin: false,
        createdAt: "2021-10-26T05:41:48.750Z",
        updatedAt: "2021-11-11T08:36:13.285Z",
        __v: 0,
        desc: "this is an UPDATED desc",
        profilePicture: "person/6.jpeg",
        followings: []
    },
    isFetching: false,
    erroe: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)
    return (
        <AuthContext.Provider value={{ user: state.user, isFetching: state.isFetching, error: state.error, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}