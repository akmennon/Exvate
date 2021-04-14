import React from 'react'
import { Button } from '@material-ui/core'
import axios from '../../config/axios'
import {connect} from 'react-redux'

/* shows the preview of the order from the backend response */

class OrderPreview extends React.Component{
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(){//Orders with the given params
        const token = localStorage.getItem('x-auth')
        const data = {
            orderData:this.props.order,
            resultId:this.props.work.result._id
        }
        axios.post(`/order`,data,
        {
            headers:{
                'x-auth':token
            }
        })
        .then((response)=>{
            console.log(response.data)
            //close socket here
            this.props.history.push('/orderConfirm')
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    render(){
        if(this.props.order===undefined){
            this.props.history.replace(`/work/${this.props.match.params.id}`)
        }
        else{
            console.log(this.props.order)
            return(
                <div>
                    {
                        this.props.work?<h1>{this.props.work.title}</h1>:<span/>
                    }
                    <Button onClick={this.handleClick}>Confirm</Button>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) =>{
    return {
        order:state.order,
        work:state.work
    }
}

export default connect(mapStateToProps)(OrderPreview)