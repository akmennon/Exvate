
const devKeys = () =>{
    return {
        jwtSecret:'Secret@123&'
    }
}

const ciKeys = () =>{
    return {
        jwtSecret:process.env.JWT_SECRET
    }
}

const prodKeys = () =>{
    return {
        jwtSecret:process.env.JWT_SECRET
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