const express = require('express')
const App = express()
const setupDb = require('./App/Config/setupDb')
const router = require('./App/Config/router')
const cors = require('cors')
const port = 3015

App.use(express.json())

App.use(express.urlencoded({
    extended: true
}))

/* PENDING - cors management - exposed headers for frontend*/
App.use(cors({exposedHeaders: ['x-auth','full','total'],credentials: true, origin: true}))

App.use('/',router)

App.use((err,req,res,next)=>{
    if(err.statusCode){
        const {statusCode,message,payload} = err
        if(payload){
            res.status(statusCode).send({status:false,message,payload})
        }
        else{
            res.status(statusCode).send({status:false,message})
        }
    }
    else{
        console.log(err)
        res.status(500).send("Server error")
    }
})

setupDb()
    .then((res)=>{
        console.log(res)
        App.listen(port,()=>{
            console.log('Listening on port', port)
        })
    })
    .catch((err)=>{
        console.log(err)
    })