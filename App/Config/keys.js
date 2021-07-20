
const devKeys = () =>{
    return {
        jwtSecret:'Secret@123&',
        mongoURI:'mongodb://localhost:27017/sourceo'
    }
}

const ciKeys = () =>{
    return {
        jwtSecret:process.env.JWT_SECRET,
        mongoURI:process.env.MONGO_URI
    }
}

const prodKeys = () =>{
    return {
        jwtSecret:process.env.JWT_SECRET,
        mongoURI:process.env.MONGO_URI
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