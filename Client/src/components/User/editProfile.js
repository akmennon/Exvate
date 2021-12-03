import React,{useState} from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useSelector } from 'react-redux'

export default function EditProfile (props){
    const [loading,setLoading] = useState(true)
    const profile = useSelector((state)=>state.profile)

    if(profile&&profile.email){
        return (
            <div>
                <div style={{display:'flex',flexDirection:'row'}}>
                    <p>Name : {profile.name}</p>
                    <Button variant='contained' onClick={()=>props.history.push(`/user/editFns/name`)}>Edit</Button>
                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                    <p>Email : {profile.email.email}</p>
                    <Button variant='contained' onClick={()=>props.history.push(`/user/editFns/email`)}>Edit</Button>
                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                    <p>Mobile : {profile.mobile}</p>
                    <Button variant='contained' onClick={()=>props.history.push(`/user/editFns/mobile`)}>Edit</Button>
                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                    <p>Password</p>
                    <Button variant='contained' onClick={()=>props.history.push(`/user/editFns/password`)}>Edit</Button>
                </div>
                <div>
                    <p>Company details</p>
                    <Button variant='contained' onClick={()=>props.history.push(`/user/editFns/companyDetails`)}>Edit</Button>
                </div>
            </div>
        )
    }
    else{
        if(loading){
            setTimeout(()=>{
                if(profile){
                    setLoading(false)
                }
            },4000)
            return (
                <div>
                    <CircularProgress />
                </div>
            )
        }
        else{
            setTimeout(()=>{
                props.history.replace('/')
            },4000)
            return (
                <div>
                    Error fetching profile. You'll be redirected
                </div>
            )
        }
    }
}