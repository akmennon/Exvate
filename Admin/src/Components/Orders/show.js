import React, { useState,Fragment } from "react";
import { Show, SimpleShowLayout, TextField, DateField, Datagrid, ArrayField, EditButton, TopToolbar, useShowController } from 'react-admin';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField1 from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography'
import axios from '../../config/Axios'
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
    const [paymentDetails,setPaymentDetails] = useState({type:'LC',deadline:'',advancePercent:0})
    const [shippingDetails,setShippingDetails] = useState({shipmentType:'Cargo',consignmentId:'',incoterm:'',serviceProvider:'',statusLink:'',port:'',CHA:''})
    const [charges,setCharges] = useState({chargeType:'Shipping',otherDetails:'',entity:'',entityName:'',price:0,contactName:'',contactNumber:'',transactionId:'',paymentDate:'',paymentMethod:''})
    const token = sessionStorage.getItem('token')

    const handleClick = (orderId='',type,email='',pass='',props={},payment) =>{
        switch(type){
            case 'complete':
                axios.post(`/orders/${orderId}/orderfn`,{email,password:pass,type:'complete'},{
                    headers:{
                        'x-admin':token
                    }
                })
                .then((response)=>{
                    console.log(response.data)
                })
                .catch((e)=>{
                    console.log(e)
                })
            break;
            case 'shipped':
                axios.post(`/orders/${orderId}/orderfn`,{email,password:pass,type:'shipped',shippingDetails},{
                    headers:{
                        'x-admin':token
                    }
                })
                .then((response)=>{
                    console.log(response.data)
                })
                .catch((e)=>{
                    console.log(e)
                })
            break;
            case 'finish':
                axios.post(`/orders/${orderId}/orderfn`,{email,password:pass,type:'finish'},{
                    headers:{
                        'x-admin':token
                    }
                })
                .then((response)=>{
                    console.log(response.data)
                })
                .catch((e)=>{
                    console.log(e)
                })
            break;
            case 'contractFinished'://Pending here
                axios.post(`/orders/${orderId}/contractFinished`,{email,password:pass},{
                    headers:{
                        'x-admin':token
                    }
                })
                .then((response)=>{
                    console.log(response.data)
                })
                .catch((e)=>{
                    console.log(e)
                })
            break;
            case 'cancel':
                axios.post(`/orders/${orderId}/orderfn`,{email,password:pass,type:'cancel'},{
                    headers:{
                        'x-admin':token
                    }
                })
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
                axios.post(`orders/payment/${props.match.params.id}`,{email,password:pass,paymentDetails},{
                    headers:{
                        'x-admin':token
                    }
                })
                .then((response)=>{
                    console.log(response.data)
                })
                .catch((e)=>{
                    console.log(e)
                })
            break;
            case 'refund':
                axios.post(`/orders/${orderId}/refund`,{email,password:pass},{
                    headers:{
                        'x-admin':token
                    }
                })
                .then((response)=>{
                    console.log(response.data)
                })
                .catch((e)=>{
                    console.log(e)
                })
            break;
            case 'failed':
                axios.post(`/orders/${orderId}/orderfn`,{email,password:pass,type:'fail'},{
                    headers:{
                        'x-admin':token
                    }
                })
                .then((response)=>{
                    console.log(response.data)
                })
                .catch((e)=>{
                    console.log(e)
                })
            break;
            case 'charges':
                let newcharges = {}
                for (let x in charges) {
                    if(charges[x] !== ''){
                        newcharges[x] = charges[x]
                    }
                }
                axios.post(`/orders/${orderId}/addCharges`,{email,password:pass,details:newcharges},{
                    headers:{
                        'x-admin':token
                    }
                })
                .then((response)=>{
                    console.log(response.data)
                    setOpen(false)
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
                                                    <MenuItem value={"Advance/LC"}>Advance/LC</MenuItem>
                                                </Select>
                                            </div>
                                        </div>
                                        {
                                            paymentDetails.type==='Advance/LC'?
                                            <div className={styles.paymentSelect}>
                                                <Typography>Advance Percentage :</Typography>
                                                <TextField1
                                                    value={paymentDetails.advancePercent}
                                                    type='number'
                                                    className={styles.textField}
                                                    InputLabelProps={{
                                                    shrink: true,
                                                    }}
                                                    onChange={(e)=>{const val = e.target.value;setPaymentDetails(p=>({...p,advancePercent:val}))}}
                                                />
                                            </div>:<span/>
                                        }
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
                                ):
                                type==='charges'?(
                                    <Fragment>
                                        <div className={styles.paymentSelect}>
                                            <Typography>Charge Type :</Typography>
                                            <div className={styles.select}>
                                                <Select
                                                value={charges.chargeType}
                                                onChange={(e)=>{const val = e.target.value;setCharges(p=>({...p,chargeType:val}))}}
                                                label="Charge"
                                                >
                                                    <MenuItem value={"Shipping"}>Shipping</MenuItem>
                                                    <MenuItem value={"Inspection"}>Inspection</MenuItem>
                                                    <MenuItem value={"Insurance"}>Insurance</MenuItem>
                                                    <MenuItem value={"Return"}>Return</MenuItem>
                                                    <MenuItem value={"Other"}>Other</MenuItem>
                                                </Select>
                                            </div>
                                        </div>
                                        {
                                            charges.chargeType==='Other'||charges.chargeType==='Return'?(
                                                <div className={styles.paymentSelect}>
                                                    <Typography>Details :</Typography>
                                                    <TextField1
                                                        value={charges.otherDetails}
                                                        className={styles.textField}
                                                        InputLabelProps={{
                                                        shrink: true,
                                                        }}
                                                        onChange={(e)=>{const val = e.target.value;setCharges(p=>({...p,otherDetails:val}))}}
                                                    />
                                                </div>
                                            ):<span/>
                                        }
                                        <div className={styles.paymentSelect}>
                                            <Typography>Entity :</Typography>
                                            <div className={styles.select}>
                                                <Select
                                                value={charges.entity}
                                                onChange={(e)=>{const val = e.target.value;setCharges(p=>({...p,entity:val}))}}
                                                label="Entity"
                                                >
                                                    <MenuItem value={"Bank"}>Bank</MenuItem>
                                                    <MenuItem value={"Company"}>Company</MenuItem>
                                                    <MenuItem value={"Individual"}>Individual</MenuItem>
                                                    <MenuItem value={"Gov"}>Gov</MenuItem>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className={styles.paymentSelect}>
                                            <Typography>Entity Name :</Typography>
                                            <TextField1
                                                value={charges.entityName}
                                                className={styles.textField}
                                                InputLabelProps={{
                                                shrink: true,
                                                }}
                                                onChange={(e)=>{const val = e.target.value;setCharges(p=>({...p,entityName:val}))}}
                                            />
                                        </div>
                                        <div className={styles.paymentSelect}>
                                            <Typography>Price :</Typography>
                                            <TextField1
                                                value={charges.serviceProvider}
                                                className={styles.textField}
                                                type='number'
                                                InputLabelProps={{
                                                shrink: true,
                                                }}
                                                onChange={(e)=>{const val = e.target.value;setCharges(p=>({...p,price:val}))}}
                                            />
                                        </div>
                                        <div className={styles.paymentSelect}>
                                            <Typography>Contact Name :</Typography>
                                            <TextField1
                                                value={charges.contactName}
                                                className={styles.textField}
                                                InputLabelProps={{
                                                shrink: true,
                                                }}
                                                onChange={(e)=>{const val = e.target.value;setCharges(p=>({...p,contactName:val}))}}
                                            />
                                        </div>
                                        <div className={styles.paymentSelect}>
                                            <Typography>Contact Number :</Typography>
                                            <TextField1
                                                value={charges.contactNumber}
                                                className={styles.textField}
                                                InputLabelProps={{
                                                shrink: true,
                                                }}
                                                onChange={(e)=>{const val = e.target.value;setCharges(p=>({...p,contactNumber:val}))}}
                                            />
                                        </div>
                                        <div className={styles.paymentSelect}>
                                            <Typography>Transaction Id :</Typography>
                                            <TextField1
                                                value={charges.transactionId}
                                                className={styles.textField}
                                                InputLabelProps={{
                                                shrink: true,
                                                }}
                                                onChange={(e)=>{const val = e.target.value;setCharges(p=>({...p,transactionId:val}))}}
                                            />
                                        </div>
                                        <div className={styles.paymentSelect}>
                                            <Typography>Payment Date :</Typography>
                                            <TextField1
                                                type='date'
                                                value={charges.paymentDate}
                                                className={styles.textField}
                                                InputLabelProps={{
                                                shrink: true,
                                                }}
                                                onChange={(e)=>{const val = e.target.value;setCharges(p=>({...p,paymentDate:val}))}}
                                            />
                                        </div>
                                        <div className={styles.paymentSelect}>
                                            <Typography>Payment Method :</Typography>
                                            <div className={styles.select}>
                                                <Select
                                                value={charges.paymentMethod}
                                                onChange={(e)=>{const val = e.target.value;setCharges(p=>({...p,paymentMethod:val}))}}
                                                label="Payment Method"
                                                >
                                                    <MenuItem value={"Online Transfer"}>Online Transfer</MenuItem>
                                                    <MenuItem value={"Cash Payment"}>Cash Payment</MenuItem>
                                                </Select>
                                            </div>
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
                                <Button color="primary" variant='outlined' onClick={() => props.history.push(`/orders/suppliers/${props.record._id}`)}>Suppliers</Button>:
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
                                props.record.paymentStatus.value==='Contract'&&props.record.status!=='Completed'&&props.record.status!=='Failed'&&props.record.status!=='Finished'?(
                                    <Fragment>
                                        <Button color="primary" variant='outlined' onClick={() => {setType('failed');setOpen(true)}}>Order Failed</Button>
                                        <Button color="primary" variant='outlined' onClick={() => {setType('charges');setOpen(true)}}>Add Charges</Button>
                                    </Fragment>
                                ):<span/>
                            }
                            {
                                props.record.paymentStatus.value==='Completed'&&props.record.status!=='Transit'&&props.record.status!=='Completed'&&props.record.status!=='Finished'?(
                                    <Fragment>
                                        <Button color="primary" variant='outlined' onClick={() => {setType('cancel');setOpen(true)}}>Cancel</Button>
                                        <Button color="primary" variant='outlined' onClick={() => {setType('charges');setOpen(true)}}>Add Charges</Button>
                                    </Fragment>
                                ):<span/>
                            }
                            {
                                props.record.status==='Completed'?(
                                    <Button color="primary" variant='outlined' onClick={() => {setType('finish');setOpen(true)}}>Finished</Button>
                                ):<span/>
                            }
                            {
                                props.record.status==='Completed'&&props.record.paymentStatus.value==='Contract'?(
                                    <Button color="primary" variant='outlined' onClick={() => {setType('contractFinished');setOpen(true)}}>Contract Payment Finished</Button>
                                ):<span/>
                            }
                            {
                                (props.record.paymentStatus.value==='Contract'||props.record.paymentStatus.value==='Completed')&&props.record.status!=='Completed'&&props.record.status!=='Transit'&&props.record.status!=='Finished'?(
                                    <Fragment>
                                        <Button color="primary" variant='outlined' onClick={() => {setType('shipped');setOpen(true)}}>Shipped</Button>
                                    </Fragment>
                                ):<span/>
                            }
                            {
                                props.record.status!=='Completed'&&props.record.status==='Transit'&&props.record.status!=='Finished'?(
                                    <Fragment>
                                        <Button color="primary" variant='outlined' onClick={() => {setType('complete');setOpen(true)}}>Complete</Button>
                                    </Fragment>
                                ):<span/>
                            }
                            {
                                props.record.paymentStatus.value==='Completed'||props.record.paymentStatus.value==='Contract'?
                                    <Button color="primary" variant='outlined' onClick={() => props.history.push(`/orders/${props.match.params.id}/charges`)}>Charges</Button>
                                :<span/>
                            }
                        </div>):
                        <Button color="primary" variant='outlined' onClick={() => props.history.push(`/orders/suppliers/${props.record._id}`)}>Verify</Button>
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

const ValueField = (props) =>{
    console.log(props)
    if(props.record.tierType){
        return props.record.label||null
    }
    else{
        return props.record.value
    }
}

const OrderShow = (props) => { 
    const {record} = useShowController(props)
    const dispatch = useDispatch()
    
    if(record){
        dispatch(setOrder(record))
    }
    else{
        props.history.replace('/orders')
    }

    return (
    <Show actions={<PostShowActions {...props} record={record} />} {...props}>
        <SimpleShowLayout>
            <TextField source="workId.title" label='Work'/>
            <TextField source="userId.name" label='User' />
            <TextField source='type' label='Order Type' />
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
            <TextField source='paymentStatus.supplierPayment' label='Supplier payment'/>
            <TextField source='paymentStatus.supplierAmount' label='Supplier Cost'/>
            <TextField source='values.price' label='Price' />
            <TextField source='values.time' label='Time' />
            {
                record.pl&&record.pl.advancePercent?(
                    <SimpleShowLayout>
                        <TextField source='pl.currentPL' label='PL - Current' />
                        <TextField source='pl.totalPL' label='PL - Total' />
                        <TextField source='pl.currentPayment' label='Current Payment' />
                        <TextField source='pl.advancePercent' label='Advance percent' />
                    </SimpleShowLayout>
                ):<span/>
            }
            <ArrayField source="values.variables" label='Values'>
                <Datagrid>
                    <TextField source='title' label='Title' />
                    <ValueField source='value' label='Value' />
                    <TextField source='unit' label='Unit' />
                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
)};

export default OrderShow