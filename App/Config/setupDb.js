const mongoose = require('mongoose')

/* Mongodb server creation */

const setupDb = () =>{
    mongoose.connect('mongodb://localhost:27017/sourceo',{useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex:true, useFindAndModify: false})
        .then(()=>{
            console.log('Connected to db')
        })
        .catch((err)=>{
            console.log('Db connection failed. Reason :', err)
        })
}

module.exports = setupDb        // Used in index page