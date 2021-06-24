import React from 'react'
import axios from '../../config/axios'

/* forgot password request handler */

class Forgot extends React.Component{
    constructor(props){
        super(props)
        this.state={
            email:'',
            success:false,
            message:''
        }
        this.handleClick=this.handleClick.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
    }

    handleClick(e){
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleSubmit(e){
        e.preventDefault()
        axios.post('/user/forgotPassword',{
            email:this.state.email
        },{
            timeout:5000
        })
        .then((response)=>{
            console.log(response.data)
            this.setState((p)=>{return{...p,success:response.data.status,message:response.data.message}})
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    redirect(){
        setTimeout((props)=>{
            props.history.replace('/user/login')
        },5000,this.props)
    }

    render(){
        if(!this.state.success){
            return(
                <div>
                    <form onSubmit={this.handleSubmit} >
    
                        <label htmlFor='email'>Email</label>
                        <input type='text' name='email' id='email' placeholder='Email' onChange={this.handleClick}/>
    
                        <button type='submit'>Submit</button>
                    </form>
                </div>
            )
        }
        else{
            return(
                <div>
                    <h3>{this.state.message}</h3>
                    {
                        this.redirect()
                    }
                </div>
            )
        }
    }
}

export default Forgot