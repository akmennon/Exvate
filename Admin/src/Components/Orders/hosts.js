import React, { useState, useEffect,Fragment } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Select from '@material-ui/core/Select'
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
import { Title, Loading, useQuery } from 'react-admin';
import axios from '../../config/Axios';
import TextField from '@material-ui/core/TextField';
import DataTable from './hostTable'
import MenuItem from '@material-ui/core/MenuItem'

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

const hostButton = (hostId, type, { params, setParams, setOpen,setPaymentDetails }) => {
    switch (type) {
        case 'assign':
            setParams({ ...params, host: { assigned: hostId }, type: 'assign' })
            setOpen(true)
            break;
        case 'value':
            setParams({ ...params, type: 'assign' })
            setOpen(true)
            break;
        case 'remove':
            const removed = params.host.removed
            removed.push(hostId)
            setParams({ ...params, host: { removed: removed }, type: 'assign' })
            setOpen(true)
            break;
        case 'payment':
            setParams({ ...params, type: 'payment' })
            setPaymentDetails(p=>{return {...p,hostId:hostId}})
            setOpen(true)
            console.log('payment')
            break;
        case 'finish':
            setParams({ ...params, type: 'finish' })
            setPaymentDetails(p=>{return {...p,hostId:hostId,statusPayment:'Finished'}})
            setOpen(true)
            break;
        default:
            console.log('Invalid')
    }
}

const conditionModal = ({ reset, setOpen, confirm, setParams, params, classes, props ,cred, paymentDetails,setCred,setPaymentDetails}) => {
    if (params.type==='assign') {
        return (
            <div className={classes.paper}>
                <h2>Order Values</h2>
                <div className={classes.variables}>
                    {
                        !params.values || !params.values.variables ? <div /> : params.values.variables.map((ele, index) => {
                            return (
                                <div key={ele.id} className={classes.param}>
                                    <TextField
                                        label='Title'
                                        type="text"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        className={classes.valuesField}
                                        onChange={(e) => { const val = e.target.value; setParams(p => { p.values.variables[index].title = val; return { ...p } }) }}
                                        value={params.values.variables[index].title}
                                    />
                                    <TextField
                                        label='Value'
                                        type="number"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        className={classes.valuesField}
                                        onChange={(e) => { const val = e.target.value; setParams(p => { p.values.variables[index].value = val; return { ...p } }) }}
                                        value={params.values.variables[index].value}
                                    />
                                    <TextField
                                        label='Unit'
                                        type="text"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        className={classes.valuesField}
                                        onChange={(e) => { const val = e.target.value; setParams(p => { p.values.variables[index].unit = val; return { ...p } }) }}
                                        value={params.values.variables[index].unit}
                                    />
                                    <Button variant='outlined' color='primary' onClick={() => setParams(p => { p.values.variables.splice(index, 1); return { ...p } })}>Remove</Button>
                                </div>
                            )
                        })
                    }
                    <Button style={{ marginBottom: 20 }} variant='outlined' color='primary' onClick={() => setParams(p => { p.values.variables.push({ id: `${'$' + (new Date()).getTime().toString()}`, title: 'Pending', value: 1, unit: '' }); return { ...p } })}>Add Param</Button>
                    <TextField
                        label='Host Price'
                        type="number"
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        className={classes.valuesField}
                        onChange={(e) => { const val = e.target.value; setParams(p => { p.values.hostAmount = val; return { ...p } }) }}
                        value={params.values.hostAmount}
                    />
                </div>
                <TextField
                    label="Price"
                    type="number"
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => { const val = e.target.value; setParams({ ...params, values: { ...params.values, price: Number(val) } }) }}
                    value={params.values.price}
                />
                <TextField
                    label="Time"
                    type="number"
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => { const val = e.target.value; setParams({ ...params, values: { ...params.values, time: Number(val) } }) }}
                    value={params.values.time}
                />
                <TextField
                    label="Validity"
                    type="number"
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => { const val = e.target.value; setParams({ ...params, values: { ...params.values, validTill: Number(val) } }) }}
                    value={params.values.validTill}
                />
                <button onClick={() => reset()}>Reset Values</button>
                <button onClick={() => { confirm('host',params, props); setOpen(false) }}>Confirm</button>
            </div>
        )
    }
    else if(params.type==='payment'){
        return (
            <div className={classes.paper}>
                <Fragment>
                    <div className={classes.paymentSelect}>
                        <Typography>Payment Type :</Typography>
                        <div className={classes.select}>
                            <Select
                                value={paymentDetails.type}
                                onChange={(e) => { const val = e.target.value; setPaymentDetails(p => ({ ...p, type: val })) }}
                                label="Payment"
                            >
                                <MenuItem value={"Advance"}>Advance</MenuItem>
                                <MenuItem value={"LC"}>LC</MenuItem>
                            </Select>
                        </div>
                    </div>
                </Fragment>
                <Typography>Authentication</Typography>
                <TextField
                    label="email"
                    type="email"
                    variant='outlined'
                    onChange={(e) => { const val = e.target.value; setCred(cred => ({ ...cred, email: val })) }}
                    value={cred.email}
                />
                <TextField
                    label="password"
                    type="password"
                    variant='outlined'
                    onChange={(e) => { const val = e.target.value; setCred(cred => ({ ...cred, password: val })) }}
                    value={cred.password}
                />
                <Button color='primary' variant='outlined' onClick={() => { confirm('payment') }}>Confirm</Button>
            </div>
        )
    }
    else{
        return (
            <div className={classes.paper}>
                <Typography>Authentication</Typography>
                <TextField
                    label="email"
                    type="email"
                    variant='outlined'
                    onChange={(e) => { const val = e.target.value; setCred(cred => ({ ...cred, email: val })) }}
                    value={cred.email}
                />
                <TextField
                    label="password"
                    type="password"
                    variant='outlined'
                    onChange={(e) => { const val = e.target.value; setCred(cred => ({ ...cred, password: val })) }}
                    value={cred.password}
                />
                <Button color='primary' variant='outlined' onClick={() => { confirm('finish') }}>Confirm</Button>
            </div>
        )
    }
}

const hosts = (data, classes, props, params, setParams, open, setOpen, order, confirm,cred, paymentDetails,setCred,setPaymentDetails) => {
    if (data.suppliers || data.suppliers.length !== 0) {
        console.log(params)
        console.log(data)
        const reset = () => {
            setParams(p => {
                p.values.price = order.values.price
                p.values.time = order.values.time
                p.values.hostAmount = 0
                p.values.validTill = 7
                return { ...p }
            })
        }
        const nextParams = { hostButton, params, setParams, setOpen, order: data.order, hosts: data.suppliers, setPaymentDetails,...props }
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
                            conditionModal({ reset, setOpen, confirm, setParams, params, classes, props ,cred, paymentDetails,setCred,setPaymentDetails})
                        }
                    </Fade>
                </Modal>
                <Button variant='outlined' color='primary' onClick={() => {hostButton('','value',{params,setParams,setOpen,setPaymentDetails});setOpen(true)}}>Change values</Button>
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
                    <Typography>No hosts found</Typography>
                </CardContent>
            </Card>
        )
    }
}

function HostsList(props) {
    const classes = useStyles()
    const [params, setParams] = useState(
        {
            values: {
                price: 0,
                time: 0,
                validTill: 7,
                hostAmount: 0,
                variables: []
            },
            host: {
                assigned: '',
                removed: []
            },
            type: ''
        }
    )
    const [open, setOpen] = useState(false)
    const [order, setOrder] = useState({})
    const [cred,setCred] = useState({email:'',password:''})
    const [paymentDetails,setPaymentDetails] = useState({type:'Advance',hostId:'',statusPayment:''})

    const { data, loading, error } = useQuery({
        type: 'getMany',
        resource: `orders/${props.match.params.id}/suppliers`,
        payload: { id: props.match.params.id }
    });

    const token = sessionStorage.getItem('token')

    useEffect(() => {
        axios.get(`orders/${props.match.params.id}`, {
            headers: {
                'x-admin': token
            }
        })
            .then((response) => {
                setOrder(response.data)
                response.data.values.variables = response.data.values.variables.map((ele) => {
                    ele.id = ele._id
                    if (!ele.unit) {
                        ele.unit = ''
                    }
                    return ele
                })
                setParams(p => ({ ...p, values: { ...p.values, price: response.data.values.price, time: response.data.values.time, variables: response.data.values.variables } }))//Validity Days check from server
            })
            .catch((err) => {
                console.log(err)
            })
    }, [token, props.match.params.id])

    if (loading) { return <Loading /> }
    if (error) { console.log(error) }
    if (!data) return null;

    const confirmAssign = (type) => {
        setOpen(false)
        switch(type){
            case 'host':
                axios.post(`orders/verify/${data.order._id}`, params, {
                    headers: {
                        'x-admin': token
                    }
                })
                .then((response) => {
                    console.log(response.data)
                    if (response.data._id !== props.match.params.id) {
                        props.history.goBack()
                    }
                    else {
                        props.history.replace(`/orders/${props.match.params.id}/show`)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
            break;
            case 'payment':{
                const input = Object.assign(cred,{paymentDetails})
                axios.post(`orders/hostPayment/${props.match.params.id}`, input, {
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
                axios.post(`orders/hostPayment/${props.match.params.id}`, input)
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
                hosts(data, classes, props, params, setParams, open, setOpen, order, confirmAssign, cred, paymentDetails,setCred,setPaymentDetails)
            }
        </div>
    )
}

export default HostsList