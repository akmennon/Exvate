import React from 'react'
import axios from '../../config/axios'

/* registration */

class Register extends React.Component{
    constructor(props){
        super(props)
        this.state={
            name:'',
            password:'',
            email:''
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
            }
        }

        axios.post('/user/signup',registerData)
            .then((response)=>{
                console.log(response)
                this.props.history.push('/user/login')
            })
            .catch((err)=>{
                console.log(err)
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
        return(
            <div>
                <form onSubmit={this.handleSubmit}>

                    <h1>Register</h1>

                    <label htmlFor='name'>Name </label>
                    <input type='text' id='name' name='name' placeholder='Name' onChange={this.handleClick}/>

                    <label htmlFor='email'>Email </label>
                    <input type='text' id='email' name='email' placeholder='Email' onChange={this.handleClick}/>

                    <label htmlFor='password'>Password </label>
                    <input type='password' id='password' name='password' placeholder='Password' onChange={this.handleClick}/>

                    <button type='submit'>Register</button>
                </form>
                <button name='resendEmail' onClick={this.handleClick}>Resend Email</button>
            </div>
        )
    }
}

export default Register