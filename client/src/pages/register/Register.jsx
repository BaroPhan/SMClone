import axios from 'axios'
import { useRef } from 'react'
import { useNavigate } from 'react-router'
import './register.css'
export default function Register() {
    const username = useRef()
    const email = useRef()
    const password = useRef()
    const passwordAgain = useRef()
    const navigate = useNavigate()

    const handleClick = async (e) => {
        e.preventDefault();
        if (password.current.value !== passwordAgain.current.value) {
            console.log(password.current.value, passwordAgain.current.value);
            passwordAgain.current.setCustomValidity("Password doesnt match!")
        }
        else {
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value
            }
            try {
                await axios.post('/auth/register', user)
                navigate('/login')
            } catch (error) {
                console.log(error);
            }
        }
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
                        <input placeholder="Username" required ref={username} className="loginInput" />
                        <input placeholder="Email" required ref={email} type="email" className="loginInput" />
                        <input placeholder="Password" required ref={password} type="password" minLength="4" className="loginInput" />
                        <input placeholder="Re-enter password" required ref={passwordAgain} type="password" minLength="4" className="loginInput" />
                        <button className="loginButton" type="submit">Sign Up</button>
                        <button className="loginRegisterButton">Log into your account</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
