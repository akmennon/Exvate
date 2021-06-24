const express = require('express')
const App = express()
const setupDb = require('./App/Config/setupDb')
const router = require('./App/Config/router')
const cors = require('cors')
const port = 3015
const socketio = require('socket.io')

/* Mongoose server creation function */
setupDb()

App.use(express.json())

App.use(express.urlencoded({
    extended: true
}))

/* PENDING - cors management - exposed headers for frontend*/
App.use(cors({exposedHeaders: ['x-auth','full'],credentials: true, origin: true}))

App.use('/',router)

App.use((err,req,res,next)=>{
    const {statusCode,message} = err
    res.status(statusCode).send({status:false,message})
})

const expressServer = App.listen(port,()=>{
    console.log('Listening on port', port)
})

/* Express server is used to run the socket server*/
const io = socketio(expressServer)

module.exports = {
    App,
    io
}