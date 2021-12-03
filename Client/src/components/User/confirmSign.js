import React,{useState,Fragment, useEffect} from 'react' 
import axios from '../../config/axios'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import {CountryDropdown,RegionDropdown} from 'react-country-region-selector'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import PhoneInput,{isPossiblePhoneNumber} from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import Button from '@mui/material/Button'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import {useDispatch} from 'react-redux'
import {startTokenSetUser} from '../../action/userAction'

/* Component that confirms the email of the user */

function ConfirmSign (props) {
    const [state,setState] = useState({call:false,loading:false})
    const [form,setForm] = useState({country:'',state:'',companyName:'',city:'',street:'',userType:'buyer',phone:undefined,website:'',pin:'',position:'',otp:''})
    const [disabled,setWebsiteDisabled] = useState(false)
    const [open,setOpen] = useState(false)
    const [resendCountdown,setResendCountdown] = useState(60)
    const [intervalId,setIntervalId] = useState('')
    const dispatch = useDispatch()

    useEffect(()=>{
        console.log(intervalId)
        if(resendCountdown===0){
            clearInterval(intervalId)
            setIntervalId('')
        }
    },[intervalId,resendCountdown])

    const confirmOTP = () =>{
        if(!intervalId){
            setResendCountdown(59)
            axios.post(`/user/sendOtp/${props.match.params.token}`,{mobile:form.phone})
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
        if(form.otp&&form.otp.length===6){
            axios.post(`/user/confirmSign/${props.match.params.token}`,form)
            .then((response)=>{
                console.log(response)
                if(response.data.status&&response.data.payload.token){
                    if(response.data.payload.token){
                        localStorage.setItem('x-auth',response.data.payload.token)
                    }
                    setOpen(false)
                    setState({call:true,loading:false})
                }
                else{
                    setState({loading:false})
                }
            })
            .catch((err)=>{
                console.log(err)
                setState({...state,loading:false})
            })
        }
        else{
            console.log('Otp error')
        }
    }


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

    if(!state.loading){
        if(!state.call){
            return(
                <div style={{display:'flex',flexDirection:'column',width:500,rowGap:20,margin:20}}>
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
                                        value={form.otp}
                                        onChange={(e)=>{e.persist();setForm({...form,otp:e.target.value})}}
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
                    <TextField 
                        variant='outlined'
                        color='primary'
                        label='Company Name'
                        value={form.companyName}
                        onChange={(e)=>{e.persist();setForm({...form,companyName:e.target.value})}}
                    />
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Choose Trade role</FormLabel>
                        <RadioGroup
                            row
                            aria-label="Select Trade Role"
                            name="controlled-radio-buttons-group"
                            value={form.userType}
                            onChange={(e)=>{setForm({...form,userType:e.target.value})}}
                        >
                            <FormControlLabel value="buyer" control={<Radio />} label="Buyer" />
                            <FormControlLabel value="supplier" control={<Radio />} label="Supplier" />
                            <FormControlLabel value="both" control={<Radio />} label="Both" />
                        </RadioGroup>
                    </FormControl>
                    <TextField 
                        variant='outlined'
                        color='primary'
                        label='Street'
                        value={form.street}
                        onChange={(e)=>{e.persist();setForm({...form,street:e.target.value})}}
                    />
                    <CountryDropdown 
                        value={form.country}
                        onChange={(e)=>{setForm({...form,country:e})}}
                    />
                    <RegionDropdown 
                        value={form.state}
                        country={form.country}
                        onChange={(e)=>{setForm({...form,state:e})}}
                    />
                    <TextField 
                        variant='outlined'
                        color='primary'
                        label='City'
                        value={form.city}
                        onChange={(e)=>{e.persist();setForm({...form,city:e.target.value})}}
                    />
                    <TextField 
                        variant='outlined'
                        color='primary'
                        label='Postal or Zip'
                        value={form.pin}
                        onChange={(e)=>{e.persist();setForm({...form,pin:e.target.value})}}
                    />
                    <PhoneInput
                        international
                        defaultCountry="US"
                        countryCallingCodeEditable={false}
                        value={form.phone}
                        onChange={(e)=>{setForm({...form,phone:e,otp:''})}}
                    />
                    {
                        form.userType==='supplier'||form.userType==='both'?(
                            <Fragment>
                                <TextField 
                                    variant='outlined'
                                    color='primary'
                                    label='Position'
                                    value={form.position}
                                    onChange={(e)=>{e.persist();setForm({...form,position:e.target.value})}}
                                />
                                <div>
                                    <TextField
                                        style={{marginRight:20}}
                                        variant='outlined'
                                        disabled={disabled}
                                        color='primary'
                                        label='Website'
                                        value={form.website}
                                        onChange={(e)=>{e.persist();setForm({...form,website:e.target.value})}}
                                    />
                                    <FormControlLabel control={<Switch onClick={()=>{setForm({...form,website:disabled?'':'None'});setWebsiteDisabled(disabled?false:true)}}/>} label="I don't have a wesbite" />
                                </div>
                            </Fragment>
                        ):<span/>
                    }
                    <Button color='primary' variant='contained' onClick={confirmOTP} style={{width:200}}>Confirm</Button>
                </div>
            )
        }
        else{
            dispatch(startTokenSetUser(localStorage.getItem('x-auth'),()=>{props.history.replace('/')}))
            return <CircularProgress/>
        }
    }
    else{
        return(
            <div>
                <CircularProgress/>
            </div>
        )
    }
}

export default ConfirmSign
