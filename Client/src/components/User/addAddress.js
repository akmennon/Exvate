import React, { useState } from 'react'
import Textfield from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { useDispatch, useSelector } from 'react-redux'
import {startAddAddress} from '../../action/userAction'

const handleChange = (ev,setInputState) =>{
    setInputState((p)=>{
        p[ev.target.name] = ev.target.value
        return {
            ...p
        }
    })
}

const handleClick = (address,props,dispatch,order) =>{
    const redirect = order&&order.result? () =>{
        props.history.goBack()
    }:
    () =>{
        props.history.replace(`/user/address`)
    }
    dispatch(startAddAddress(address,redirect))
}

export default function AddAddress (props) {
    const [inputState,setInputState] = useState({
        name:'',
        building:'',
        street:'',
        city:'',
        state:'',
        country:'',
        pin:''
    })
    const dispatch = useDispatch()
    const order = useSelector((state)=>state.order.newOrder)

    return(
        <div>
            <h1>Add address</h1>
            <div style={{display:'flex',flexDirection:'column',width:300,rowGap:30}}>
                <Textfield variant='outlined' label='Name' name='name' value={inputState.name} onChange={(e)=>{e.persist();handleChange(e,setInputState)}}/>
                <Textfield variant='outlined' label='Building' name='building' value={inputState.building} onChange={(e)=>{e.persist();handleChange(e,setInputState)}}/>
                <Textfield variant='outlined' label='Street' name='street' value={inputState.street} onChange={(e)=>{e.persist();handleChange(e,setInputState)}}/>
                <Textfield variant='outlined' label='City' name='city' value={inputState.city} onChange={(e)=>{e.persist();handleChange(e,setInputState)}}/>
                <Textfield variant='outlined' label='State' name='state' value={inputState.state} onChange={(e)=>{e.persist();handleChange(e,setInputState)}}/>
                <Textfield variant='outlined' label='Country' name='country' value={inputState.country} onChange={(e)=>{e.persist();handleChange(e,setInputState)}}/>
                <Textfield variant='outlined' label='Pin' name='pin' value={inputState.pin} onChange={(e)=>{e.persist();handleChange(e,setInputState)}}/>
                <Button style={{width:100}} color='primary' variant="contained" onClick={()=>{handleClick(inputState,props,dispatch,order)}}>Confirm</Button>
            </div>
        </div>
    )
}