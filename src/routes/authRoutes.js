import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'

const router = express.Router()

router.post('/registration', async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) return res.status(400).json({error: 'No data provided'})
        const hashedPassword = bcrypt.hashSync(password, 8)

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            }
        })
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.status(200).json({ token })
    } catch (error) {
        console.log('The error has been occured', error)
        res.status(503).json({error: error})
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) return res.status(400).json({error: 'No data provided'})

        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if (!user) return res.status(404).json({ message: "User not found" })

        const passwordMatch = bcrypt.compareSync(password, user.password)
        if (!passwordMatch) return res.status(401).send({ message: "Invalid password" })

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.status(200).json({ token })
    } catch (error) {
        console.log('The error has been occured', error)
        res.status(503).json({error: error})
    }

})


export default router