import React from 'react'
import { useSelector } from 'react-redux'

export default function OrderPage (props){
    let order = useSelector((state)=>state.order.finishedOrder)

    return (
        <div>
            <h1>{order.workId.title}</h1>
        </div>
    )
}