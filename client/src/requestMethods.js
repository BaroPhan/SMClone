import axios from 'axios'

const BASE_URL = "http://localhost:8800/api/"

const currentUser = localStorage.getItem("persist:root") && JSON.parse(JSON.parse(localStorage.getItem("persist:root"))?.user)?.currentUser
const TOKEN = currentUser ? currentUser?.accessToken : ""

export const publicRequest = axios.create({
    baseURL: BASE_URL
})

export const userRequest = axios.create({
    baseURL: BASE_URL,
    headers: { token: `Bearer ${TOKEN}` }
})