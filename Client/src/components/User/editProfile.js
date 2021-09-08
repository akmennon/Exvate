import React,{useEffect, useState} from 'react'
import Button from '@material-ui/core/Button'
import axios from '../../config/axios'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function EditProfile (props){
    const [companyDetails,setCompanyDetails] = useState()
    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        const token = localStorage.getItem('x-auth')
        axios.get('/user/companydetails',
        {
            headers:{
                'x-auth':token
            }
        })
            .then((response)=>{
                setCompanyDetails(response.data)
                setLoading(false)
            })
            .catch((err)=>{
                console.log(err)
                setLoading(false)
            })
    },[])

    if(companyDetails){
        return (
            <div>
                <div style={{display:'flex',flexDirection:'row'}}>
                    <p>Name</p>
                    <Button variant='contained'>Edit</Button>
                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                    <p>Email</p>
                    <Button variant='contained'>Edit</Button>
                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                    <p>Mobile</p>
                    <Button variant='contained'>Edit</Button>
                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                    <p>Password</p>
                    <Button variant='contained'>Edit</Button>
                </div>
                <div>
                    <div>
                        <p>Company details</p>
                        <Button variant='contained'>Edit</Button>
                    </div>
                </div>
            </div>
        )
    }
    else{
        if(loading){
            return (
                <div>
                    <CircularProgress />
                </div>
            )
        }
        else{
            return (
                <div>
                    <div style={{display:'flex',flexDirection:'row'}}>
                        <p>Name</p>
                        <Button variant='contained'>Edit</Button>
                    </div>
                    <div style={{display:'flex',flexDirection:'row'}}>
                        <p>Email</p>
                        <Button variant='contained'>Edit</Button>
                    </div>
                    <div style={{display:'flex',flexDirection:'row'}}>
                        <p>Mobile</p>
                        <Button variant='contained'>Edit</Button>
                    </div>
                    <div style={{display:'flex',flexDirection:'row'}}>
                        <p>Password</p>
                        <Button variant='contained'>Edit</Button>
                    </div>
                    <div>
                            <p>Company details</p>
                            <Button variant='contained' onClick={()=>{props.history.push('/user/addCompanyDetails')}}>Add</Button>
                    </div>
                </div>
            )
        }
    }
}