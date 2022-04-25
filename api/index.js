const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const helmet = require('helmet')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const commentRoute = require('./routes/comment')
const likeRoute = require('./routes/like')
const convoRoute = require('./routes/conversation')
const messageRoute = require('./routes/messages')
const multer = require('multer')
const path = require('path')
const cors = require('cors')

const { sequelize } = require('./models');
var initModels = require("./models/init-models");
var models = initModels(sequelize);


//connections
const app = express()
dotenv.config()

// mongoose.connect(process.env.MONGO_URL, () => {
//     console.log("Connected to DB");
// })


app.use('/images', express.static(path.join(__dirname, "public/images")))

//middleware
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan("common"))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(req.body)

        cb(null, "public/images")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    },
})
const upload = multer({ storage })

app.post("/api/upload", upload.single("file"), (req, res) => {
    console.log(req.body)

    try {
        return res.status(200).json("file uploaded successfully")
    } catch (error) {
        console.log(error)
    }
})

app.get('/testuser', async (req, res) => {
    try {
        const user = await models.User.findOne({
            where: { username: req.body.username, email: req.body.email },
            include: 'Posts'
        })

        return res.json(user)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})


app.use("/api/user", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/post", postRoute)
app.use("/api/comment", commentRoute)
app.use("/api/like", likeRoute)
app.use("/api/conversation", convoRoute)
app.use("/api/message", messageRoute)

app.listen(8800, () => {
    console.log("Server is listening on PORT 8800");
})