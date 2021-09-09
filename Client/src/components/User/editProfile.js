import React,{Fragment, useEffect, useState} from 'react'
import Button from '@material-ui/core/Button'
import axios from '../../config/axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import { setProfile } from '../../action/profileAction'
import { useDispatch } from 'react-redux'

export default function EditProfile (props){    //Pending - password to access the page
    const [profile,setProfileState] = useState()
    const [loading,setLoading] = useState(true)
    const dispatch = useDispatch()

    useEffect(()=>{
        const token = localStorage.getItem('x-auth')
        axios.get('/user/profile',
        {
            headers:{
                'x-auth':token
            }
        })
            .then((response)=>{
                console.log(response.data)
                setProfileState(response.data)
                dispatch(setProfile(response.data))
                setLoading(false)
            })
            .catch((err)=>{
                console.log(err)
                setLoading(false)
            })
    },[setProfileState,dispatch,setLoading])

    if(loading){
        return (
            <div>
                <CircularProgress />
            </div>
        )
    }
    else{
        if(profile){
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
            return (
                <div>
                    Error fetching profile
                </div>
            )
        }
    }
}