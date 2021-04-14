import React from 'react' 
import axios from "../../config/axios"

import {connect} from 'react-redux'

/* To change the password when forgotten, redirected from email */

class ConfirmForgot extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            password:'',
            confirmPassword:''
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(e){
        e.preventDefault()

        //sends the password to the server to update
        if(this.state.password===this.state.confirmPassword){
            axios.post(`/user/confirmForgot/${this.props.match.params.token}`,{
                password:this.state.password
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
        axios.get('/user/forgotCheck',{
            headers:{
                forgotToken
            }
        })
        .then((response)=>{
            console.log(response)
            if(response.data.value){
                return null
            }
            else{
                this.props.history.push('/user/login')
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    render(){
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
}

export default connect()(ConfirmForgot)