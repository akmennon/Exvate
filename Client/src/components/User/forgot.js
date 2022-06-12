import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../config/axios'

/* forgot password request handler */

function Forgot (props) {
    const [state,setState] = useState({
        email:'',
        success:false,
        message:''
    })
    const navigate = useNavigate()

    const handleClick =(e)=>{
        setState(p=>({
            ...p,[e.target.name]:e.target.value
        }))
    }

    const handleSubmit =(e)=>{
        e.preventDefault()
        axios.post('/user/forgotPassword',{
            email:state.email
        },{
            timeout:5000
        })
        .then((response)=>{
            console.log(response.data)
            setState((p)=>{return{...p,success:response.data.status,message:response.data.message}})
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const redirect =()=>{
        setTimeout((props)=>{
            navigate('/user/login',{replace:true})
        },5000,props)
    }

    if(!state.success){
        return(
            <div>
                <form onSubmit={handleSubmit} >

                    <label htmlFor='email'>Email</label>
                    <input type='text' name='email' id='email' placeholder='Email' onChange={handleClick}/>

                    <button type='submit'>Submit</button>
                </form>
            </div>
        )
    }
    else{
        return(
            <div>
                <h3>{state.message}</h3>
                {
                    redirect()
                }
            </div>
        )
    }
}

export default Forgot