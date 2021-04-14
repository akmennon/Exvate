import React from 'react' 
import axios from '../../config/axios'

/* Component that confirms the email of the user */

class confirmSign extends React.Component{
    constructor(props){
        super(props)
        this.state={
            call:''
        }
    }

    componentDidMount(){
        axios.get(`/user/confirmSign/${this.props.match.params.token}`)
            .then((response)=>{
                console.log(response)
                if(response.data.value){
                    this.setState({call:true})
                    setTimeout(()=>{
                        this.props.history.push('/user/login')
                    },3000)
                }
                else{
                    this.setState({call:false})
                }
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    render(){
        return(
            <div>
                {
                    this.state.call===false?<p>page not found</p>:<p>Your Email has been confirmed. You'll be redirected shortly.</p>
                }
            </div>
        )
    }
}

export default confirmSign
