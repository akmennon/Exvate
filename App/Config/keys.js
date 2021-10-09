
const devKeys = () =>{
    return {
        jwtSecret:'Secret@123&',
        mongoURI:'mongodb://localhost:27017/sourceo',
        messageMobile:process.env.MESSAGE_MOBILE,
        twilioSid:process.env.TWILIO_ACCOUNT_SID, 
        twilioAuthToken:process.env.TWILIO_AUTH_TOKEN,
        awsSid:process.env.AWS_ACCESS_KEY_ID,
        awsAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
        awsRegion:process.env.AWS_REGION
    }
}

const ciKeys = () =>{
    return {
        jwtSecret:process.env.JWT_SECRET,
        mongoURI:process.env.MONGO_URI,
        messageMobile:process.env.MESSAGE_MOBILE,
        twilioSid:process.env.TWILIO_ACCOUNT_SID, 
        twilioAuthToken:process.env.TWILIO_AUTH_TOKEN,
        awsSid:process.env.AWS_ACCESS_KEY_ID,
        awsAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
        awsRegion:process.env.AWS_REGION
    }
}

const prodKeys = () =>{
    return {
        jwtSecret:process.env.JWT_SECRET,
        mongoURI:process.env.MONGO_URI,
        messageMobile:process.env.MESSAGE_MOBILE,
        twilioSid:process.env.TWILIO_ACCOUNT_SID, 
        twilioAuthToken:process.env.TWILIO_AUTH_TOKEN,
        awsSid:process.env.AWS_ACCESS_KEY_ID,
        awsAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
        awsRegion:process.env.AWS_REGION
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