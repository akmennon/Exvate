import React from 'react'
import axios from '../../config/axios'

/* component to resend the confirmation email of the user */

class resendEmail extends React.Component{
    constructor(props){
        super(props)
        this.state={
            email:''
        }
        this.handleChange=this.handleChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
    }

    handleChange(e){
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleSubmit(e){
        e.preventDefault()
        const reqData = {
            email:this.state.email
        }
        console.log(reqData)
        
        axios.post('/user/resendRegisterMail',reqData)
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
                <form onSubmit={this.handleSubmit}>

                    <label htmlFor='email'>Email </label>
                    <input type='text' name='email' id='email' onChange={this.handleChange}/>

                    <button type='submit'>submit</button>
                </form>
            </div>
        )
    }
}

export default resendEmail