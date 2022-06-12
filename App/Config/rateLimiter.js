const authUser = require('../Middlewares/authUser')
const isJWT = require('validator/lib/isJWT')

const cacheCheck = async (next,client,userIp,path,limiterTokenValue,limiterIpValue,requestCount,window,userToken,totalIp,totalToken) =>{
    try{
        if((userToken&&limiterTokenValue.length<requestCount)||(!userToken&&limiterIpValue.length<requestCount)){
            if(userToken){
                limiterTokenValue = limiterTokenValue.filter((date)=>{
                    const newDate = new Date(date)
                    if(newDate.getTime()<Date.now()-(60000*window)){
                        return false
                    }
                    else{
                        return true
                    }
                })
                limiterTokenValue.push(new Date().toISOString())
                limiterTokenValue = JSON.stringify(limiterTokenValue)
            }
            
            limiterIpValue = limiterIpValue.filter((date)=>{
                const newDate = new Date(date)
                if(newDate.getTime()<Date.now()-(60000*window)){
                    return false
                }
                else{
                    return true
                }
            })
            limiterIpValue.push(new Date().toISOString())
            limiterIpValue = JSON.stringify(limiterIpValue)

            if(!userToken){
                await client.multi().hSet(userIp,'total',JSON.stringify(totalIp)).hSet(userIp,path,limiterIpValue).expire(userToken,60*window).expire(userIp,60*window).exec()
            }
            else{
                await client.multi().hSet(userToken,'total',JSON.stringify(totalToken)).hSet(userIp,'total',JSON.stringify(totalIp)).hSet(userIp,path,limiterIpValue).hSet(userToken,path,limiterTokenValue).expire(userToken,60*window).expire(userIp,60*window).exec()
            }
            return Promise.resolve()
        }
        else{
            if(!userToken){
                await client.multi().hSet(userIp,'RL','true').expire(userIp,60*window).exec()
            }
            else{
                await client.multi().hSet(userToken,'RL','true').hSet(userIp,'RL','true').expire(userIp,60*window).expire(userToken,60*window).exec()
            }
            throw({status:false,message:'You are being rate limited',statusCode:403})
        }
    }
    catch(e){
        return Promise.reject(e)
    }
}

const rateLimiter = async (req,res,next) =>{
    try{
        const client = req.app.locals.redisClient
        const userIp = req.ip
        let userToken = req.header('x-auth') + '.' + req.cookies['auth']
        const userCookie = req.cookies['auth']
        let userId = req.header('userId')
        const path = req.path
        let total = await client.multi().hGet(userIp,'total').hGet(userToken,'total').hGet(userToken,path).hGet(userIp,path).hGet(userIp,'RL').hGet(userToken,'RL').exec()
        let totalIp = total[0]?JSON.parse(total[0]):0
        let totalToken = total[1]?JSON.parse(total[1]):0
        let limiterTokenValue = total[2]?JSON.parse(total[2]):[]
        let limiterIpValue = total[3]?JSON.parse(total[3]):[]
        let userIpRL = total[4]?JSON.parse(total[4]):false
        let userTokenRL = total[5]?JSON.parse(total[5]):false

        if(totalIp>=100||userIpRL){
            throw({status:false,message:'Rate limited',statusCode:403})
        }

        if(userToken&&userId&&userCookie){
            totalToken = !totalToken||totalToken==0?1:totalToken+1
            totalIp = !totalIp||totalToken==0?1:totalIp+1

            if(totalToken>=100||userTokenRL){
                throw({status:false,message:'Rate limited',statusCode:403})
            }

            const validation = isJWT(userToken)

            if(!validation){
                limiterIpValue.push(new Date().toISOString())
                await client.multi().hSet(userIp,'total',JSON.stringify(totalIp)).hSet(userIp,path,JSON.stringify(limiterIpValue)).expire(userIp,3600).exec()
                throw({status:false,message:'Invalid Attempt',statusCode:403})
            }

            await authUser(req,res,next)

            if(!req.user){
                totalIp = totalIp+2
                limiterIpValue.push(new Date().toISOString())
                await client.multi().hSet(userIp,'total',JSON.stringify(totalIp)).hSet(userIp,path,JSON.stringify(limiterIpValue)).expire(userIp,3600).exec()
                throw({status:false,message:'Unauthorized',statusCode:401})
            }
            else{
                userToken = req.user._id
                if(!limiterTokenValue||limiterTokenValue.length==0){
                    limiterTokenValue.push(new Date().toISOString())
                    limiterIpValue.push(new Date().toISOString())
                    await client.multi().hSet(userToken,'total',JSON.stringify(totalToken)).hSet(userIp,'total',JSON.stringify(totalIp)).hSet(userToken,path,JSON.stringify(limiterTokenValue)).hSet(userIp,path,JSON.stringify(limiterIpValue)).expire(userIp,3600).expire(userToken,3600).exec()
                    next()
                    return Promise.resolve()
                }
            }
        }
        else{

            totalIp = !totalIp||totalIp==0?1:totalIp+1

            if(!limiterIpValue||limiterIpValue.length==0){
                limiterIpValue.length!=0?limiterIpValue.push(new Date().toISOString()):limiterIpValue=[new Date().toISOString()]
                limiterIpValue = JSON.stringify(limiterIpValue)
                await client.multi().hSet(userIp,'total',JSON.stringify(totalIp)).hSet(userIp,path,limiterIpValue).expire(userIp,3600).exec()
                if(userToken||userId){
                    throw({status:false,message:'Invalid Attempt RE',statusCode:403})
                }
                else{
                    next()
                    return Promise.resolve()
                }
            }

        }

        pathValue = req.path.includes('/user/signup')?1:req.path.includes('/user/login')?2:req.path.includes('/user/account')?3:req.path.includes('/user/logout')?4:req.path.includes('/user/forgotPassword')?5:req.path.includes('/user/resendRegisterMail')?6:req.path.includes('/user/confirmSign')?7:req.path.includes('/user/forgotCheck')?8:req.path.includes('/user/addAddress')?9:req.path.includes('/user/removeAddress')?10:req.path.includes('/workOrders')?11:req.path.includes('/supplier/orders/')?12:req.path.includes('/user/companyDetails')?13:req.path.includes('/user/editprofile/changePassword')?14:req.path.includes('/user/editProfile/changeName')?15:req.path.includes('/user/editProfile/changeMobile')?16:req.path.includes('/user/editProfile/changeMobileConfirm')?17:req.path.includes('/user/editProfile/changeCompanyDetails')?18:req.path.includes('/user/sendOtp')?19:req.path.includes('/supplier/bids/create')?20:req.path.includes('/supplier/bids/remove')?21:req.path.includes('/supplier/bid/orders')?22:req.path.includes('/supplier/bids')?23:req.path.includes('/categories/all')?24:req.path.includes('/types/all')?25:req.path.includes('/works/search')?28:req.path.includes('/order/')?27:req.path.includes('/works/')?26:req.path.includes('/user/work/details')?29:req.path.includes('/user/orders')?30:0

        switch(pathValue){
            case 1:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,7,60,userToken,totalIp,totalToken)
                next()
                break;
            case 2:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,12,60,userToken,totalIp,totalToken)
                next()
                break;
            case 3:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,15,60,userToken,totalIp,totalToken)
                next()
                break;
            case 4:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,12,60,userToken,totalIp,totalToken)
                next()
                break;
            case 5:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,5,60,userToken,totalIp,totalToken)
                next()
                break;
            case 6:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,10,60,userToken,totalIp,totalToken)
                next()
                break;
            case 7:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,7,60,userToken,totalIp,totalToken)
                next()
                break;
            case 8:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,5,60,userToken,totalIp,totalToken)
                next()
                break;
            case 9:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,15,60,userToken,totalIp,totalToken)
                next()
                break;
            case 10:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,15,60,userToken,totalIp,totalToken)
                next()
                break;
            case 11:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,15,60,userToken,totalIp,totalToken)
                next()
                break;
            case 12:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,15,60,userToken,totalIp,totalToken)
                next()
                break;
            case 13:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,15,60,userToken,totalIp,totalToken)
                next()
                break;
            case 14:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,5,60,userToken,totalIp,totalToken)
                next()
                break;
            case 15:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,5,60,userToken,totalIp,totalToken)
                next()
                break;
            case 16:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,5,60,userToken,totalIp,totalToken)
                next()
                break;
            case 17:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,5,60,userToken,totalIp,totalToken)
                next()
                break;
            case 18:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,5,60,userToken,totalIp,totalToken)
                next()
                break;
            case 19:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,5,60,userToken,totalIp,totalToken)
                next()
                break;
            case 20:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,15,60,userToken,totalIp,totalToken)
                next()
                break;
            case 21:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,15,60,userToken,totalIp,totalToken)
                next()
                break;
            case 22:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,15,60,userToken,totalIp,totalToken)
                next()
                break;
            case 23:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,15,60,userToken,totalIp,totalToken)
                next()
                break;
            case 24:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,30,60,userToken,totalIp,totalToken)
                next()
                break;
            case 25:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,30,60,userToken,totalIp,totalToken)
                next()
                break;
            case 26:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,30,60,userToken,totalIp,totalToken)
                next()
                break;
            case 27:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,30,60,userToken,totalIp,totalToken)
                next()
                break;
            case 28:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,30,60,userToken,totalIp,totalToken)
                next()
                break;
            case 29:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,15,60,userToken,totalIp,totalToken)
                next()
                break;
            case 30:
                await cacheCheck(next,client,userIp,path,limiterTokenValue,limiterIpValue,15,60,userToken,totalIp,totalToken)
                next()
                break;
            default:
                throw({status:false,message:'Invalid Attempt RE',statusCode:403})
        }
    }
    catch(e){
        console.log(e)
        next(e)
    }
}

module.exports = rateLimiter