import React, { useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import axios from '../../../config/axios'
import { changeProfileValue } from '../../../action/profileAction'

export default function EditCompanyDetails (props){
    const profile = useSelector((state)=>state.profile)
    const [name,setName] = useState('')
    const dispatch = useDispatch()
    console.log(profile)

    const handleChange = (ev) =>{
        ev.persist()
        setName((prev)=>{
            return ev.target.value
        })
    }

    const handleSubmit = (e) =>{
        const token = localStorage.getItem('x-auth')
        axios.post('/user/editProfile/changeName',{payload:{name},profileToken:profile.profileChangeToken.value},{
            headers:{
                'x-auth':token
            }
        })
        .then((response)=>{
            if(response.data.status){
                dispatch(changeProfileValue({name:name}))
                props.history.push('/user/editProfile')
            }
        })
        .catch((err)=>{
            props.history.replace('/user/editProfilePassword')
            console.log(err)
        })
    }

    if(!profile.email){
        props.history.replace('/user/editProfilePassword')
        return <CircularProgress/>
    }
    else{
        return(
            <div style={{display:'flex',flexDirection:'column',margin:20,rowGap:10}}>
                <TextField 
                    variant='outlined'
                    color='primary'
                    onChange={handleChange}
                    value={name}
                    label='Name'
                />
                <Button variant='contained' color='primary' onClick={handleSubmit} >Confirm</Button>
            </div>
        )
    }
}