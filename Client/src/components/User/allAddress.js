import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import { makeStyles } from '@mui/styles';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import axios from '../../config/axios'
import { removeAddress } from '../../action/userAction';
import CircularProgress from '@mui/material/CircularProgress';

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
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  }
}));

const Addresses = (props) =>{
    const user = useSelector((state)=>state.user)
    const dispatch = useDispatch()
    const classes = useStyles()
    const [open, setOpen] = React.useState(false);
    const [selectedAddress,setSelectedAddress] = useState('')

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (addressId) =>{
    const token = localStorage.getItem('x-auth')
    const user = localStorage.getItem('user')
    axios.post(`/user/removeAddress/${addressId}`,{},{
        headers:{
            'x-auth':token,
            'userId':user
        }
    })
    .then((response)=>{
        console.log('success')
    })
    .catch((err)=>{
        console.log(err)
    })
    dispatch(removeAddress(addressId))
    handleClose()
}
    
    console.log(user)
    if(!user.address){
        return(
            <div className={classes.root}>
                <CircularProgress />
            </div>
        )
    }
    else{
        return (
            <div>
                <div style={{display:'flex',flexDirection:'row',alignItems:'center',columnGap:15}}>
                    <h1>All Addresses</h1>
                    <Button style={{height:35}} variant='contained' color='primary' onClick={()=>{props.history.push('/user/addAddress')}}> Add address</Button>
                </div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={open}>
                    <div className={classes.paper}>
                        <h2>Are you sure</h2>
                        <Button variant='contained' color='primary' onClick={()=>{handleClick(selectedAddress)}} >Confirm</Button>
                    </div>
                    </Fade>
                </Modal>
                {
                    user.address.map((addressEle)=>{
                        return(
                            <div style={{display:'flex',flexDirection:'row'}} key={addressEle._id}>
                                <div>
                                    <div>{addressEle.building + ', ' + addressEle.street + ', ' + addressEle.city + ', ' + addressEle.pin}</div>
                                    <div>{addressEle.state}</div>
                                    <div>{addressEle.country}</div>
                                </div>
                                <div>
                                    <Button variant='contained' color='primary' onClick={()=>{handleOpen();setSelectedAddress(addressEle._id)}} >Remove</Button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default Addresses