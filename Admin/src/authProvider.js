import axios from './config/Axios'
import io from 'socket.io-client'

const socket = io('http://localhost:3015/admin')

const authProvider = {
    login: ({ username, password }) =>  {

        socket.emit('login',{email:username,password:password})

        const socketPromise = new Promise((resolve,reject)=>{
            socket.on('token',(token)=>{
                try{
                    if(token.token){
                        sessionStorage.setItem('token',token.token)
                        resolve(token)
                    }
                    else{
                        reject(token.err)
                    }
                }
                catch(e){
                    reject(e)
                }
            })
        })
        
        return socketPromise
        .then((token)=>{
            console.log(token)
            return Promise.resolve()
        })
        .catch((err)=>{
            console.log(err)
            return Promise.reject()
        })

    },
    checkAuth: params => {
        const token = sessionStorage.getItem('token')

        return axios.get('/token',{
            headers:{
                'x-admin':token
            }
        })
        .then((response)=>{
            if(response.status===200){
                return Promise.resolve()
            }
            return Promise.reject()
        })
        .catch((err)=>{
            console.log(err)
            return Promise.reject()
        })
    },
    getPermissions: params => Promise.resolve(),
    logout: () => {
        sessionStorage.removeItem('token');
        socket.close()
        return Promise.resolve();
    }
};

export default authProvider;