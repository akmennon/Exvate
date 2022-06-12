import React,{useState} from 'react'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

/* Displays the confirmation of the order */

export default function OrderConfirm(){
    const [call,setCall] = useState('')
    const navigate = useNavigate()

    const handleClick = () =>{
        navigate('/')
    }

    return (
        <div>
            <h4>Your order has been confirmed. A representative will get in touch with you shortly.</h4>
            <Button onClick={handleClick}>Continue shopping</Button>
        </div>
    )
}