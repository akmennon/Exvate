import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from '../../../config/axios'

export default function EditPassword (props){
    const profile = useSelector((state)=>state.profile)
    const [state,setState] = useState('failed')
    const [passwordDetails,setPasswordDetails] = useState({})

    const handleChange = (e) =>{
        e.persist()
        setPasswordDetails((prev)=>{
            prev[e.target.name] = e.target.value
            console.log(prev)
            return prev
        })
    }

    const handleSubmit = () =>{
        const token = localStorage.getItem('x-auth')
        console.log(passwordDetails)
        axios.post('/user/editProfile/changePassword',{payload:passwordDetails,profileToken:profile.profileChangeToken.value},{
            headers:{
                'x-auth':token
            }
        })
        .then((response)=>{
            console.log(response.data)
            setState('success')
        })
        .catch((err)=>{
            props.history.replace('/user/editProfilePassword')
            setState('failed')
        })
    }

    if(!profile.email){
        props.history.replace('/user/editProfilePassword')
        return <CircularProgress/>
    }
    else{
        if(state==='loading'){
            return <CircularProgress/>
        }
        else if(state==='success'){
            return <div>
                <Typography variant='h6'>Password successfully changed</Typography>
                {
                    (
                        (props)=>{
                            setTimeout((props)=>{
                                props.history.replace('/user/editProfile')
                            },3000,props)
                        }
                    )(props)
                }
            </div>
        }
        else{
            return(
                <div style={{display:'flex',flexDirection:'column',rowGap:20}}>
                    <Typography variant='h5'>Password Details</Typography>
                    <TextField 
                        variant='outlined'
                        label='Old Password'
                        color='primary'
                        name='oldPassword'
                        type='password'
                        value={passwordDetails.oldPassword}
                        onChange={handleChange}
                    />
                    <TextField 
                        variant='outlined'
                        label='New Password'
                        color='primary'
                        name='newPassword'
                        type='password'
                        value={passwordDetails.newPassword}
                        onChange={handleChange}
                    />
                    <TextField 
                        variant='outlined'
                        label='Confirm Password'
                        color='primary'
                        name='confirmPassword'
                        type='password'
                        value={passwordDetails.confirmPassword}
                        onChange={handleChange}
                    />
                    <Button variant='contained' style={{width:100}}color='primary' onClick={handleSubmit}>Confirm</Button>
                </div>
            )
        }
    }
}