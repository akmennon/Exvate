import React,{useState} from 'react'
import { useSelector } from 'react-redux'
import axios from '../../config/axios'
import Button from '@material-ui/core/Button'
import makeStyles from '@material-ui/core/styles/makeStyles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles({
    list:{
        'background-color':'grey'
    }
})

const handleClick = (order,work,props,selectedAddress,checked,billingAddress) => {//Orders with the given params
    const token = localStorage.getItem('x-auth')
    let data
    !checked? data = {
        orderData:{...order,address:selectedAddress,billingAddress},
        resultId:work.result._id
    }: data = {
        orderData:{...order,address:selectedAddress,billingAddress:false},
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
    const [billingAddress,setBillingAddress] = useState({})
    const [error,setError] = useState(false)
    const [checked,setChecked] = useState(false)
    const order = useSelector((state)=>state.order.newOrder)
    const work = useSelector((state)=>state.work)
    const user = useSelector((state)=>state.user)
    const classes = useStyles()

    const handleChange = (ev) =>{
        ev.persist()
        setBillingAddress((prev)=>{
            prev[ev.target.name] = ev.target.value
            return prev
        })
        console.log(billingAddress)
    }
    
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
                    <div>
                        <h3>Billing address</h3>
                        <FormControlLabel
                            control={<Checkbox checked={checked} onChange={()=>{checked?setChecked(false):setChecked(true)}} color='primary' />}
                            label="Billing address same as shipping address"
                        />
                        {
                            !checked?(
                                <div style={{display:'flex',flexDirection:'column', rowGap:10}}>
                                    <TextField label="Name" onChange={handleChange} name='name' value={billingAddress.name} variant="outlined" />
                                    <TextField label="Building" onChange={handleChange} name='building' value={billingAddress.building} variant="outlined" />
                                    <TextField label="Street" onChange={handleChange} name='street' value={billingAddress.street} variant="outlined" />
                                    <TextField label="City" onChange={handleChange} name='city' value={billingAddress.city} variant="outlined" />
                                    <TextField label="State" onChange={handleChange} name='state' value={billingAddress.state} variant="outlined" />
                                    <TextField label="Country" onChange={handleChange} name='country' value={billingAddress.country} variant="outlined" />
                                    <TextField label="Pin" onChange={handleChange} name='pin' value={billingAddress.pin} variant="outlined" />
                                </div>
                            ):<span/>
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
                            handleClick(order,work,props,selectedAddress,checked,billingAddress)
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