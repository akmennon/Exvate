import React,{Fragment, useEffect, useState} from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Title,SimpleForm,AutocompleteInput,FormDataConsumer,TextInput,SelectArrayInput,NumberInput,BooleanInput } from 'react-admin';
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
        return <AutocompleteInput source='options.workId' choices={data} optionValue='_id' optionText='title' suggestionLimit={4} label='Work'/>
    }
    else{
        return null
    }
}

const GetOptions = (props) =>{
    let workId = ''
    if(props.formData&&props.formData.options&&props.formData.options.workId){
        workId = props.formData.options.workId
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
        return work.options.params.map((param,index)=>{
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
                        <TextInput initialValue={param.title} source={`options.params[${index}].title`} options={{disabled:true}} label='Param title'/>
                        <br></br>
                        <BooleanInput defaultValue={param.tierType} disabled source={`options.params[${index}].tierType`} options={{disabled:true}} label='Tier type'/>
                        <br></br>
                        <SelectArrayInput source={`options.params[${index}].values`} choices={choices} optionText='label' optionValue='value' label='Param values'/>
                        <br></br>
                    </Fragment>
                )
            }
            else{
                console.log(param)
                return (
                    <Fragment key={param._id}>
                        <TextInput initialValue={param.title} source={`options.params[${index}].title`} options={{disabled:true}} label='Param title'/>
                        <br></br>
                        <NumberInput initialValue={10} source={`options.params[${index}].values[${0}].min`} label='Minimum'/>
                        <br></br>
                        <NumberInput initialValue={100} source={`options.params[${index}].values[${0}].max`} label='Maximum'/>
                        <br></br>
                        <NumberInput initialValue={param.values[0].time} source={`options.params[${index}].values[${0}].time`} options={{disabled:true}} label='Time'/>
                        <br></br>
                        <BooleanInput initialValue={param.values[0].amount} disabled source={`options.params[${index}].values[${0}].amount`} label='Amount'/>
                        <br></br>
                    </Fragment>
                )
            }
        })
    }
    else{
        return <div/>
    }
}

const Save = (data,props) =>{
    console.log(data.options)
    data.options.userWork = props.match.params.id
    data.select = 'Add'
    data.workId = data.options.workId
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
                <Title title="Update Work"/>
                <SimpleForm submitOnEnter={false} save={(data)=>Save(data,props)} >
                    <FormDataConsumer>
                        {
                            (props)=>{
                                return <SelectorInput {...props} />
                            }
                        }
                    </FormDataConsumer>
                    <FormDataConsumer>
                        {
                            (props)=>{
                                return <GetOptions {...props} setWork={setWork} />
                            }
                        }
                    </FormDataConsumer>
                    <FormDataConsumer>
                        {
                            (props)=>{
                                if(props.formData&&props.formData.options){
                                    props.formData.options.workTitle = work.title
                                    return <TextInput source='options.workTitle' options={{disabled:true}} label="Work Title"/>
                                }
                                return null
                            }
                        }
                    </FormDataConsumer>
                    <FormDataConsumer>
                        {
                            (props)=>{
                                return <ArrayWorks work={work} {...props}/>
                            }
                        }
                    </FormDataConsumer>
                </SimpleForm>
            </CardContent>
        </Card>
    )
};

export default AddWork;