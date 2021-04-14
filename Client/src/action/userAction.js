import axios from '../config/axios'

export const setUser = (user) =>{
    return {type:'SET_USER',payload:user}
}

export const removeUser = () =>{
    return {type:'REMOVE_USER'}
}

export const startSetUser = (loginData,redirect) =>{    //login action
    return ((dispatch)=>{
        axios.post('/user/login',loginData)
            .then((response)=>{
                if(response.data.hasOwnProperty('errors')){
                    console.log(response.data.errors)
                }
                else if(!response.data._id){
                    console.log(response.data)
                }
                else{
                    localStorage.setItem('x-auth',response.headers['x-auth'])
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
                console.log('error -',response.data.errors)
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