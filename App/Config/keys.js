
const devKeys = () =>{
    return {
        jwtSecret:'Secret@123&',
        mongoURI:'mongodb://localhost:27017/sourceo',
        messageMobile:'+19096555292',
        twilioSid:process.env.TWILIO_ACCOUNT_SID, 
        twilioAuthToken:process.env.TWILIO_AUTH_TOKEN
    }
}

const ciKeys = () =>{
    return {
        jwtSecret:process.env.JWT_SECRET,
        mongoURI:process.env.MONGO_URI,
        messageMobile:process.env.MESSAGE_MOBILE,
        twilioSid:process.env.TWILIO_ACCOUNT_SID, 
        twilioAuthToken:process.env.TWILIO_AUTH_TOKEN
    }
}

const prodKeys = () =>{
    return {
        jwtSecret:process.env.JWT_SECRET,
        mongoURI:process.env.MONGO_URI,
        messageMobile:process.env.MESSAGE_MOBILE,
        twilioSid:process.env.TWILIO_ACCOUNT_SID, 
        twilioAuthToken:process.env.TWILIO_AUTH_TOKEN
    }
}

const keyManager = () =>{
    const node_env = process.env.NODE_ENV || 'development'
    switch(node_env){
        case 'development':
            return devKeys()
        case 'ci':
            return ciKeys()
        case 'production':
            return prodKeys()
    }
}

module.exports = keyManager()