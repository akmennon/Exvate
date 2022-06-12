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
const cookieParser = require('cookie-parser')
const {xss} = require('express-xss-sanitizer')
const toobusy = require('toobusy-js')
const hpp = require('hpp');

/*App.use(helmet())*/

App.use(hpp());

App.use(express.json({limit:"1kb"}))

App.use(express.urlencoded({
    extended: false,     //Security reasons
    limit:"1kb",
    parameterLimit:10
}))

App.use(xss())

App.use(cookieParser())

/* PENDING - cors management - exposed headers for frontend*/
App.use(cors({exposedHeaders: ['x-auth','full','total',"set-cookie"],credentials:true,origin:"http://localhost:3000"}))

App.use(function(req, res, next) {
    if (toobusy()) {
      res.status(503).send("The server is busy, please try again afer a while.");
    } else {
      next();
    }
  });

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