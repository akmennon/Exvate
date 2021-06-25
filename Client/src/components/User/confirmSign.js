import React from 'react' 
import axios from '../../config/axios'

/* Component that confirms the email of the user */

class confirmSign extends React.Component{
    constructor(props){
        super(props)
        this.state={
            call:'',
            loading:true,
            data:{}
        }
    }

    componentDidMount(){
        axios.get(`/user/confirmSign/${this.props.match.params.token}`)
            .then((response)=>{
                console.log(response)
                if(response.data.status){
                    this.setState({call:true,loading:false,data:response.data})
                    setTimeout(()=>{
                        this.props.history.push('/user/login')
                    },3000)
                }
                else{
                    this.setState({call:false,loading:false,data:response.data})
                }
            })
            .catch((err)=>{
                console.log(err)
                this.setState({call:false,loading:false})
            })
        setTimeout(()=>{
            if(this.state.loading){
                this.setState({loading:false})
            }
        },8000)
    }

    render(){
        if(!this.state.loading){
            if(this.state.call){
                return(
                    <div>
                        <p>Your Email has been confirmed. You'll be redirected shortly</p>
                    </div>
                )
            }
            else{
                return(
                    <div>
                        <p>{this.state.data.message||'Error confirming email'}</p>
                    </div>
                )
            }
        }
        else{
            return(
                <div>
                        <p>Loading</p>
                </div>
            )
        }
    }
}

export default confirmSign
