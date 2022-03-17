import React, { useEffect, useState } from 'react'
import axios from '../../config/axios'
import {setFinishedOrder} from '../../action/orderAction'
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import { useDispatch } from 'react-redux';

/* display all the orders of a user */

function Orders (props) {

    const [orders,setOrders] = useState([])
    const [total,setTotal] = useState(1)
    const [pageCount,setPageCount] = useState(1)
    const [status,setStatus] = useState('loading')
    const dispatch = useDispatch()

    useEffect(()=>{
        setStatus('loading')
        const token = localStorage.getItem('x-auth')
        const user = localStorage.getItem('user')
        if(token===undefined||token==='undefined'){
            props.history.push('/user/login')
        }
        axios.post('/user/orders',{page:pageCount},
        {
            headers:{
                'x-auth':token,
                'userId':user
            }
        })
            .then((response)=>{
                if(response.data.length===0){
                    setStatus('none')
                }
                else{
                    const totalPages = Math.ceil(Number(response.headers.total)/15)
                    setTotal(totalPages)
                    console.log(response.data)
                    setOrders(response.data)
                    setStatus('working')
                }
            })
            .catch((err)=>{
                console.log(err)
                setStatus('failed')
            })
    },[pageCount])

    const handleClick = (orderIndex) =>{
        dispatch(setFinishedOrder(orders[orderIndex]))
        props.history.push(`/user/orderPage/${orders[orderIndex]._id}`)
    }

    if(status==='none'){
        return (
            <div>
                You have not made any orders
            </div>
        )
    }
    else if(status==='loading'){
        return(
            <div>
                <CircularProgress />
            </div>
        )
    }
    else if(orders.length){
        return(
            <div>
                {
                    orders.map((order,orderIndex)=>{
                        return (
                            <p key={order._id} onClick={()=>{handleClick(orderIndex)}} >{order.status}</p>
                        )
                    })
                }
                <Pagination count={total} page={pageCount} onChange={(e,val)=>{setPageCount(val)}} />
            </div>
        )
    }
    else{
        return(
            <div>
                <h3>Error Fetching data.Please retry by refreshing the page</h3>
            </div>
        )
    }
}

export default Orders