import React,{useState} from 'react'
import axios from '../../config/axios'
import errMsg from '../../config/errMsg'
import CircularProgress from '@mui/material/CircularProgress'
import { useNavigate } from 'react-router-dom'

//Last - Adding loading and error to pages

function Register(){
    const [state,setState] = useState({
        name:'',
        password:'',
        email:'',
        message:'',
        confirmPassword:'',
        data:{},
        status:'none',
        loading:false
    })
    const navigate = useNavigate()

    //PENDING - Validation required before submitting

    const handleSubmit = (e) =>{
        e.preventDefault()
        const registerData = {
            name:state.name,
            password:state.password,
            email:{
                email:state.email
            },
            confirmPassword:state.confirmPassword
        }
        setState(p=>({...p,loading:true}))
        setTimeout(()=>{
            setState(p=>({...p,loading:false}))
        },8000)

        axios.post('/user/signup',registerData)
            .then((res)=>{
                setState(p=>({...p,data:res.data,status:true,loading:false}))
            })
            .catch((err)=>{
                setState(p=>({...p,name:'',password:'',email:'',confirmPassword:'',message:errMsg(err,'Error Registering'),status:false,loading:false}))
            })
    }

    const handleClick = (e) =>{
        if(e.target.name==='resendEmail'){  //sends the registration email again
            navigate('/user/resendEmail')
        }
        else{
            setState(p=>({
                ...p,[e.target.name]:e.target.value
            }))
        }
    }

    if(state.status===true){
        return(
            <div>
                An email has been send to your account. please check your email
            </div>
        )
    }
    else{
        return(
            <div>
                <form onSubmit={handleSubmit}>

                    <div style={{display:'flex',flexDirection:'column',width:200,margin:20,rowGap:15}}>

                    <h1>Register</h1>

                    <label htmlFor='name'>Name </label>
                    <input type='text' id='name' name='name' placeholder='Name' onChange={handleClick} value={state.name}/>

                    <label htmlFor='email'>Email </label>
                    <input type='text' id='email' name='email' placeholder='Email' onChange={handleClick} value={state.email}/>

                    <label htmlFor='password'>Password </label>
                    <input type='password' id='password' name='password' placeholder='Password' onChange={handleClick} value={state.password}/>

                    <label htmlFor='confirmPassword'>Confirm Password </label>
                    <input type='password' id='confirmPassword' name='confirmPassword' placeholder='Confirm Password' onChange={handleClick} value={state.confirmPassword}/>

                    <button type='submit' style={{display:'flex',flexDirection:'row'}}>Register {state.loading?<CircularProgress/>:<span/>}</button>

                    </div>

                </form>
                {
                    state.status===false?<p>{state.message}</p>:<span/>
                }
            </div>
        )
    }
}

export default Register