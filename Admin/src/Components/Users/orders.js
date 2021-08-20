import React,{useEffect, useState} from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Title } from 'react-admin';
import axios from '../../config/Axios'
import { DataGrid } from '@material-ui/data-grid'
import Button from '@material-ui/core/Button'

const UserOrders = (props) => {
    const [data,setData] = useState([])
    useEffect(()=>{
        const token = sessionStorage.getItem('token')
        axios.get(`/users/${props.match.params.id}/orders`,
            {
                headers:{
                    'x-admin':token
                }
            })
            .then((response)=>{
                let resData = response.data
                resData = resData.map((ele)=>{
                    ele.id = ele._id
                    return ele
                })
                resData.reverse()
                console.log(response.data)
                setData(resData)
            })
            .catch((err)=>{
                console.log(err)
            })
    },[setData,props.match.params.id])

    const valueGetparams = ({row}) =>{
        return row.workId.title
    }

    const comepletionVerified = ({row}) =>{
        return row.completionVerified.length!==0?'true':'false'
    }

    const verifiedValue = ({row}) =>{
        return row.verified.value?'true':'false'
    }

    const paymentStatus = ({row}) =>{
        return row.paymentStatus.value
    }

    const buttonCell = (res) =>{
        return <Button variant='outlined' color='primary' onClick={()=>props.history.push(`/orders/${res.row._id}/show`)}>Open</Button>
    }

    const dateCell = (row) =>{
        console.log(row)
        return new Date(row.row.createdAt).toLocaleDateString('en-GB', { timeZone: 'UTC' })
    }

    const columns = [
        {field:'workId',headerName:'Work',width:150,valueGetter:valueGetparams},
        {field:'status',headerName:'Status',width:150},
        {field:'verified',headerName:'Verified',width:150,valueGetter:verifiedValue},
        {field:'completionVerified',headerName:'Finished',width:150,valueGetter:comepletionVerified},
        {field:'paymentStatus',headerName:'Payment',width:150,valueGetter:paymentStatus},
        {field:'createdAt',headerName:'created At',width:200,valueGetter:dateCell},
        {field:'button',headerName:'Details',width:150,renderCell:buttonCell}
    ]

    return (
        <Card>
            <Title title="Orders" />
            <CardContent>
                <div style={{height:500,width:"100%"}}>
                    <DataGrid rows={data} columns={columns} isRowSelectable={false} />
                </div>
            </CardContent>
        </Card>
    )
}

export default UserOrders;