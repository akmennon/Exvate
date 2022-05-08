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

export default axios