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
import { useFilePicker } from 'use-file-picker';
import PropTypes from 'prop-types';
import { useRecordContext } from 'react-admin';

const ImageField = (props) => {
    console.log(props)
    const { source } = props;
    const record = useRecordContext(props);

    return <img src={record[source]} alt='Work pic' height={200} width={300}></img>
}

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
    const [imageDisplay,setImageDisplay] = useState([])
    const [image,setImage] = useState('')
    let imageForm = new FormData()

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
            case 'image':
                imageForm.append('email',cred.email)
                imageForm.append('password',cred.password)
                imageForm.append('image',image)
                console.log(...imageForm)
                axios.post(`/works/${props.match.params.id}/image`,imageForm,{
                    headers:{
                        'x-admin':token,
                        'Content-Type': 'multipart/form-data',
                    }
                })
                .then((response)=>{
                    setOpen(false)
                })
                .catch((err)=>{
                    console.log(err)
                    imageForm = new FormData()
                })
            break;
            default:
            console.log('Invalid')
        }
    }

    const ImageInputRender = (props) =>{
        const [openFileSelector, { filesContent, plainFiles, loading, errors }] = useFilePicker({
            readAs: 'DataURL',
            accept: 'image/*',
            multiple: false,
            // minFileSize: 0.1, // in megabytes
            maxFileSize: 1,
            imageSizeRestrictions: {
              maxHeight: 900, // in pixels
              maxWidth: 1600,
              minHeight: 200,
              minWidth: 200,
            }
        });

        if(plainFiles.length){
            console.log(plainFiles[0])
            setImage(plainFiles[0])
            setImageDisplay(filesContent)
        }

          if (loading) {
            return <div>Loading...</div>;
          }
        
          if (errors.length) {
            return <div>Error...</div>;
          }
        
          return (
            <div>
              <button onClick={() => openFileSelector()}>Select files </button>
              <br />
              {imageDisplay.map((file, index) => (
                <div key={index}>
                  <h2>{file.name}</h2>
                  <img alt={file.name} src={file.content}></img>
                  <br />
                </div>
              ))}
            </div>
          );
    }

    console.log(props)
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
                                <ImageInputRender />
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
                                <Button color="primary" variant='outlined' onClick={() => {setType('image');handleConfirm()}}>Confirm</Button>
                            </div>
                        ):<span/>
                    }
                </Box>
                </Fade>
            </Modal>
            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                <div>
                    <Button color="primary" variant='outlined' onClick={() => {setType('status');setOpen(true)}}>Edit Status</Button>
                    <Button color="primary" variant='outlined' onClick={() => {setType('image');setOpen(true)}}>{props.record.imagePath?'Change Image':'Add Image'}</Button>
                </div>
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
            <ImageField source='imagePath' label='Image' />
            <Array history={props.history} {...newProps}/>
        </SimpleShowLayout>
    </Show>
)};

export default WorkShow