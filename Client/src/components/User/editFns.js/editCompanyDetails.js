import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import axios from '../../../config/axios'
import pick from 'lodash/pick'
import { changeProfileValue } from '../../../action/profileAction'

export default function EditCompanyDetails (props){
    const profile = useSelector((state)=>state.profile)
    const [status,setStatus] = useState('none')
    const [companyDetails,setCompanyDetails] = useState({
        name:'',
        position:'',
        website:'',
        officeAddress:{
            street:'',
            city:'',
            state:'',
            country:'',
            pin:''
        }
    })
    const dispatch = useDispatch()

    useEffect(()=>{

        if(profile.companyDetails){
            const defaultValue = {
                name:'',
                position:'',
                website:'',
                officeAddress:{
                    street:'',
                    city:'',
                    state:'',
                    country:'',
                    pin:''
                }
            }
            let companyDetailsOnly = pick(profile.companyDetails,['name','phone','website','position','officeAddress'])
            companyDetailsOnly = {...defaultValue,...companyDetailsOnly}
            console.log(companyDetailsOnly)
            setCompanyDetails(companyDetailsOnly)
        }

    },[profile.companyDetails])

    const handleSubmit = () =>{
        console.log(companyDetails)
        const token = localStorage.getItem('x-auth')
        axios.post('/user/editProfile/changeCompanyDetails',{payload:companyDetails,profileToken:profile.profileChangeToken.value},{
            headers:{
                'x-auth': token
            }
        })
        .then((response)=>{
            console.log(response)
            dispatch(changeProfileValue({companyDetails}))
            setStatus('success')
        })
        .catch((err)=>{
            setStatus('error')
            props.history.replace('/user/editProfilePassword')
            console.log(err.response)
        })
    }

    if(!profile||!profile.companyDetails){
        setTimeout(()=>{
            if(!profile||!profile.companyDetails){
                props.history.replace('/user/editProfilePassword')
            }
        },5000)
        return <CircularProgress/>
    }
    else{
        if(status==='success'){
            setTimeout(()=>{
                props.history.replace('/user/editProfile')
            },3000)
            return (
                <p>Successfully changed company details. You'll be redirected</p>
            )
        }
        else if(status==='loading'){
            setTimeout(()=>{
                if(status==='loading'){
                    setStatus('error')
                }
            },7000)
            return <CircularProgress/>
        }
        else {
            return(
                <div style={{display:'flex',flexDirection:'column'}}>
                    <div style={{display:'flex',flexDirection:'row'}}>
                        <div style={{display:'flex',flexDirection:'column',rowGap:10}}>
                            <p>Details</p>
                            <TextField
                                variant='outlined'
                                color='primary'
                                value={companyDetails.name}
                                label='name'
                                onChange={(e)=>{e.persist();status==='error'?setStatus('none'):<span/>;setCompanyDetails({...companyDetails,name:e.target.value})}}
                            />
                            <TextField
                                variant='outlined'
                                color='primary'
                                value={companyDetails.position}
                                label='position'
                                onChange={(e)=>{e.persist();status==='error'?setStatus('none'):<span/>;setCompanyDetails({...companyDetails,position:e.target.value})}}
                            />
                            <TextField
                                variant='outlined'
                                color='primary'
                                value={companyDetails.website}
                                label='website'
                                onChange={(e)=>{e.persist();status==='error'?setStatus('none'):<span/>;setCompanyDetails({...companyDetails,website:e.target.value})}}
                            />
                        </div>
                        <div style={{display:'flex',flexDirection:'column',rowGap:10}}>
                            <p>Company Address</p>
                            <TextField
                                variant='outlined'
                                color='primary'
                                value={companyDetails.officeAddress.street}
                                label='street'
                                onChange={(e)=>{e.persist();status==='error'?setStatus('none'):<span/>;setCompanyDetails({...companyDetails,officeAddress:{...companyDetails.officeAddress,street:e.target.value}})}}
                            />
                            <TextField
                                variant='outlined'
                                color='primary'
                                value={companyDetails.officeAddress.city}
                                label='city'
                                onChange={(e)=>{e.persist();status==='error'?setStatus('none'):<span/>;setCompanyDetails({...companyDetails,officeAddress:{...companyDetails.officeAddress,city:e.target.value}})}}
                            />
                            <TextField
                                variant='outlined'
                                color='primary'
                                value={companyDetails.officeAddress.state}
                                label='state'
                                onChange={(e)=>{e.persist();status==='error'?setStatus('none'):<span/>;setCompanyDetails({...companyDetails,officeAddress:{...companyDetails.officeAddress,state:e.target.value}})}}
                            />
                            <TextField
                                variant='outlined'
                                color='primary'
                                value={companyDetails.officeAddress.country}
                                label='country'
                                onChange={(e)=>{e.persist();status==='error'?setStatus('none'):<span/>;setCompanyDetails({...companyDetails,officeAddress:{...companyDetails.officeAddress,country:e.target.value}})}}
                            />
                            <TextField
                                variant='outlined'
                                color='primary'
                                value={companyDetails.officeAddress.pin}
                                label='pin or zip'
                                onChange={(e)=>{e.persist();status==='error'?setStatus('none'):<span/>;setCompanyDetails({...companyDetails,officeAddress:{...companyDetails.officeAddress,pin:e.target.value}})}}
                            />
                        </div>
                    </div>
                    {
                        status==='error'?<p>Error updating company details</p>:<span/>
                    }
                    <Button variant='contained' onClick={handleSubmit} color='primary'>Confirm</Button>
                </div>
            )
        }
    }
}