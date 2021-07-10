import React, { useState } from "react";
import { Show, SimpleShowLayout, TextField, DateField, Datagrid, ArrayField, EditButton, TopToolbar, useShowController } from 'react-admin';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField1 from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography'
import axios from '../../config/Axios'
import { Fragment } from "react";
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { useDispatch } from "react-redux";
import { setOrder } from "../../Action/orderAction";


const useStyles = makeStyles( (theme) => ({
    'actions':{
        'box-sizing':'flex',
        'alignItems':'center',
        'justifyContent':'space-between'
    },
    modal:{
        'display': 'flex',
        'alignItems': 'center',
        'justifyContent': 'center',
    },
    paper:{
        'backgroundColor': theme.palette.background.paper,
        'border': '2px solid #000',
        'boxShadow': theme.shadows[5],
        'padding': theme.spacing(2, 4, 3),
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
    },
}))

const PostShowActions = (props) => {
    const styles = useStyles()
    const [open,setOpen] = useState(false)
    const [type,setType] = useState('Confirm')
    const [cred,setCred] = useState({email:'',password:''})
    const [paymentDetails,setPaymentDetails] = useState({type:'Advance',deadline:''})
    const [shippingDetails,setShippingDetails] = useState({shipmentType:'Cargo',consignmentId:'',incoterm:'',serviceProvider:'',statusLink:'',port:'',CHA:''})

    const handleClick = (orderId='',type,email='',pass='',props={},payment) =>{
        switch(type){
            case 'complete':
                axios.post(`/orders/${orderId}/orderfn`,{email,password:pass,type:'complete'})
                .then((response)=>{
                    console.log(response.data)
                })
                .catch((e)=>{
                    console.log(e)
                })
            break;
            case 'shipped':
                axios.post(`/orders/${orderId}/orderfn`,{email,password:pass,type:'shipped',shippingDetails})
                .then((response)=>{
                    console.log(response.data)
                })
                .catch((e)=>{
                    console.log(e)
                })
            break;
            case 'finish':
                axios.post(`/orders/${orderId}/orderfn`,{email,password:pass,type:'finish'})
                .then((response)=>{
                    console.log(response.data)
                })
                .catch((e)=>{
                    console.log(e)
                })
            break;
            case 'contractFinished'://Pending here
                axios.post(`/orders/${orderId}/contractFinished`,{email,password:pass})
                .then((response)=>{
                    console.log(response.data)
                })
                .catch((e)=>{
                    console.log(e)
                })
            break;
            case 'cancel':
                axios.post(`/orders/${orderId}/orderfn`,{email,password:pass,type:'cancel'})
                .then((response)=>{
                    console.log(response.data)
                })
                .catch((e)=>{
                    console.log(e)
                })
            break;
            case 'confirm':
                const deadDate = paymentDetails.deadline.split('-')
                const date = new Date(deadDate[0],deadDate[1],deadDate[2],0,0,0)
                const newDate = date.toISOString(date)
                setPaymentDetails(p=>({...p,deadline:newDate}))
                axios.post(`orders/payment/${props.match.params.id}`,{email,password:pass,paymentDetails})
                .then((response)=>{
                    console.log(response.data)
                })
                .catch((e)=>{
                    console.log(e)
                })
            break;
            case 'refund':
                axios.post(`/orders/${orderId}/refund`,{email,password:pass})
                .then((response)=>{
                    console.log(response.data)
                })
                .catch((e)=>{
                    console.log(e)
                })
            break;
            case 'failed':
                axios.post(`/orders/${orderId}/orderfn`,{email,password:pass,type:'fail'})
                .then((response)=>{
                    console.log(response.data)
                })
                .catch((e)=>{
                    console.log(e)
                })
            break;
            default:
                console.log('wrong entry')
        }
    }

    if(props.record){
        console.log(props.record)
        return (
            <TopToolbar className={styles.actions}>
                <Modal
                    aria-labelledby="transition-modal-title"
                    className={styles.modal}
                    open={open}
                    onClose={()=>setOpen(false)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={open}>
                        <div className={styles.paper}>
                            {
                                type==='confirm'?(
                                    <Fragment>
                                        <div className={styles.paymentSelect}>
                                            <Typography>Payment Type :</Typography>
                                            <div className={styles.select}>
                                                <Select
                                                value={paymentDetails.type}
                                                onChange={(e)=>{const val = e.target.value;setPaymentDetails(p=>({...p,type:val}))}}
                                                label="Payment"
                                                >
                                                    <MenuItem value={"Advance"}>Advance</MenuItem>
                                                    <MenuItem value={"LC"}>LC</MenuItem>
                                                </Select>
                                            </div>
                                        </div>
                                        <form className={styles.container} noValidate>
                                            <Typography>Deadline :</Typography>
                                            <TextField1
                                                type="date"
                                                defaultValue={paymentDetails.deadline}
                                                className={styles.textField}
                                                InputLabelProps={{
                                                shrink: true,
                                                }}
                                                onChange={(e)=>{const val = e.target.value;setPaymentDetails(p=>({...p,deadline:val}))}}
                                            />
                                        </form>
                                    </Fragment>
                                ):
                                type==='shipped'?(
                                    <Fragment>
                                        <div className={styles.paymentSelect}>
                                            <Typography>Shipment Type :</Typography>
                                            <div className={styles.select}>
                                                <Select
                                                value={shippingDetails.shipmentType}
                                                onChange={(e)=>{const val = e.target.value;setShippingDetails(p=>({...p,shipmentType:val}))}}
                                                label="Payment"
                                                >
                                                    <MenuItem value={"Cargo"}>Cargo</MenuItem>
                                                    <MenuItem value={"Courier"}>Courier</MenuItem>
                                                </Select>
                                            </div>
                                        </div>
                                        {
                                            shippingDetails.shipmentType==='Cargo'?(
                                                <Fragment>
                                                    <div className={styles.paymentSelect}>
                                                        <Typography>Incoterm :</Typography>
                                                        <div className={styles.select}>
                                                            <Select
                                                            value={shippingDetails.incoterm}
                                                            onChange={(e)=>{const val = e.target.value;setShippingDetails(p=>({...p,incoterm:val}))}}
                                                            label="Payment"
                                                            >
                                                                <MenuItem value={"Exworks"}>Exworks</MenuItem>
                                                                <MenuItem value={"FOB"}>FOB</MenuItem>
                                                                <MenuItem value={"CIF"}>CIF</MenuItem>
                                                                <MenuItem value={"CFR"}>CFR</MenuItem>
                                                                <MenuItem value={"FCA"}>FCA</MenuItem>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <div className={styles.paymentSelect}>
                                                        <Typography>Port :</Typography>
                                                        <TextField1
                                                            value={shippingDetails.port}
                                                            className={styles.textField}
                                                            InputLabelProps={{
                                                            shrink: true,
                                                            }}
                                                            onChange={(e)=>{const val = e.target.value;setShippingDetails(p=>({...p,port:val}))}}
                                                        />
                                                    </div>
                                                </Fragment>
                                            ):<span/>
                                        }
                                        <div className={styles.paymentSelect}>
                                            <Typography>Consignment Id :</Typography>
                                            <TextField1
                                                value={shippingDetails.consignmentId}
                                                className={styles.textField}
                                                InputLabelProps={{
                                                shrink: true,
                                                }}
                                                onChange={(e)=>{const val = e.target.value;setShippingDetails(p=>({...p,consignmentId:val}))}}
                                            />
                                        </div>
                                        <div className={styles.paymentSelect}>
                                            <Typography>Service Provider :</Typography>
                                            <TextField1
                                                value={shippingDetails.serviceProvider}
                                                className={styles.textField}
                                                InputLabelProps={{
                                                shrink: true,
                                                }}
                                                onChange={(e)=>{const val = e.target.value;setShippingDetails(p=>({...p,serviceProvider:val}))}}
                                            />
                                        </div>
                                        <div className={styles.paymentSelect}>
                                            <Typography>Status Link :</Typography>
                                            <TextField1
                                                value={shippingDetails.statusLink}
                                                className={styles.textField}
                                                InputLabelProps={{
                                                shrink: true,
                                                }}
                                                onChange={(e)=>{const val = e.target.value;setShippingDetails(p=>({...p,statusLink:val}))}}
                                            />
                                        </div>
                                        <div className={styles.paymentSelect}>
                                            <Typography>CHA :</Typography>
                                            <TextField1
                                                value={shippingDetails.CHA}
                                                className={styles.textField}
                                                InputLabelProps={{
                                                shrink: true,
                                                }}
                                                onChange={(e)=>{const val = e.target.value;setShippingDetails(p=>({...p,CHA:val}))}}
                                            />
                                        </div>
                                    </Fragment>
                                ):<span/>
                            }
                            <div>
                                <Typography id="auth-modal-title">Authentication</Typography>
                                <TextField1
                                    label="email"
                                    type="email"
                                    variant='outlined'
                                    onChange={(e)=>{const val = e.target.value;setCred(cred=>({...cred,email:val}))}}
                                    value={cred.email}
                                />
                                <TextField1
                                    label="password"
                                    type="password"
                                    variant='outlined'
                                    onChange={(e)=>{const val = e.target.value;setCred(cred=>({...cred,password:val}))}}
                                    value={cred.password}
                                />
                                <Button color='primary' variant='outlined' onClick={()=>{handleClick(props.record._id,type,cred.email,cred.password,props,paymentDetails);setOpen(false)}}>Confirm</Button>
                            </div>
                        </div>
                    </Fade>
                </Modal>
                <div style={{display:'flex',flexDirection:"row"}}>
                    {
                        props.record.verified.value?
                        (<div>
                            {
                                props.record.status!=='Cancelled'&&props.record.status!=='Failed'?
                                <Button color="primary" variant='outlined' onClick={() => props.history.push(`/orders/hosts/${props.record._id}`)}>Hosts</Button>:
                                props.record.paymentStatus.value==='Completed'?
                                <Button color="primary" variant='outlined' onClick={() => {setType('refund');setOpen(true)}}>Confirm Refund</Button>:
                                <span/>
                            }
                            {
                                props.record.paymentStatus.value==='Pending'&&props.record.status!=='Cancelled'&&props.record.status!=='Failed'?
                                <Fragment>
                                    <Button color="primary" variant='outlined' onClick={() => {setType('confirm');setOpen(true)}}>Confirm payment</Button>
                                    <Button color="primary" variant='outlined' onClick={() => {setType('cancel');setOpen(true)}}>Cancel</Button>
                                </Fragment>:<span/>
                            }
                            {
                                props.record.paymentStatus.value==='Contract'&&props.record.status!=='Failed'&&props.record.status!=='Finished'?(
                                    <Button color="primary" variant='outlined' onClick={() => {setType('failed');setOpen(true)}}>Order Failed</Button>
                                ):<span/>
                            }
                            {
                                props.record.paymentStatus.value==='Completed'&&props.record.status!=='Transit'&&props.record.status!=='Completed'&&props.record.status!=='Finished'?(
                                    <Button color="primary" variant='outlined' onClick={() => {setType('cancel');setOpen(true)}}>Cancel</Button>
                                ):<span/>
                            }
                            {
                                props.record.status==='Completed'||props.record.status==='Transit'?(
                                    <Button color="primary" variant='outlined' onClick={() => {setType('finish');setOpen(true)}}>Finished</Button>
                                ):<span/>
                            }
                            {
                                props.record.status==='Finished'&&props.record.paymentStatus.value==='Contract'?(
                                    <Button color="primary" variant='outlined' onClick={() => {setType('contractFinished');setOpen(true)}}>Contract Payment Finished</Button>
                                ):<span/>
                            }
                            {
                                (props.record.paymentStatus.value==='Contract'||props.record.paymentStatus.value==='Completed')&&props.record.status!=='Completed'&&props.record.status!=='Transit'&&props.record.status!=='Finished'?(
                                    <Fragment>
                                        <Button color="primary" variant='outlined' onClick={() => {setType('complete');setOpen(true)}}>Complete</Button>
                                        <Button color="primary" variant='outlined' onClick={() => {setType('shipped');setOpen(true)}}>Shipped</Button>
                                    </Fragment>
                                ):<span/>
                            }
                            {
                                props.record.status==='Completed'&&props.record.status!=='Transit'&&props.record.status!=='Finished'?(
                                    <Fragment>
                                        <Button color="primary" variant='outlined' onClick={() => {setType('shipped');setOpen(true)}}>Shipped</Button>
                                    </Fragment>
                                ):<span/>
                            }
                        </div>):
                        <Button color="primary" variant='outlined' onClick={() => props.history.push(`/orders/hosts/${props.record._id}`)}>Verify</Button>
                    }
                </div>
                <EditButton basePath={props.basePath} record={props.record} />
            </TopToolbar>
        )
    }
    else{
        return null
    }
};

const OrderShow = (props) => { 
    const {record} = useShowController(props)
    useDispatch()(setOrder(record))
    return (
    <Show actions={<PostShowActions {...props} record={record} />} {...props}>
        <SimpleShowLayout>
            <TextField source="workId.title" label='Work'/>
            <TextField source="userId.name" label='User' />
            <DateField source='createdAt' label='Ordered On' />
            {
                (()=>{
                    if(record){
                        if(record.paymentStatus.value==='Contract'){
                            return <DateField source='deadline' label='Deadline' />
                        }
                        else{
                            return <DateField source='validTill' label='Valid Till' />
                        }
                    }
                    else{
                        return null
                    }
                })(record)
            }
            <TextField source='verified.value' label='Verified' />
            <TextField source='status' label='Status' />
            <TextField source='paymentStatus.value' label='Payment' />
            <TextField source='paymentStatus.hostPayment' label='Host payment'/>
            <TextField source='paymentStatus.hostAmount' label='Host Amount'/>
            <TextField source='values.price' label='Price' />
            <TextField source='values.time' label='Time' />
            <ArrayField source="values.variables" label='Values'>
                <Datagrid>
                    <TextField source='title' label='Title' />
                    <TextField source='value' label='Price' />
                    <TextField source='unit' label='Unit' />
                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
)};

export default OrderShow