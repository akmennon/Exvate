import React from 'react'
import axios from '../../config/axios'
import errMsg from '../../config/errMsg'
import CircularProgress from '@mui/material/CircularProgress'

/* registration */

class Register extends React.Component{
    constructor(props){
        super(props)
        this.state={
            name:'',
            password:'',
            email:'',
            message:'',
            confirmPassword:'',
            data:{},
            status:'none',
            loading:false
        }
    }

    //PENDING - Validation required before submitting

    handleSubmit = (e) =>{
        e.preventDefault()
        const registerData = {
            name:this.state.name,
            password:this.state.password,
            email:{
                email:this.state.email
            },
            confirmPassword:this.state.confirmPassword
        }
        this.setState({loading:true})
        setTimeout(()=>{
            this.setState({loading:false})
        },8000)

        axios.post('/user/signup',registerData)
            .then((res)=>{
                this.setState({data:res.data,status:true,loading:false})
            })
            .catch((err)=>{
                this.setState({name:'',password:'',email:'',confirmPassword:'',message:errMsg(err,'Error Registering'),status:false,loading:false})
            })
    }

    handleClick = (e) =>{
        if(e.target.name==='resendEmail'){  //sends the registration email again
            this.props.history.push('/user/resendEmail')
        }
        else{
            this.setState({
                [e.target.name]:e.target.value
            })
        }
    }

    render(){
        if(this.state.status===true){
            return(
                <div>
                    An email has been send to your account. please check your email
                </div>
            )
        }
        else{
            return(
                <div>
                    <form onSubmit={this.handleSubmit}>
    
                        <div style={{display:'flex',flexDirection:'column',width:200,margin:20,rowGap:15}}>

                        <h1>Register</h1>
    
                        <label htmlFor='name'>Name </label>
                        <input type='text' id='name' name='name' placeholder='Name' onChange={this.handleClick} value={this.state.name}/>

                        <label htmlFor='email'>Email </label>
                        <input type='text' id='email' name='email' placeholder='Email' onChange={this.handleClick} value={this.state.email}/>

                        <label htmlFor='password'>Password </label>
                        <input type='password' id='password' name='password' placeholder='Password' onChange={this.handleClick} value={this.state.password}/>

                        <label htmlFor='confirmPassword'>Confirm Password </label>
                        <input type='password' id='confirmPassword' name='confirmPassword' placeholder='Confirm Password' onChange={this.handleClick} value={this.state.confirmPassword}/>

                        <button type='submit' style={{display:'flex',flexDirection:'row'}}>Register {this.state.loading?<CircularProgress/>:<span/>}</button>

                        </div>

                    </form>
                    {
                        this.state.status===false?<p>{this.state.message}</p>:<span/>
                    }
                </div>
            )
        }
    }
}

export default Register