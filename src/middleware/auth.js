import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {
    try {
        console.log(process.env.JWT_SECRET)
        let token = req.headers['authorization']
        token = token.split(' ')[1]

        if (!token) res.status(401).json({ message: "No token provided" })

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) res.status(401).json({ message: "Invalid token" })

            req.userId = decoded.id
            next()
        })
    } catch (error) {
        console.log('The error has been occured', error)
        res.status(503).json({error: error})
    }
}

export default authMiddleware