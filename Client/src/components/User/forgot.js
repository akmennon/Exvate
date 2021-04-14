import React from 'react'
import axios from '../../config/axios'

/* forgot password request handler */

class Forgot extends React.Component{
    constructor(props){
        super(props)
        this.state={
            email:''
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
        })
        .then((response)=>{
            console.log(response.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    render(){
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
}

export default Forgot