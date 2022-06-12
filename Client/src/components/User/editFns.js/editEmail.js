import React from 'react'
import {useSelector} from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'
import { useNavigate } from 'react-router-dom'

export default function EditEmail (props){
    const navigate = useNavigate()

    const profile = useSelector((state)=>state.profile)
    console.log(profile)

    if(!profile.email){
        navigate('/user/editProfilePassword',{replace:true})
        return <CircularProgress/>
    }
    else{
        return(
            <div>
                Edit
            </div>
        )
    }
}