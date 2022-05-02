import React,{useEffect, useState} from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import { useDispatch, useSelector } from 'react-redux'
import axios from '../../config/axios'
import { setProfile } from '../../action/profileAction'

export default function ProfilePassword (props){
    const profile = useSelector((state)=>state.profile)
    const dispatch = useDispatch()
    const [password,setPassword] = useState('')
    const [loading,setLoading] = useState(false)

    const handleSubmit = () =>{
        setLoading(true)
        const token = localStorage.getItem('x-auth')
        const user = localStorage.getItem('user')
        axios.post('/user/profile',{password},
        {
            headers:{
                'x-auth':token,
                'userId':user
            }
        })
            .then((response)=>{
                console.log(response.data)
                dispatch(setProfile(response.data))
                setLoading(false)
            })
            .catch((err)=>{
                console.log(err)
                setLoading(false)
            })
    }

    useEffect(()=>{
        if(profile&&profile.email&&(new Date(profile.profileChangeToken.createdAt).getTime()+1800000) > Date.now()){
            props.history.push('/user/editProfile')
        }
        console.log(profile)
    },[props,profile])

    if(profile&&profile.email&&(new Date(profile.profileChangeToken.createdAt).getTime()+1800000) > Date.now()){
        return <CircularProgress />
    }
    else{
        if(loading){
            return <CircularProgress />
        }
        else{
            return (
                <div style={{display:'flex',flexDirection:'column',rowGap:10,width:'15%',margin:10}}>
                    <TextField 
                        variant='outlined'
                        color='primary'
                        label='password'
                        type='password'
                        value={password}
                        onChange={(e)=>{e.persist();setPassword(e.target.value)}}
                    />
                    <Button variant='contained' color='primary' onClick={handleSubmit}>Confirm</Button>
                </div>
            )
        }
    }
}