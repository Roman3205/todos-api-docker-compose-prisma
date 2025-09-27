import express from 'express'
import prisma from '../prismaClient.js'

const router = express.Router()

router.get('/all', async (req, res) => {
    try {
        const todos = await prisma.todo.findMany({
            where: {
                userId: req.userId
            }
        })

        res.status(200).json(todos)
    } catch (error) {
        console.log('The error has been occured', error)
        res.status(503).json({error: error})
    }
})

router.post('/create', async (req, res) => {
    try {
        const { task } = req.body
        if (!task) return res.status(400).json({error: 'No data provided'})

        const todo = await prisma.todo.create({
            data: {
                task,
                userId: req.userId
            }
        })

        await prisma.user.update({where: {id: req.userId}, data: {todos: {connect: {id: todo.id}}}, include: {todos: true}})
        
        res.status(201).json(todo)
    } catch (error) {
        console.log('The error has been occured', error)
        res.status(503).json({error: error})
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { completed } = req.body
        if (!task) return res.status(400).json({error: 'No data provided'})
        const { id } = req.params

        const updatedTodo = await prisma.todo.update({
            where: {
                id: Number(id),
                userId: req.userId
            },
            data: {
                completed: !!completed
            }
        })

        res.status(200).json(updatedTodo)
    } catch (error) {
        console.log('The error has been occured', error)
        res.status(503).json({error: error})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        await prisma.todo.delete({
            where: {
                id: Number(id),
                userId: req.userId
            }
        })

        res.status(200).json({ message: "Todo deleted" })
    } catch (error) {
        console.log('The error has been occured', error)
        res.status(503).json({error: error})
    }
})

export default router