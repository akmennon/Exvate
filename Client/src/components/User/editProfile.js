import React,{Fragment, useState} from 'react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
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
                    {
                        profile.mobile?(
                            <Fragment>
                                <p>Mobile : {profile.mobile}</p>
                                <Button variant='contained' onClick={()=>props.history.push(`/user/editFns/mobile`)}>Edit</Button>
                            </Fragment>
                        ):
                        (
                            <Fragment>
                                <p>Mobile </p>
                                <Button variant='contained' onClick={props.history.push('/user/addMobile')}>Add</Button>
                            </Fragment>
                        )
                    }
                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                    <p>Password</p>
                    <Button variant='contained' onClick={()=>props.history.push(`/user/editFns/password`)}>Edit</Button>
                </div>
                <div>
                    {
                        profile.companyDetails?(
                            <div>
                                <p>Company details</p>
                                <Button variant='contained' onClick={()=>props.history.push(`/user/editFns/companyDetails`)}>Edit</Button>
                            </div>
                        ):(
                            <div>
                                <p>Company details</p>
                                <Button variant='contained' onClick={()=>{props.history.push('/user/addCompanyDetails')}}>Add</Button>
                            </div>
                        )
                    }
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