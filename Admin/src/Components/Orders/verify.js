import React,{useEffect, useState} from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles';
import { Title, useQuery, Loading } from 'react-admin';
import axios from '../../config/Axios';
import DataTable from './subOrderTable';

const useStyles = makeStyles((theme)=>({
    column:{
        'display':'flex',
        'flexDirection':'column',
        'alignItems':'center'
    },
    content:{
        'display':'flex',
        'flexDirection':'row',
        'justifyContent':'space-between'
    },
    header:{
        'padding':5
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
    }
})
)

function Verify(props){
    const classes = useStyles()
    const [cred,setCred] = useState({email:'',password:'',orderId:''})
    const [open,setOpen] = useState(false)
    const { data, loading, error } = useQuery({ 
        type: 'getOne',
        resource: `orders`,
        payload: { id: props.match.params.id}
    });
    useEffect(()=>{
        if(data&&data.subOrders.length===0){
            props.history.replace(`/orders/hosts/${data._id}`)//redirect to host selection directly
        }
    },[data,props.history])

    const handleClick = (orderId,email,password) =>{
        const token = sessionStorage.getItem('token')
        axios.post(`/orders/${orderId}/orderfn`,{email,password,type:'complete'},
        {
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
    }

    if (loading){ return <Loading/> }
    if (error){ console.log(error)}
    if (!data) return null;

    console.log(data)

    if(data.subOrders.length===0){
        return null
    }
    else{
        //fix multiple title
        return (
            <Card>
                <Modal
                    aria-labelledby="transition-modal-title"
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
                            <Typography id="auth-modal-title">Authentication</Typography>
                            <TextField
                                label="email"
                                type="email"
                                variant='outlined'
                                onChange={(e)=>{const val = e.target.value;setCred(cred=>({...cred,email:val}))}}
                                value={cred.email}
                            />
                            <TextField
                                label="password"
                                type="password"
                                variant='outlined'
                                onChange={(e)=>{const val = e.target.value;setCred(cred=>({...cred,password:val}))}}
                                value={cred.password}
                            />
                            <Button color='primary' variant='outlined' onClick={()=>{handleClick(cred.orderId,cred.email,cred.password);setOpen(false)}}>Confirm</Button>
                        </div>
                    </Fade>
                </Modal>
                <CardHeader 
                    action={
                        <Button variant='outlined' color='primary' >ADD</Button>
                    }
                />
                <Title title='Sub Orders' />
                <CardContent>
                    <DataTable subOrders={data.subOrders} setCred={setCred} setOpen={setOpen} {...props}/>
                </CardContent>
            </Card> 
        )
    }   
}

export default Verify