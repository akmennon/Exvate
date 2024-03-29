import React,{useState} from 'react'
import { useSelector } from 'react-redux'
import axios from '../../config/axios'
import Button from '@mui/material/Button'
import makeStyles from '@mui/styles/makeStyles'
import CircularProgress from '@mui/material/CircularProgress'
import { useNavigate, useParams } from 'react-router-dom'

const useStyles = makeStyles({
    list:{
        'background-color':'grey'
    }
})

const handleClick = (order,work,props,selectedAddress,userId,navigate,params) => {//Orders with the given params
    const token = localStorage.getItem('x-auth')
    const user = localStorage.getItem('user')
    let data = {
        orderData:{...order,address:selectedAddress},
        resultId:work.result._id
    }

    console.log(data)
    axios.post(`/order/${params.id}`,data,
    {
        headers:{
            'x-auth':token,
            'userId':user
        }
    })
    .then((response)=>{
        console.log(response.data)
        navigate('/orderConfirm')
    })
    .catch((err)=>{
        console.log(err)
    })
}

export default function OrderAddress (props){

    const [selectedAddress,setSelectedAddress] = useState()
    const [error,setError] = useState(false)
    const order = useSelector((state)=>state.order.newOrder)
    const work = useSelector((state)=>state.work)
    const user = useSelector((state)=>state.user)
    const userId = useSelector((state)=>state.user._id)
    const classes = useStyles()
    const navigate = useNavigate()
    const params = useParams()
    
    if(user.address&&user.address.length>0){
        return (
            <div>
                <div style={{display:'flex',flexDirection:'row',columnGap:20}}>
                    <div>
                        <h3> Shipping address </h3>
                        {
                            user.address.map((addressItem)=>{
                                return (
                                    <div onClick={()=>{setError(false);setSelectedAddress(addressItem._id)}} className={selectedAddress===addressItem._id?classes.list:''} key={addressItem._id}> {/* Change background color */}
                                        <div>{addressItem.building + ', ' + addressItem.street + ', ' + addressItem.city + ', ' + addressItem.pin}</div>
                                        <div>{addressItem.state}</div>
                                        <div>{addressItem.country}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                {
                    error?<p>Please select a shipping address</p>:<p/>
                }
                <div style={{display:'flex',flexDirection:'row'}}>
                    <Button variant='contained' color='primary' onClick={()=>{navigate('/user/addAddress')}}>Add address</Button>
                    <Button variant='contained' color='primary' onClick={()=>{
                        if(!selectedAddress){
                            setError(true)
                        }
                        else{
                            handleClick(order,work,props,selectedAddress,userId,navigate,params)
                        }
                    }}>Confirm</Button>
                </div>
            </div>
        )
    }
    else{
        navigate('/user/addAddress',{replace:true})
        return(
            <div>
                <CircularProgress />
            </div>
        )
    }
}