import axios from '../config/axios'

export const setUser = (user) =>{
    return {type:'SET_USER',payload:user}
}

export const setAddress = (address) =>{
    return {type:'ADD_ADDRESS',payload:address}
}

export const removeAddress = (addressId) =>{
    return {type:'REMOVE_ADDRESS',payload:addressId}
}

export const removeUser = () =>{
    return {type:'REMOVE_USER'}
}

export const startSetUser = (loginData,redirect,setAuth) =>{    //login action
    return ((dispatch)=>{
        axios.post('/user/login',loginData)
            .then((response)=>{
                localStorage.setItem('user',response.data.payload._id)
                console.log(response.data)
                dispatch(setUser(response.data.payload))
                redirect()
            })
            .catch((err)=>{
                if(err.response&&err.response.data.payload&&err.response.data.payload.signup===false){
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
        const user = localStorage.getItem('user')
        axios.get('/user/account',{
            headers:{
                'x-auth':token,
                'userId':user
            }
        })
            .then((response)=>{
                console.log(response.data)
                localStorage.setItem('user',response.data._id)
                dispatch(setUser(response.data))
                redirect()
            })
            .catch((err)=>{
                dispatch(removeUser())
                console.log(err)
            })
    })
}

export const startRemoveUser = (token,redirect) =>{ //logout action
    const user = localStorage.getItem('user')
    return((dispatch)=>{
        axios.get('/user/logout',{
            headers:{
                'x-auth':token,
                'userId':user
            }
        })
        .then((response)=>{
            localStorage.removeItem('x-auth')
            localStorage.removeItem('user')
            dispatch(removeUser())
            redirect()
        })
        .catch((err)=>{
            console.log(err)
        })
    })
}

export const startAddAddress = (address,redirect) =>{
    return((dispatch)=>{
        const token = localStorage.getItem('x-auth')
        const user = localStorage.getItem('user')
        axios.post('/user/addAddress/',address,{
            headers:{
                'x-auth':token,
                'userId':user
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