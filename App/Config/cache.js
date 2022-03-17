const mongoose = require('mongoose')
const exec = mongoose.Query.prototype.exec
const execAgg = mongoose.Aggregate.prototype.exec

module.exports.execCache = async (client) =>{
    mongoose.Query.prototype.cache = async function (option={}){
        try{
            if(!option.hasOwnProperty('hashKey')){
                option.hashKey = 'universal'
            }

            if(!option.hasOwnProperty('pathValue')){
                throw Error()
            }
            else if(!option.hasOwnProperty('pathValueId')){
                option.pathValueId = 0                              //Id of the query in a path - since a path can have multiple queries
            }
        
            this.cacheParam = true
            this.hashKey = option.hashKey
            this.key = JSON.stringify(Object.assign({},option.pathValue,option.pathValueId))
            this.pathValue = option.pathValue
            return this
        }
        catch(e){
            return Promise.reject(e)
        }
    }
    
    mongoose.Query.prototype.exec = async function (){
        try{
            if(!this.cacheParam){
                let result = await exec.apply(this,arguments)
                return Promise.resolve(result)
            }
            
            const hashKey = this.hashKey
            const key = this.key
    
            let cachedValue = JSON.parse(await client.hGet(hashKey,key))

            if(!cachedValue){
                const result = await exec.apply(this,arguments)
                if(this.pathValue=='authUser'&&(!result||(Array.isArray(result)&&result.length==0))){
                    return Promise.resolve(result)
                }
                await client.multi().hSet(hashKey,key,JSON.stringify(result)).expire(hashKey,60*10).exec()
                return Promise.resolve(result)
            }
    
            if(Array.isArray(cachedValue)){
                cachedValue.forEach(element => {
                    return this.model(element)
                });
                return Promise.resolve(cachedValue)
            }
            else{
                cachedValue = this.model(cachedValue)
                return Promise.resolve(cachedValue)
            }
        }
        catch(e){
            return Promise.reject(e)
        }
    }

    mongoose.Query.prototype.delCache = async (option) =>{
        try{
            if(!option.hasOwnProperty('hashKey')){
                console.log('cache delete missing hashKey')
                return this
            }

            if(!option.hasOwnProperty('pathValue')){
                throw Error()
            }
            else if(!option.hasOwnProperty('pathValueId')){
                option.pathValueId = 0                              //Id of the query in a path - since a path can have multiple queries
            }
    
            const key = Object.assign({},option.pathValue,option.pathValueId)
            await client.hDel(option.hashKey,key)
            return this
        }
        catch(e){
            return Promise.reject(e)
        }
    }

    mongoose.Aggregate.prototype.cache = async function (option={}){
        try{
            if(!option.hasOwnProperty('hashKey')){
                option.hashKey = 'universal'
            }

            if(!option.hasOwnProperty('pathValue')){
                throw Error()
            }
            else if(!option.hasOwnProperty('pathValueId')){
                option.pathValueId = 0                              //Id of the Aggregate in a path - since a path can have multiple queries
            }
        
            this.cacheParam = true
            this.hashKey = option.hashKey
            this.key = JSON.stringify(Object.assign({},option.pathValue,option.pathValueId))
            return this
        }
        catch(e){
            return Promise.reject(e)
        }
    }
    
    mongoose.Aggregate.prototype.exec = async function (){
        try{
            if(!this.cacheParam){
                let result = await execAgg.apply(this,arguments)
                return Promise.resolve(result)
            }
            
            const hashKey = this.hashKey
            const key = this.key
    
            let cachedValue = JSON.parse(await client.hGet(hashKey,key))
            if(!cachedValue){
                const result = await execAgg.apply(this,arguments)
                await client.multi().hSet(hashKey,key,JSON.stringify(result)).expire(hashKey,60*30).exec()
                return Promise.resolve(result)
            }
    
            if(Array.isArray(cachedValue)){
                cachedValue.forEach(element => {
                    return this.model(element)
                });
                return Promise.resolve(cachedValue)
            }
            else{
                cachedValue = this.model(cachedValue)
                return Promise.resolve(cachedValue)
            }
        }
        catch(e){
            return Promise.reject(e)
        }
    }

    mongoose.Aggregate.prototype.delCache = async (option) =>{
        try{
            if(!option.hasOwnProperty('hashKey')){
                console.log('cache delete missing hashKey')
                return this
            }

            if(!option.hasOwnProperty('pathValue')){
                throw Error()
            }
            else if(!option.hasOwnProperty('pathValueId')){
                option.pathValueId = 0                              //Id of the Aggregate in a path - since a path can have multiple queries
            }
    
            const key = Object.assign({},option.pathValue,option.pathValueId)
            await client.hDel(option.hashKey,key)
            return this
        }
        catch(e){
            return Promise.reject(e)
        }
    }

    module.exports.delCache = async (option={}) =>{
        try{
            if(!option.hasOwnProperty('hashKey')){
                console.log('cache delete missing hashKey')
                return this
            }

            if(!option.hasOwnProperty('pathValue')){
                throw Error()
            }
            else if(!option.hasOwnProperty('pathValueId')){
                option.pathValueId = 0                              //Id of the Aggregate in a path - since a path can have multiple queries
            }
    
            const key = Object.assign({},option.pathValue,option.pathValueId)
            await client.hDel(option.hashKey,key)
            return this
        }
        catch(e){
            return Promise.reject(e)
        }
    }

    module.exports.delCacheAll = async (option={}) =>{
        try{
            if(!option.hasOwnProperty('hashKey')){
                console.log('cache delete missing hashKey')
                return this
            }

            await client.del(option.hashKey)
            return this
        }
        catch(e){
            return Promise.reject(e)
        }
    }
}