const profileEdit = async (req,res,next) =>{
    const user = req.user

    if(!user.profileChangeToken.value){
        res.status(401).end({status:false,message:'Unauthorized attempt'})
    }
    else if(user.profileChangeToken.value!=req.body.profileToken){
        res.status(401).send({status:false,message:'Invalid Attempt'})
    }
    else if( (new Date(user.profileChangeToken.createdAt).getTime()+1800000) < Date.now()){
        res.status(401).send({status:false,message:'Invalid Attempt'})
    }
    else{
        req.body = {...req.body.payload}
        next()
    }
}

module.exports = profileEdit