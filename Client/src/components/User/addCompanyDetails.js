import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import axios from '../../config/axios'
import Button from '@material-ui/core/Button'
import { Typography } from '@material-ui/core'

const handleSumbit = (companyDetails,props) =>{
    const token = localStorage.getItem('x-auth')
    axios.post('/user/companyDetails',companyDetails,{
        headers:{
            'x-auth':token
        }
    })
    .then((response)=>{
        props.history.goBack()
    })
    .catch((err)=>{
        console.log(err)
    })
}

export default function CompanyDetails (props){
    const [companyDetails,setCompanyDetails] = useState({officeAddress:{}})
    
    const handleChange = (e) =>{
        e.persist()
        setCompanyDetails((prev)=>{
            prev[e.target.name] = e.target.value
            return prev
        })
    }

    const handleAddressChange = (ev) =>{
        ev.persist()
        setCompanyDetails((prev)=>{
            prev.officeAddress[ev.target.name] = ev.target.value
            return prev
        })
    }

    return (
        <div>
            <div style={{display:'flex',flexDirection:'row',columnGap:20}}>
                <div style={{display:'flex',flexDirection:'column',rowGap:20}}>
                    <Typography variant='h5'>Company Details</Typography>
                    <TextField
                        variant='outlined'
                        label='Company Name'
                        name='name'
                        value={companyDetails.name}
                        onChange={handleChange}
                    />
                    <TextField
                        variant='outlined'
                        label='Your Position'
                        name='position'
                        value={companyDetails.position}
                        onChange={handleChange}
                    />
                    <TextField
                        variant='outlined'
                        label='Phone'
                        name='phone'
                        value={companyDetails.phone}
                        onChange={handleChange}
                    />
                    <TextField
                        variant='outlined'
                        label='Website'
                        name='website'
                        value={companyDetails.website}
                        onChange={handleChange}
                    />
                    <TextField
                        variant='outlined'
                        label='Tax Id'
                        name='taxId'
                        value={companyDetails.taxId}
                        onChange={handleChange}
                    />
                </div>
                <div style={{display:'flex',flexDirection:'column',rowGap:20}}>
                    <Typography variant='h5'>Company Address</Typography>
                    <TextField variant='outlined' label='Building' name='building' value={companyDetails.officeAddress.building} onChange={handleAddressChange}/>
                    <TextField variant='outlined' label='Street' name='street' value={companyDetails.officeAddress.street} onChange={handleAddressChange}/>
                    <TextField variant='outlined' label='City' name='city' value={companyDetails.officeAddress.city} onChange={handleAddressChange}/>
                    <TextField variant='outlined' label='State' name='state' value={companyDetails.officeAddress.state} onChange={handleAddressChange}/>
                    <TextField variant='outlined' label='Country' name='country' value={companyDetails.officeAddress.country} onChange={handleAddressChange}/>
                    <TextField variant='outlined' label='Pin' name='pin' value={companyDetails.officeAddress.pin} onChange={handleAddressChange}/>
                </div>
            </div>
            <Button style={{width:100}} color='primary' variant="contained" onClick={()=>{handleSumbit(companyDetails,props)}}>Confirm</Button>
        </div>
    )
}