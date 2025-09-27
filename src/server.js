import express from 'express'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/auth.js'

const app = express()
const port = process.env.PORT

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})