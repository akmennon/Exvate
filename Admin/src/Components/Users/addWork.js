import React,{Fragment, useEffect, useState} from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Title,SimpleForm,AutocompleteInput,FormDataConsumer,ArrayInput,SimpleFormIterator,TextInput,SelectArrayInput,NumberInput,BooleanInput } from 'react-admin';
import axios from '../../config/Axios'

/* MULTI WORK - PENDING DECISION (IF REQUIRED OR NOT) */
/* check initial value persistence when works are changed */

const SelectorInput = (props) =>{
    const [data,setData] = useState([])
    useEffect(()=>{
        const token = sessionStorage.getItem('token')
        axios.get('/searchWorks',{
            headers:{
                'x-admin':token
            }
        })
        .then((response)=>{
            setData(response.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    },[])
    if(data.length!==0){
        return <AutocompleteInput source={props.source} choices={data} optionValue='_id' optionText='title' suggestionLimit={4} label='Work'/>
    }
    else{
        return null
    }
}

const GetOptions = (props) =>{
    let workId = ''
    if(props.scopedFormData&&props.scopedFormData.workId){
        workId = props.scopedFormData.workId
    }
    const {setWork} = props
    useEffect(()=>{
        if(workId){
            const token = sessionStorage.getItem('token')
            axios.get(`/works/${workId}`,{
                headers:{
                    'x-admin':token
                }
            })
            .then((response)=>{
                console.log(response.data)
                setWork(response.data)
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    },[workId,setWork])
    return null
}

const ArrayWorks = (props)=>{
    const {work} = props
    if(work&&work.options){
        return work.options.options.map((option)=>{
            return option.params.map((param,index)=>{
                if(param.tierType===true){
                    const choices = param.values.map((value,index)=>{
                        return (
                            {
                                label:value.label,
                                value:value
                            }
                        )
                    })
                    return (
                        <Fragment key={param._id}>
                            <TextInput initialValue={param.title} source={props.getSource(`params[${index}].title`)} options={{disabled:true}} label='Param title'/>
                            <br></br>
                            <BooleanInput defaultValue={param.tierType} source={props.getSource(`params[${index}].tierType`)} options={{disabled:true}} label='Tier type'/>
                            <br></br>
                            <SelectArrayInput source={props.getSource(`params[${index}].values`)} choices={choices} optionText='label' optionValue='value' label='Param values'/>
                            <br></br>
                        </Fragment>
                    )
                }
                else{
                    console.log(param)
                    return (
                        <Fragment key={param._id}>
                            <TextInput initialValue={param.title} source={props.getSource(`params[${index}].title`)} options={{disabled:true}} label='Param title'/>
                            <br></br>
                            <NumberInput initialValue={10} source={props.getSource(`params[${index}].values[${0}].min`)} label='Minimum'/>
                            <br></br>
                            <NumberInput initialValue={100} source={props.getSource(`params[${index}].values[${0}].max`)} label='Maximum'/>
                            <br></br>
                            <NumberInput initialValue={param.values[0].time} source={props.getSource(`params[${index}].values[${0}].time`)} options={{disabled:true}} label='Time'/>
                            <br></br>
                            <BooleanInput initialValue={param.values[0].amount} source={props.getSource(`params[${index}].values[${0}].amount`)} label='Amount'/>
                            <br></br>
                        </Fragment>
                    )
                }
            })
        })
    }
    else{
        return <div/>
    }
}

const Save = (data,props) =>{
    data.options.options[0].userWork = props.match.params.id
    data.workId = data.options.options[0].workId
    const token = sessionStorage.getItem('token')
    return axios.post(`/user/${props.match.params.id}/work`,{
        ...data
    },{
        headers:{
            'x-admin':token
        }
    })
    .then((response)=>{
        console.log(response.data)
        props.history.goBack()
    })
    .catch((err)=>{
        console.log(err)
    })
}

const AddWork = (props) => {
    const [work,setWork] = useState({})
    return(
        <Card>
            <CardContent>
                <Title title="Add Work"/>
                <SimpleForm submitOnEnter={false} save={(data)=>Save(data,props)} >
                    <ArrayInput source='options.options' label='Options'>
                        <SimpleFormIterator>
                            <FormDataConsumer>
                                {
                                    (props)=>{
                                        return <SelectorInput {...props} source={props.getSource('workId')}/>
                                    }
                                }
                            </FormDataConsumer>
                            <FormDataConsumer>
                                {
                                    (props)=>{
                                        return <GetOptions {...props} setWork={setWork} source={props.getSource('')}/>
                                    }
                                }
                            </FormDataConsumer>
                            <FormDataConsumer>
                                {
                                    (props)=>{
                                        if(props.scopedFormData){
                                            props.scopedFormData.workTitle = work.title
                                            return <TextInput source={props.getSource('workTitle')} options={{disabled:true}}label="Work Title"/>
                                        }
                                        return null
                                    }
                                }
                            </FormDataConsumer>
                            <FormDataConsumer>
                                {
                                    (props)=>{
                                        return <ArrayWorks work={work} source={props.getSource('')} {...props}/>
                                    }
                                }
                            </FormDataConsumer>
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </CardContent>
        </Card>
    )
};

export default AddWork;