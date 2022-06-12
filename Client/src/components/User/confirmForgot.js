import React, { useEffect, useState } from 'react' 
import axios from "../../config/axios"
import { useNavigate, useParams } from 'react-router-dom'

/* To change the password when forgotten, redirected from email */

function ConfirmForgot(props){
    const [state,setState] = useState({
        password:'',
        confirmPassword:'',
        verified:false,
        data:true
    })
    const params = useParams()
    const navigate = useNavigate()

    const handleSubmit =(e)=>{
        e.preventDefault()

        //sends the password to the server to update
        if(state.password===state.confirmPassword){
            axios.post(`/user/confirmForgot/${params.token}`,{
                password:state.password,
                confirmPassword:state.confirmPassword
            })
            .then((response)=>{
                if(response.data.hasOwnProperty('errors')){
                    console.log(response.data.errors)
                }
                else{
                    console.log(response.data)
                    navigate('/user/login')
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        else{
            alert('Password does not match')
        }
    }

    const handleClick =(e)=>{
        setState(p=>({
            ...p,[e.target.name]:e.target.value
        }))
    }

    useEffect(()=>{
        //checks if the token provided is valid and redirects if its not
        const forgotToken = params.token
        if(forgotToken){
            axios.post('/user/forgotCheck',{},{
                headers:{
                    forgotToken
                },
                timeout:10000
            })
            .then((response)=>{
                console.log(response)
                if(response.data.value){
                    setState((p)=>{
                        return {...p,data:response.data.value,verified:true}
                    })
                }
                else{
                    navigate('/user/login',{replace:true})
                }
            })
            .catch((err)=>{
                setState((p)=>{
                    return {...p,data:false,verified:true}
                })
                console.log(err)
            })
        }
        else{
            setState(p=>{return {...p,verified:false}})
        }
    },[])

    if(state.verified){
        if(state.data){
            return(
                <div>
                    <form onSubmit={handleSubmit}>
                    
                        <label htmlFor='password'>Password</label>
                        <input type='password' onChange={handleClick} id='password' name='password'/>
    
                        <label htmlFor='confirmPassword'>Confirm Password</label>
                        <input type='password' onChange={handleClick} id='confirmPassword' name='confirmPassword'/>
    
                        <button type='submit'>Submit</button>
                    </form>
                </div>
            )
        }
        else{
            return(
                <div>
                    <h3>Error processing request. Redirecting.</h3>
                    {
                        setTimeout((props)=>{
                            navigate('/user/login',{replace:true})
                        },3000,props)
                    }
                </div>
            )
        }
    }
    else{
        return (
            <h2>Loading</h2>
        )
    }
}

export default ConfirmForgot