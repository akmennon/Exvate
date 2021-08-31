import React,{useState} from 'react'
import { useSelector } from 'react-redux'
import axios from '../../config/axios'
import Button from '@material-ui/core/Button'

const handleClick = (order,work,props) => {//Orders with the given params
    const token = localStorage.getItem('x-auth')
    const data = {
        orderData:order,
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

    const [address,setAddress] = useState({})
    const order = useSelector((state)=>state.order)
    const work = useSelector((state)=>state.work)
    const user = useSelector((state)=>state.user)

    console.log(user)
    
    if(user.address.length>0){
        return (
            <div>
                {
                    user.address.map((address)=>{
                        return (
                            <div onClick={null}> {/* Change background color */}
                                <div>{address.building + ', ' + address.street + ', ' + address.city + ', ' + address.pin}</div>
                                <div>{address.state}</div>
                                <div>{address.country}</div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    else{
        return(
            <div>
                <h1>Choose Address</h1>
                <Button onClick={props.history.push('/user/addAddress')}>Add Address</Button>
            </div>
        )
    }
}