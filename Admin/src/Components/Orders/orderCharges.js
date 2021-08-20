import React,{useEffect, useState} from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from "@material-ui/core/Typography";
import { Title } from 'react-admin';
import { useSelector } from "react-redux";
import { DataGrid } from '@material-ui/data-grid'
import Button from '@material-ui/core/Button'
import axios from '../../config/Axios'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const getPaymentDate = ({row}) =>{
    return new Date(row.paymentDate).toLocaleDateString('en-GB', { timeZone: 'UTC' })
}

const deleteChargeClick = (id,chargeId,setOpen) =>{
    const token = sessionStorage.getItem('token')
    console.log(id)
    axios.post(`/orders/${id}/removecharges`,{ id:chargeId },{
        headers:{
            'x-admin':token
        }
    })
    .then((response)=>{
        setOpen(false)
    })
    .catch((err)=>{
        console.log(err)
    })
}

const OrderCharges = (props) => {
    const [data,setData] = useState([])
    const [open,setOpen] = useState(false)
    const order = useSelector((state)=>{return state.order})
    const classes = useStyles()
    const [rowId,setRowId] = useState('')
    

    useEffect(()=>{
        if(order&&order.pl&&order.pl.charges){
            setData((prevState)=>{
                let p = prevState.concat(order.pl.charges)
                p = p.map((ele)=>{
                    ele.id = ele._id
                    return ele
                })
                return p
            })
        }
    },[order,setData])

    
    if(data){
        console.log(data)
        
        const deleteButton = (ev) =>{
            const {row} = ev
            return (
                <Button onClick={()=>{setRowId(row._id);setOpen(true)}}> Delete </Button>
            )
        }

        const columns = [
            {field:'entityName',headerName:'Name',width:150},
            {field:'entity',headerName:'Entity',width:150},
            {field:'chargeType',headerName:'Type',width:150},
            {field:'price',headerName:'Price',width:150},
            {field:'paymentDate',headerName:'Date',width:150,valueGetter:getPaymentDate},
            {field:'contactName',headerName:'Contact Name',width:200},
            {field:'contactNumber',headerName:'Contact Number',width:170},
            {field:'transactionId',headerName:' ',width:170,renderCell:deleteButton}
        ]

        return (
            <Card>
                <Title title="Orders" />
                <CardContent>
                    <Modal
                        className={classes.modal}
                        open={open}
                        onClose={()=>setOpen(false)}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                        timeout: 500,
                        }}
                    >
                        <Fade in={open}>
                            <div className={classes.paper}>
                                <Typography variant='h6'>Are you sure</Typography>
                                <Button onClick={()=>deleteChargeClick(order._id,rowId,setOpen)}>Confirm</Button>
                            </div>
                        </Fade>
                    </Modal>
                    <div style={{height:500,width:"100%"}}>
                        <DataGrid rows={data} columns={columns} />
                    </div>
                </CardContent>
            </Card>
        )
    }
    else{
        setTimeout(()=>props.history.replace('/orders'),5000)
        return (
            <Card>
                <Title title="Orders" />
                <CardContent>
                    <Typography>Cant find any charges. Redirecting</Typography>
                </CardContent>
            </Card>
        )
    }
}

export default OrderCharges;