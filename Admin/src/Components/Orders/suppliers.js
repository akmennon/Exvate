import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';

import { Title, Loading, Error as MyError, useRefresh } from 'react-admin';

import axios from '../../config/Axios';
import DataTable from './supplierTable'
import supplierModal from './supplierModal'

const useStyles = makeStyles((theme) => ({
    column: {
        'display': 'flex',
        'flexDirection': 'column',
        'alignItems': 'center'
    },
    content: {
        'display': 'flex',
        'flexDirection': 'row',
        'justifyContent': 'space-between'
    },
    header: {
        'padding': 5
    },
    modal: {
        'display': 'flex',
        'alignItems': 'center',
        'justifyContent': 'center',
    },
    paper: {
        'backgroundColor': theme.palette.background.paper,
        'border': '2px solid #000',
        'boxShadow': theme.shadows[5],
        'padding': theme.spacing(2, 4, 3),
    },
    variables: {
        'display': 'flex',
        'margin-bottom': 20,
        'alignItems': 'flex-start',
        'flexDirection': 'column'
    },
    valuesField: {
        'width': 200,
        'margin-right': 10
    },
    param: {
        'margin-bottom': 20
    },
    paymentSelect:{
        'display':'flex',
        'flexDirection':'row',
        'margin-bottom':20,
        'alignItems':'center'
    },
    select:{
        'margin-left':15
    },
    container: {
        'display': 'flex',
        'flexWrap': 'wrap',
        'alignItems':'center',
        'margin-bottom':20
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    }
}))

const supplierButton = (supplierId, type, { params, setParams, setOpen,setPaymentDetails }) => {
    switch (type) {
        case 'assign':
            setParams({ ...params, supplier: { assigned: supplierId }, type: 'assign' })
            setOpen(true)
            break;
        case 'value':
            setParams({ ...params, type: 'assign' })
            setOpen(true)
            break;
        case 'remove':
            const removed = params.supplier.removed
            removed.push(supplierId)
            setParams({ ...params, supplier: { removed: removed }, type: 'assign' })
            setOpen(true)
            break;
        case 'payment':
            setParams({ ...params, type: 'payment' })
            setPaymentDetails(p=>{return {...p,supplierId:supplierId}})
            setOpen(true)
            console.log('payment')
            break;
        case 'finish':
            setParams({ ...params, type: 'finish' })
            setPaymentDetails(p=>{return {...p,supplierId:supplierId,statusPayment:'Finished'}})
            setOpen(true)
            break;
        default:
            console.log('Invalid')
    }
}

const suppliers = (data, classes, props, params, setParams, open, setOpen, order, confirm,cred, paymentDetails,setCred,setPaymentDetails) => {
    if (data&&data.suppliers&&data.suppliers.length !== 0) {
        const reset = () => {
            setParams(p => {
                p.values.price = order.values.price
                p.values.time = order.values.time
                p.values.supplierAmount = order.paymentStatus.supplierAmount
                p.values.validTill = 7
                return { ...p }
            })
        }
        const nextParams = { supplierButton, params, setParams, setOpen, order: data.order, suppliers: data.suppliers, setPaymentDetails,...props }
        return (
            <Card>
                <Modal
                    aria-labelledby="transition-modal-title"
                    className={classes.modal}
                    open={open}
                    onClose={() => setOpen(false)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={open}>
                        {
                            supplierModal({ reset, setOpen, confirm, params, classes, setParams, props ,cred, paymentDetails,setCred,setPaymentDetails})
                        }
                    </Fade>
                </Modal>
                <Button variant='outlined' color='primary' onClick={() => {supplierButton('','value',{params,setParams,setOpen,setPaymentDetails});setOpen(true)}}>Change values</Button>
                <CardContent>
                    <DataTable {...nextParams} />
                </CardContent>
            </Card>
        )
    }
    else {
        return (
            <Card>
                <CardContent>
                    <Typography>No suppliers found</Typography>
                </CardContent>
            </Card>
        )
    }
}

function SuppliersList(props) {
    const classes = useStyles()
    const orderSaved = useSelector(state=>state.order)
    const [loading,setLoading] = useState(true)
    const [data,setData] = useState([])
    const [params, setParams] = useState(
        {
            values: {
                price: 0,
                time: 0,
                validTill: 7,
                supplierAmount: 0,
                variables: []
            },
            supplier: {
                assigned: '',
                removed: []
            },
            type: ''
        }
    )
    const [open, setOpen] = useState(false)
    const [order, setOrder] = useState({})
    const [cred,setCred] = useState({email:'',password:''})
    const [paymentDetails,setPaymentDetails] = useState({type:'LC',supplierId:'',statusPayment:'',advancePercent:10,transactionId:'',paymentDate:'',paymentMethod:'Online Transfer'})
    const refresh = useRefresh()

    useEffect(()=>{
        if(!orderSaved.workId){
            props.history.goBack()
            return null
        }
        else{
            const token = sessionStorage.getItem('token')
            axios.get(`orders/${orderSaved.workId._id}/suppliers`,
            {
                headers:{
                    'x-admin':token
                }
            })
            .then((res)=>{
                res.data.suppliers.forEach((ele)=>{
                    ele.id = ele._id
                    return ele
                })
                res.data.order = orderSaved
                console.log(res.data)
                setData(res.data)
                setLoading(false)
            })
            .catch((err)=>{
                setLoading(false)
                console.log(err)
            })
        }

        setOrder(orderSaved)

        orderSaved.values.variables = orderSaved.values.variables.map((ele) => {
            ele.id = ele._id
            if (!ele.unit) {
                ele.unit = ''
            }
            return ele
        })
        
        setParams(p => ({ ...p, values: { ...p.values, price: orderSaved.values.price, time: orderSaved.values.time, variables: orderSaved.values.variables, supplierAmount:orderSaved.paymentStatus.supplierAmount||0 } }))//Validity Days check from server
    },[])

    console.log(orderSaved)
    console.log(params)
    const token = sessionStorage.getItem('token')


    if (loading) { return <Loading /> }
    if (!data) { return <MyError/> }

    const confirmAssign = (type) => {
        setOpen(false)
        switch(type){
            case 'supplier':
                axios.post(`orders/verify/${data.order._id}`, params, {
                    headers: {
                        'x-admin': token
                    }
                })
                .then((response) => {
                    console.log(response.data)
                    refresh(true)
                })
                .catch((err) => {
                    console.log(err)
                })
            break;
            case 'payment':{
                const input = Object.assign(cred,{paymentDetails})
                axios.post(`orders/supplierPayment/${props.match.params.id}`, input, {
                    headers: {
                        'x-admin': token
                    }
                })
                .then((response) => {
                    console.log(response.data)
                })
                .catch((err) => {
                    console.log(err)
                })}
            break;
            case 'finish':
                const input = Object.assign(cred,{paymentDetails})
                axios.post(`orders/supplierPayment/${props.match.params.id}`, input, {
                    headers: {
                        'x-admin': token
                    }
                })
                .then((response) => {
                    console.log(response.data)
                })
                .catch((err) => {
                    console.log(err)
                })
            break;
            default:
                console.log('Error')
        }
    }

    return (
        <div>
            <Title title='Verification' />
            {
                suppliers(data, classes, props, params, setParams, open, setOpen, order, confirmAssign, cred, paymentDetails,setCred,setPaymentDetails)
            }
        </div>
    )
}

export default SuppliersList