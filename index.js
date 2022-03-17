const express = require('express')
const App = express()
const setupDb = require('./App/Config/setupDb')
const setupCache = require('./App/Config/setupCache')
const router = require('./App/Config/router')
const cors = require('cors')
const port = 3015
const helmet = require('helmet')
const rateLimiter = require('./App/Config/rateLimiter')
const cache = require('./App/Config/cache').execCache

/*App.use(helmet())*/

App.use(express.json())

App.use(express.urlencoded({
    extended: false     //Security reasons
}))

/* PENDING - cors management - exposed headers for frontend*/
App.use(cors({exposedHeaders: ['x-auth','full','total']}))

App.use(rateLimiter)

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
    .then(()=>{
        return setupCache()
    })
    .then((redisClient)=>{
        cache(redisClient)
        App.locals.redisClient = redisClient
        App.listen(port,()=>{
            console.log('Listening on port', port)
        })
    })
    .catch((err)=>{
        console.log(err)
    })