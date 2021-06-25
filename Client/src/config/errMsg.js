
const errMsg = (err,msg) =>{
    if(err&&err.response&&err.response.data&&err.response.data.message){
        return err.response.data.message
    }
    else{
        return msg
    }
}

module.exports = errMsg