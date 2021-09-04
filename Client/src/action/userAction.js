import axios from '../config/axios'

export const setUser = (user) =>{
    return {type:'SET_USER',payload:user}
}

export const setAddress = (address) =>{
    return {type:'ADD_ADDRESS',payload:address}
}

export const removeUser = () =>{
    return {type:'REMOVE_USER'}
}

export const startSetUser = (loginData,redirect,setAuth) =>{    //login action
    return ((dispatch)=>{
        axios.post('/user/login',loginData)
            .then((response)=>{
                localStorage.setItem('x-auth',response.headers['x-auth'])
                console.log(response.data)
                dispatch(setUser(response.data.payload))
                redirect()
            })
            .catch((err)=>{
                console.log(err.response.data)
                if(err.response.data.payload&&err.response.data.payload.email){
                    setAuth(p=>({...p,password:'',resendMail:true}))
                }
                else{
                    setAuth(p=>({...p,password:''}))
                }
            })
    })
}

export const startTokenSetUser = (token,redirect) =>{   //token login action
    return ((dispatch)=>{
        axios.get('/user/account',{
            headers:{
                'x-auth':token
            }
        })
            .then((response)=>{
                if(response.data.hasOwnProperty('errors')){
                    console.log(response.data.errors)
                }
                else{
                    console.log(response.data)
                    dispatch(setUser(response.data))
                    redirect()
                }
            })
            .catch((err)=>{
                console.log(err)
            })
    })
}

export const startRemoveUser = (token,redirect) =>{ //logout action
    return((dispatch)=>{
        console.log(token)
        axios.get('/user/logout',{
            headers:{
                'x-auth':token
            }
        })
        .then((response)=>{
            if(response.data.hasOwnProperty('errors')){
                console.log('error -',response.data.message)
            }
            else{
                localStorage.removeItem('x-auth')
                dispatch(removeUser())
                redirect()
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    })
}

export const startAddAddress = (address,redirect) =>{
    return((dispatch)=>{
        const token = localStorage.getItem('x-auth')
        axios.post('/user/addAddress/',address,{
            headers:{
                'x-auth':token
            }
        })
        .then((response)=>{
            console.log(response)
            dispatch(setAddress(response.data))
            redirect()
        })
        .catch((err)=>{
            console.log(err)
        })
    })
}