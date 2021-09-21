import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import axios from '../../../config/axios'
import pick from 'lodash/pick'

export default function EditCompanyDetails (props){
    const profile = useSelector((state)=>state.profile)
    const [status,setStatus] = useState('none')
    const [companyDetails,setCompanyDetails] = useState({
        name:'',
        position:'',
        phone:'',
        website:'',
        taxId:'',
        officeAddress:{
            name:'',
            building:'',
            street:'',
            city:'',
            state:'',
            country:'',
            pin:''
        }
    })

    useEffect(()=>{

        if(profile.companyDetails){
            const defaultValue = {
                name:'',
                position:'',
                phone:'',
                website:'',
                taxId:'',
                officeAddress:{
                    name:'',
                    building:'',
                    street:'',
                    city:'',
                    state:'',
                    country:'',
                    pin:''
                }
            }
            let companyDetailsOnly = pick(profile.companyDetails,['name','phone','website','position','taxId','officeAddress'])
            companyDetailsOnly = {...defaultValue,...companyDetailsOnly}
            console.log(companyDetailsOnly)
            setCompanyDetails(companyDetailsOnly)
        }

    },[profile.companyDetails])

    const handleSubmit = () =>{
        console.log(companyDetails)
        const token = localStorage.getItem('x-auth')
        axios.post('/user/editProfile/changeCompanyDetails',companyDetails,{
            headers:{
                'x-auth': token
            }
        })
        .then((response)=>{
            console.log(response)
            setStatus('success')
        })
        .catch((err)=>{
            setStatus('error')
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
                                value={companyDetails.phone}
                                label='phone'
                                onChange={(e)=>{e.persist();status==='error'?setStatus('none'):<span/>;setCompanyDetails({...companyDetails,phone:e.target.value})}}
                            />
                            <TextField
                                variant='outlined'
                                color='primary'
                                value={companyDetails.website}
                                label='website'
                                onChange={(e)=>{e.persist();status==='error'?setStatus('none'):<span/>;setCompanyDetails({...companyDetails,website:e.target.value})}}
                            />
                            <TextField
                                variant='outlined'
                                color='primary'
                                value={companyDetails.taxId}
                                label='taxId'
                                onChange={(e)=>{e.persist();status==='error'?setStatus('none'):<span/>;setCompanyDetails({...companyDetails,taxId:e.target.value})}}
                            />
                        </div>
                        <div style={{display:'flex',flexDirection:'column',rowGap:10}}>
                            <p>Company Address</p>
                            <TextField
                                variant='outlined'
                                color='primary'
                                value={companyDetails.officeAddress.name}
                                label='name'
                                onChange={(e)=>{e.persist();status==='error'?setStatus('none'):<span/>;setCompanyDetails({...companyDetails,officeAddress:{...companyDetails.officeAddress,name:e.target.value}})}}
                            />
                            <TextField
                                variant='outlined'
                                color='primary'
                                value={companyDetails.officeAddress.building}
                                label='building'
                                onChange={(e)=>{e.persist();status==='error'?setStatus('none'):<span/>;setCompanyDetails({...companyDetails,officeAddress:{...companyDetails.officeAddress,building:e.target.value}})}}
                            />
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