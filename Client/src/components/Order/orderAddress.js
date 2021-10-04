import React,{useState} from 'react'
import { useSelector } from 'react-redux'
import axios from '../../config/axios'
import Button from '@material-ui/core/Button'
import makeStyles from '@material-ui/core/styles/makeStyles'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles({
    list:{
        'background-color':'grey'
    }
})

const handleClick = (order,work,props,selectedAddress) => {//Orders with the given params
    const token = localStorage.getItem('x-auth')
    let data = {
        orderData:{...order,address:selectedAddress},
        resultId:work.result._id
    }

    console.log(data)
    axios.post(`/order/${props.match.params.id}`,data,
    {
        headers:{
            'x-auth':token
        }
    })
    .then((response)=>{
        console.log(response.data)
        props.history.push('/orderConfirm')
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
    const classes = useStyles()
    
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
                    <Button variant='contained' color='primary' onClick={()=>{props.history.push('/user/addAddress')}}>Add address</Button>
                    <Button variant='contained' color='primary' onClick={()=>{
                        if(!selectedAddress){
                            setError(true)
                        }
                        else{
                            handleClick(order,work,props,selectedAddress)
                        }
                    }}>Confirm</Button>
                </div>
            </div>
        )
    }
    else{
        props.history.replace('/user/addAddress')
        return(
            <div>
                <CircularProgress />
            </div>
        )
    }
}