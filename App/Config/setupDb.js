const mongoose = require('mongoose')
const keys = require('./keys')

/* Mongodb server creation */

const setupDb = async () => {
    try{
        await mongoose.connect(keys.mongoURI,{useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex:true, useFindAndModify: false})
        return Promise.resolve('Connected to db')
    }
    catch(e){
        return Promise.reject('Db connection failed. Reason : ',e)
    }
}

module.exports = setupDb        // Used in index page