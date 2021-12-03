import React from 'react'
import Button from '@mui/material/Button'

/* Displays the confirmation of the order */

export default class OrderConfirm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            call:''
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(){
        this.props.history.push('/')
    }

    render(){
        return (
            <div>
                <h4>Your order has been confirmed. A representative will get in touch with you shortly.</h4>
                <Button onClick={this.handleClick}>Continue shopping</Button>
            </div>
        )
    }
}