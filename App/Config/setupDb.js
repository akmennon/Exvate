const mongoose = require('mongoose')
const keys = require('./keys')

/* Mongodb server creation */

const setupDb = () =>{
    mongoose.connect(keys.mongoURI,{useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex:true, useFindAndModify: false})
        .then(()=>{
            console.log('Connected to db')
        })
        .catch((err)=>{
            console.log('Db connection failed. Reason :', err)
        })
}

module.exports = setupDb        // Used in index page