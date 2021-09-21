import React,{useState,Fragment} from 'react' 
import axios from '../../config/axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import {CountryDropdown,RegionDropdown} from 'react-country-region-selector'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';
import PhoneInput,{isPossiblePhoneNumber} from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import Button from '@material-ui/core/Button'

/* Component that confirms the email of the user */

function ConfirmSign (props) {
    const [state,setState] = useState({call:false,loading:false,data:{}})
    const [form,setForm] = useState({country:'',state:'',companyName:'',city:'',street:'',userType:'buyer',phone:undefined,website:'',pin:'',position:''})
    const [disabled,setWebsiteDisabled] = useState(false)

    const handleSubmit = () =>{
        axios.post(`/user/confirmSign/${props.match.params.token}`,form)
            .then((response)=>{
                console.log(response)
                if(response.data.status){
                    setState({call:true,loading:false,data:response.data})
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

    if(!state.loading){
        if(!state.call){
            return(
                <div style={{display:'flex',flexDirection:'column',width:500,rowGap:20,margin:20}}>
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
                        onChange={(e)=>{console.log(e);setForm({...form,phone:e})}}
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
                    <Button color='primary' variant='contained' onClick={handleSubmit} style={{width:200}}>Confirm</Button>
                </div>
            )
        }
        else{
            return(
                <div>
                    <p>Successfully Completed Signup. Redirecting </p>
                    {
                        setTimeout(()=>{
                            props.history.replace('/user/login')
                        },4000)
                    }
                </div>
            )
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
