import './login.css'
import { useEffect, useRef } from 'react'
import { login } from '../../redux/apiCalls'
// import { AuthContext } from '../../context/AuthContext'
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

export default function Login() {
    const email = useRef()
    const password = useRef()
    const { isFetching, error } = useSelector(state => state.user)
    const dispatch = useDispatch()
    // const socket = io("ws://localhost:8900");
    // useEffect(() => {
    //     socket.on("getUsers", (users) => {
    //         console.log(users);
    //     });
    // })
    const handleClick = (e) => {
        e.preventDefault()
        login({ email: email.current.value, password: password.current.value }, dispatch);
    }
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">SMClone</h3>
                    <span className="loginDesc">Connect with friends and the world around you on SMClone XD</span>
                </div>

                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input placeholder="Email" type="email" required ref={email} className="loginInput" />
                        <input placeholder="Password" type="password" required minLength="4" ref={password} className="loginInput" />
                        <span className="loginError" style={{ display: error ? "block" : "none" }}>Incorrect password or username</span>
                        <button className="loginButton" type="submit" disabled={isFetching}>
                            {isFetching ? <CircularProgress color="inherit" size="20px" /> : "Log In"}
                        </button>
                        <span className="loginForgot">Forgot Password?</span>
                        <Link to="/register" className="loginRegisterButton">Create a new account</Link>
                    </form>
                </div>
            </div>
        </div >
    )
}
