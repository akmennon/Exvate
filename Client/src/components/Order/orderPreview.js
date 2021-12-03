import React from 'react'
import Button from '@mui/material/Button'
import {connect} from 'react-redux'

/* shows the preview of the order from the backend response */

class OrderPreview extends React.Component{
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(){//Orders with the given params
        this.props.history.push(`/orderAddress/${this.props.match.params.id}`)
    }

    render(){
        console.log(this.props.user)
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
        order:state.order.newOrder,
        work:state.work,
        user:state.user
    }
}

export default connect(mapStateToProps)(OrderPreview)