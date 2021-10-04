import React, { useState } from 'react'
import { Show, SimpleShowLayout, TextField, BooleanField,useQuery, ArrayField,Datagrid,Loading,NumberField,EditButton} from 'react-admin';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem'
import axios from '../../config/Axios'
import TextField1 from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types';
import { useRecordContext } from 'react-admin';

/*const imageField = (props) => {
    const { source } = props;
    const record = useRecordContext(props);
    return <img src={record[source]} width="500" height="600"/>
}*/

TextField.propTypes = {
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const WorkShowActions = (props) =>{
    const [open,setOpen] = useState(false)
    const [status,setStatus] = useState('Unlisted')
    const [type,setType] = useState('')
    const [cred,setCred] = useState({email:'',password:''})

    const handleConfirm = () =>{

        const token = sessionStorage.getItem('token')

        switch(type){
            case 'status':
                axios.post(`/works/${props.match.params.id}/changeStatus`,{...cred,status:status},{
                    headers:{
                        'x-admin':token
                    }
                })
                .then((response)=>{
                    setOpen(false)
                })
                .catch((err)=>{
                    console.log(err)
                })
            break;
            case 'image': //Add image pending
                axios.post(`/works/${props.match.params.id}/addImage`,{status:status},{
                    headers:{
                        'x-admin':token
                    }
                })
                .then((response)=>{
                    setOpen(false)
                })
                .catch((err)=>{
                    console.log(err)
                })
            break;
            default:
            console.log('Invalid')
        }
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={()=>setOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={open}>
                <Box sx={style}>
                    {
                        type==='status'?(
                            <div>
                                <div style={{display:'flex',flexDirection:'row',alignItems:'center',columnGap:20}}>
                                    <Typography>Status</Typography>
                                    <Select
                                        value={status}
                                        onChange={(e)=>setStatus(e.target.value)}
                                    >
                                        <MenuItem value={'Unlisted'}>Unlisted</MenuItem>
                                        <MenuItem value={'Available'}>Available</MenuItem>
                                        <MenuItem value={'Unavailable'}>Unavailable</MenuItem>
                                    </Select>
                                </div>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <TextField1 
                                        value={cred.email}
                                        type='email'
                                        label='Email'
                                        onChange={(e)=>{e.persist();setCred({...cred,email:e.target.value})}}
                                    />
                                    <TextField1 
                                        value={cred.password}
                                        type='password'
                                        label='Password'
                                        onChange={(e)=>{e.persist();setCred({...cred,password:e.target.value})}}
                                    />
                                    <Button color="primary" variant='outlined' onClick={() => {setType('status');handleConfirm()}}>Confirm</Button>
                                </div>
                            </div>
                        ):
                        type==='image'?(
                            <div>
                                <input type='file' accept='image/*' name='Work Image'/>
                            </div>
                        ):<span/>
                    }
                </Box>
                </Fade>
            </Modal>
            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                <Button color="primary" variant='outlined' onClick={() => {setType('status');setOpen(true)}}>Edit Status</Button>
                <Button color="primary" variant='outlined' onClick={() => {setType('image');setOpen(true)}}>Add Image</Button>
                <EditButton {...props}/>
            </div>
        </div>
    )
}

const ParamValues = (props) =>{
    console.log(props)
    if(props.record.tierType){
        return(
            <ArrayField source="values" {...props}>
                <Datagrid>
                    <TextField source="label" label="Label" />
                    <TextField source="desc" label="Desc" />
                    <BooleanField source="initial" label="Initial" />
                    <NumberField source="value" label="Value" />
                    <NumberField source="time" label="Time" />
                </Datagrid>
            </ArrayField>
        )
    }
    else{
        return(
            <ArrayField source="values" {...props}>
                <Datagrid>
                    <BooleanField source="amount" label="Amount" />
                    <NumberField source="min" label="Minimum" />
                    <NumberField source="max" label="Maximum" />
                    <NumberField source="value" label="Initial" />
                    <NumberField source="time" label="Time" />
                </Datagrid>
            </ArrayField>
        )
    }
}

const Array = (props) =>{
    if(props.record.options.length>1){
        return (
            <ArrayField {...props} source="options.options">
                <Datagrid rowClick={(e)=>{const val = JSON.parse(e);props.history.push(`/works/${val.workId}/show`)}}>
                    <TextField source='workTitle' label='Work Title'/>
                </Datagrid>
            </ArrayField>
        )
    }
    else{
        const newProps = props
        return(
            <SimpleShowLayout {...newProps} >
                <ArrayField {...newProps} source="options.params" label="Params">
                    <Datagrid expand={<ParamValues/>}>
                        <TextField source='title' label='Title'/>
                        <BooleanField source='tierType' label='Tier Type'/>
                        <TextField source='desc' label='Description'/>
                        <TextField source='optionType' label='Option'/>
                    </Datagrid>
                </ArrayField>
            </SimpleShowLayout>
        )
    }
}

const WorkShow = (props) => {
    const { data, loading, error } = useQuery({ 
        type: 'getOne',
        resource: props.resource,
        payload: { id: props.id }
    });

    if (loading) return <Loading />;
    if (error){console.log(error)};
    if (!data) return null;
    
    const newProps = {...props,record:data}
    
    return (
    <Show {...newProps} actions={<WorkShowActions {...newProps} />}>
        <SimpleShowLayout>
            <TextField source="title" label='Title'/>
            <TextField source="status" label='Status'/>
            <TextField source="category.title" label='Category'/>
            <TextField source="type.title" label='Type'/>
            <Array history={props.history} {...newProps}/>
        </SimpleShowLayout>
    </Show>
)};

export default WorkShow