const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const header = req.headers.token
    if (header) {
        console.log("header found")
        const token = header.split(" ")[1]
        jwt.verify(token, process.env.JWT_SEC_KEY, (err, user) => {
            if (err) res.status(403).json('Token isnt valid')
            req.user = user
            console.log('token valid')
            next()
        })
    } else console.log('no header')
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.id === req.body.user_id || req.user.is_admin) {
            console.log("authenticated")
            next()
        } else res.status(403).json('You arent allowed to do that')
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.is_admin) {
            next()
        } else res.status(403).json('You arent allowed to do that')
    })
}

module.exports = { verifyTokenAndAdmin, verifyTokenAndAuthorization }