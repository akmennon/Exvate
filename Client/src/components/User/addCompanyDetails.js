import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'

export default function CompanyDetails (props){
    const [companyDetails,setCompanyDetails] = useState({})
    
    const handleChange = (e) =>{
        e.persist()
        setCompanyDetails((prev)=>{
            prev[e.target.name] = e.target.value
        })
    }

    return (
        <div>
            <TextField
                variant='outlined'
                label='name'
                onChange={handleChange}
            />
        </div>
    )
}