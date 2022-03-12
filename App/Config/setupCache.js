const redis = require('redis')
const keys = require('./keys')

const setupCache = async () =>{
    try{
        const client = redis.createClient()
        await client.connect(keys.redisURL)
        return Promise.resolve(client)
    }
    catch(e){
        return Promise.reject(e)
    }
}

module.exports = setupCache