import React,{useState} from "react";
import { Show, SimpleShowLayout, TextField, EditButton, TopToolbar, BooleanField} from 'react-admin';
import {makeStyles} from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField1 from '@material-ui/core/TextField';
import { Typography,Select,MenuItem,Button } from "@material-ui/core";
import axios from '../../config/Axios'
import Clear from '@material-ui/icons/Clear'
import Check from '@material-ui/icons/Check'

const useStyles = makeStyles(theme=>({
        topBar:{
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center'
        },
        buttons:{
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center',
            flexDirection:'row'
        },
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            border: '1px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3)
        },
        verifySelect:{
            'display':'flex',
            'flexDirection':'row',
            'margin-bottom':20,
            'alignItems':'center',
            'justifyContent':'flex-start'
        },
        verifySelectButton:{
            'display':'flex',
            'flexDirection':'row',
            'margin-bottom':20,
            'padding-top':20,
            'alignItems':'center',
            'justifyContent':'flex-end'
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
        multiOrderContainer:{
            width:500
        },
        suspendContainer:{
            width:500
        }
    })
)

const handleClick = (type,params,id,modOpen) =>{
    switch(type){
        case 'suspend':
            axios.post(`/users/${id}/suspend`,params)
            .then((res)=>{
                console.log(res)
                modOpen(p=>({...p,open:false}))
            })
            .catch((err)=>{
                console.log(err)
            })
        break;
        case 'verify':
            const token = sessionStorage.getItem('token')
            axios.post(`/users/${id}/verifySupplier`,params,{
                headers:{
                    'x-admin':token
                }
            })
            .then((res)=>{
                console.log(res)
                modOpen(p=>({...p,open:false}))
            })
            .catch((err)=>{
                console.log(err)
            })
        break;
        default:
        console.log('error handling click')
    }
}

const ModalBody = (props) =>{
    const classes = useStyles()
    const [data,setData] = useState({workCount:props.data.perms.supplier.multipleWorks.workCount||1,verified:props.data.perms.supplier.verified||false})
    const [suspend,setSuspend] = useState({action:'suspend',duration:Date.now(),target:'user',reason:'',email:'',password:''})

    if(props.mod.type === 'multiOrder'){
        console.log(data)
        return (
            <div className={classes.multiOrderContainer}>
                <div className={classes.verifySelect}>
                    <Typography>Verified Supplier :</Typography>
                    <div className={classes.select}>
                        <Select
                        value={data.verified}
                        onChange={(e)=>{setData(p=>({...p,verified:e.target.value}))}}
                        label="Verified Supplier"
                        variant="outlined"
                        >
                            <MenuItem value={true}>True</MenuItem>
                            <MenuItem value={false}>False</MenuItem>
                        </Select>
                    </div>
                </div>
                <div className={classes.container} noValidate>
                    <Typography>Work Count :</Typography>
                    <TextField1
                        type="number"
                        defaultValue={data.workCount}
                        className={classes.textField}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        onChange={(e)=>{setData(p=>({...p,workCount:Number(e.target.value)}))}}
                        variant="outlined"
                    />
                </div>
                <div className={classes.verifySelectButton}>
                    <Button variant="contained" color="primary" onClick={()=>handleClick('verify',data,props.match.params.id,props.modOpen)}>Update</Button>
                </div>
            </div>
        )
    }
    else if(props.mod.type === 'suspend'){
        console.log(suspend)
        console.log(props)
        return (
            <div className={classes.suspendContainer}>
                <div className={classes.verifySelect}>
                    <Typography>Action :</Typography>
                    <div className={classes.select}>
                        <Select
                        value={suspend.action}
                        onChange={(e)=>{setSuspend(p=>({...p,action:e.target.value}))}}
                        variant="outlined"
                        >
                            <MenuItem value={'suspend'}>Suspend</MenuItem>
                            <MenuItem value={'ban'}>Ban</MenuItem>
                        </Select>
                    </div>
                </div>
                <div className={classes.verifySelect}>
                    <Typography>Target :</Typography>
                    <div className={classes.select}>
                        <Select
                        value={suspend.target}
                        onChange={(e)=>{setSuspend(p=>({...p,target:e.target.value}))}}
                        variant="outlined"
                        >
                            <MenuItem value={'user'}>User</MenuItem>
                            {props.data.supplier?<MenuItem value={'supplier'}>Supplier</MenuItem>:<span/>}
                        </Select>
                    </div>
                </div>
                <div className={classes.verifySelect}>
                    <Typography>Reason :</Typography>
                    <div className={classes.select}>
                        <TextField1
                            type='text'
                            value={suspend.reason}
                            className={classes.select}
                            variant="outlined"
                            InputLabelProps={{
                            shrink: true,
                            }}
                            onChange={(e)=>{setSuspend(p=>({...p,reason:e.target.value}))}}
                        />
                    </div>
                </div>
                {
                    suspend.action==='suspend'?(
                        <div className={classes.container} noValidate>
                            <Typography>Duration :</Typography>
                            <TextField1
                                type="date"
                                defaultValue={suspend.duration}
                                className={classes.textField}
                                InputLabelProps={{
                                shrink: true,
                                }}
                                onChange={(e)=>{setSuspend(p=>({...p,duration:e.target.value}))}}
                                variant="outlined"
                            />
                        </div>
                    ):<span/>
                }
                <div>
                    <Typography id="auth-modal-title">Authentication</Typography>
                    <TextField1
                        label="email"
                        type="email"
                        variant='outlined'
                        onChange={(e)=>{setSuspend(cred=>({...cred,email:e.target.value}))}}
                        value={suspend.email}
                    />
                    <TextField1
                        label="password"
                        type="password"
                        variant='outlined'
                        onChange={(e)=>{setSuspend(cred=>({...cred,password:e.target.value}))}}
                        value={suspend.password}
                    />
                </div>
                <div className={classes.verifySelectButton}>
                    <Button variant="contained" color="primary" onClick={()=>handleClick('suspend',suspend,props.match.params.id,props.modOpen)}>{suspend.action}</Button>
                </div>
            </div>
        )
    }
}

const UserShowActions = (props) => {
    const classes = useStyles()
    const [mod, modOpen] = useState({open:false,type:''});

    console.log(props)
    return (
    <TopToolbar className={classes.topBar}>
        <Modal
            className={classes.modal}
            open={mod.open}
            onClose={()=>modOpen(p=>({...p,open:false}))}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={mod.open}>
                <div className={classes.paper}>
                    <ModalBody mod={mod} modOpen={modOpen} {...props} />
                </div>
            </Fade>
        </Modal>
        <div className={classes.buttons}>
            <Button variant="outlined" color="primary" onClick={()=>props.history.push(`/users/${props.match.params.id}/works`)}>Update Work</Button>
            <Button variant="outlined" color="primary" onClick={()=>props.history.push(`/users/${props.match.params.id}/orders`)}>Orders</Button>
            <Button variant="outlined" color="primary" onClick={()=>props.history.push(`/users/${props.match.params.id}/createOrder`)}>Create Order</Button>
            <Button variant="outlined" color="primary" onClick={()=>modOpen(p=>({...p,type:'multiOrder',open:true}))}>Verify Supplier</Button>
            <Button variant="outlined" color="primary" onClick={()=>modOpen(p=>({...p,type:'suspend',open:true}))}>Suspend/Ban</Button>
        </div>
        <EditButton {...props} />
    </TopToolbar>
)};

const AdminField = ({ source, record }) =>{
    if(record.isAdmin.value===undefined){
        return (
            <div style={{display:'flex',justifyContent:'center',flexDirection:'column'}}>
                <span style={{'font-size':12,opacity:0.6}}>isAdmin</span>
                <Clear/>
            </div>
        )
    }
    else{
        return (
            <div style={{display:'flex',justifyContent:'center',flexDirection:'column'}}>
                <span style={{'font-size':12,opacity:0.6}}>isAdmin</span>
                <Check/>
            </div>
        )
    }
}

const UserShow = (props) => {

    return (
    <Show actions={<UserShowActions {...props} />} {...props}>
        <SimpleShowLayout>
            <TextField source="name" label='Name'/>
            <TextField source="email.email" label='Email' />
            <TextField source='mobile' label='Mobile' />
            <BooleanField source='email.confirmed.value' label='Email Verified' emptyText="false"/>
            <TextField source='supplier' label='Supplier' />
            <AdminField source='isAdmin.value' label='Admin' />
        </SimpleShowLayout>
    </Show>
)};

export default UserShow