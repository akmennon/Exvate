import React from 'react' 
import axios from "../../config/axios"

import {connect} from 'react-redux'

/* To change the password when forgotten, redirected from email */

class ConfirmForgot extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            password:'',
            confirmPassword:'',
            verified:false,
            data:true
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(e){
        e.preventDefault()

        //sends the password to the server to update
        if(this.state.password===this.state.confirmPassword){
            axios.post(`/user/confirmForgot/${this.props.match.params.token}`,{
                password:this.state.password,
                confirmPassword:this.state.confirmPassword
            })
            .then((response)=>{
                if(response.data.hasOwnProperty('errors')){
                    console.log(response.data.errors)
                }
                else{
                    console.log(response.data)
                    this.props.history.push('/user/login')
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

    handleClick(e){
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    componentDidMount(){

        //checks if the token provided is valid and redirects if its not
        const forgotToken = this.props.match.params.token
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
                    this.setState((p)=>{
                        return {...p,data:response.data.value,verified:true}
                    })
                }
                else{
                    this.props.history.replace('/user/login')
                }
            })
            .catch((err)=>{
                this.setState((p)=>{
                    return {...p,data:false,verified:true}
                })
                console.log(err)
            })
        }
        else{
            this.setState(p=>{return {...p,verified:false}})
        }
    }

    render(){
        if(this.state.verified){
            if(this.state.data){
                return(
                    <div>
                        <form onSubmit={this.handleSubmit}>
                        
                            <label htmlFor='password'>Password</label>
                            <input type='password' onChange={this.handleClick} id='password' name='password'/>
        
                            <label htmlFor='confirmPassword'>Confirm Password</label>
                            <input type='password' onChange={this.handleClick} id='confirmPassword' name='confirmPassword'/>
        
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
                                props.history.replace('/user/login')
                            },3000,this.props)
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
}

export default connect()(ConfirmForgot)