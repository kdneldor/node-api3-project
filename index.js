// code away!
const express = require('express')
const server = express()

const postRouter = require('./posts/postRouter')
const userRouter = require('./users/userRouter')

server.use(express.json())
server.use(userRouter)
server.use(postRouter)

server.listen(5000, () => {
    console.log(`Server running at http://localhost:5000`)
})