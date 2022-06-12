import Axios from 'axios'

const axios = Axios.create({
    baseURL:'http://localhost:3015',
    timeout:20000,
    withCredentials:true
})

axios.interceptors.response.use(function(response){
    const resToken = response.headers['x-auth']
    if(resToken){
        localStorage.setItem('x-auth',resToken)
    }
    return response
},
function(error){
    return Promise.reject(error)
})

axios.interceptors.request.use(function(config){
    if(config.headers){
        console.log(config)
        if((config.headers.hasOwnProperty('x-auth')&&(!config.headers['x-auth']||config.headers['x-auth']=="undefined"))||(config.headers.hasOwnProperty('userId')&&(!config.headers['userId']||config.headers['userId']=="undefined"))){
            localStorage.clear()
            window.location.assign('/user/login')
            throw new Error("Invalid credentials")
        }
        else{
            return config
        }
    }
    else{
        return config
    }
},
function(error){
    return Promise.reject(error)
})

export default axios