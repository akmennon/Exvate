import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import axios from '../../../config/axios'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Backdrop from '@mui/material/Backdrop';
import PhoneInput,{isPossiblePhoneNumber} from 'react-phone-number-input'
import { changeProfileValue } from '../../../action/profileAction'
import { useNavigate } from 'react-router-dom'

export default function EditCompanyDetails (props){
    const profile = useSelector((state)=>state.profile)
    const [mobile,setMobile] = useState(undefined)
    const [otp,setOtp] = useState('')
    const [open,setOpen] = useState(false)
    const [resendCountdown,setResendCountdown] = useState(60)
    const [intervalId,setIntervalId] = useState('')
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    useEffect(()=>{
        if(resendCountdown===0&&intervalId){
            clearInterval(intervalId)
            setIntervalId('')
        }

        return function cleanup(){
            if(loading){
                console.log('it worked')
                clearInterval(intervalId)
            }
        }
    },[intervalId,resendCountdown,loading])

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    const confirmOTP = (e) =>{
        setOtp('')
        const token = localStorage.getItem('x-auth')
        const user = localStorage.getItem('user')
        if(!intervalId){
            setResendCountdown(59)
            axios.post('/user/editProfile/changeMobile',{payload:{mobile},profileToken:profile.profileChangeToken.value},{
                headers:{
                    'x-auth':token,
                    'userId':user
                }
            })
            .then((response)=>{
                setOpen(true)
                const intId = setInterval(()=>{
                    setResendCountdown((prev)=>{
                        if(prev){
                            return prev-1
                        }
                        else{
                            return prev
                        }
                    })
                },1000)
                setIntervalId(intId)
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        else{
            setOpen(true)
        }
    }

    const handleSubmit = () =>{
        if(otp&&otp.length===6){
            const token = localStorage.getItem('x-auth')
            const user = localStorage.getItem('user')
            axios.post('/user/editProfile/changeMobileConfirm',{payload:{otp},profileToken:profile.profileChangeToken.value},{
                headers:{
                    'x-auth':token,
                    'userId':user
                }
            })
            .then((response)=>{
                if(response.data.status){
                    setLoading(true)
                    dispatch(changeProfileValue({mobile:mobile}))
                    setTimeout(()=>{
                        navigate('/user/editProfile')
                    },3000)
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        else{
            console.log('otp error')
        }
    }

    if(!profile.email){
        setTimeout(()=>{
            navigate('/user/editProfilePassword',{replace:true})
        },2000)
        return <CircularProgress/>
    }
    else{
        if(loading===true){
            return <CircularProgress/>
        }
        else{
            return(
                <div style={{display:'flex',flexDirection:'column',margin:20,rowGap:10}}>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={open}
                        onClose={()=>{setOpen(false)}}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                        timeout: 500,
                        }}
                    >
                        <Fade in={open}>
                            <Box sx={style}>
                                <Typography variant="h6" component="h2">
                                    Mobile OTP Verification
                                </Typography>
                                <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                                    Please enter the six digit code sent to your mobile number
                                </Typography>
                                <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'}}>
                                    <Typography>Code</Typography>
                                    <TextField
                                        value={otp}
                                        onChange={(e)=>{e.persist();setOtp(e.target.value)}}
                                        variant='outlined'
                                        color='primary'
                                        label='OTP'
                                    />
                                    <Button disabled={resendCountdown===0||resendCountdown===60?false:true} onClick={()=>{setResendCountdown(59);confirmOTP()}}>Resend{resendCountdown>0&&resendCountdown!==60?` ${resendCountdown}`:null} </Button>
                                </div>
                                <div style={{display:'flex',justifyContent:'flex-end',margin:10}}>
                                    <Button color='primary' variant='contained' onClick={handleSubmit}>Confirm</Button>
                                </div>
                            </Box>
                        </Fade>
                    </Modal>
                    <PhoneInput
                        international
                        defaultCountry="US"
                        countryCallingCodeEditable={false}
                        value={mobile}
                        onChange={(e)=>{setMobile(e)}}
                    />
                    <Button variant='contained' color='primary' onClick={confirmOTP} >Confirm</Button>
                </div>
            )
        }
    }
}