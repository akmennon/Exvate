
module.exports.delCache = async (option={},client) =>{
    try{
        if(!option.hasOwnProperty('hashKey')){
            console.log('cache delete missing hashKey')
            throw Error()
        }

        if(!option.hasOwnProperty('pathValue')){
            throw Error()
        }
        else if(!option.hasOwnProperty('pathValueId')){
            option.pathValueId = 0                              //Id of the Aggregate in a path - since a path can have multiple queries
        }

        const key = JSON.stringify(Object.assign({},option.pathValue,option.pathValueId))
        await client.HDEL(option.hashKey,key)
        return this
    }
    catch(e){
        return Promise.reject(e)
    }
}

module.exports.delCacheAll = async (option={},client) =>{
    try{
        if(!option.hasOwnProperty('hashKey')){
            console.log('cache delete missing hashKey')
            throw Error()
        }

        await client.del(option.hashKey)
        return Promise.resolve()
    }
    catch(e){
        return Promise.reject(e)
    }
}