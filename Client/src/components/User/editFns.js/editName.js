import React from 'react'
import {useSelector} from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function EditName (props){
    const profile = useSelector((state)=>state.profile)
    console.log(profile)

    if(!profile.email){
        props.history.replace('/user/editProfile')
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