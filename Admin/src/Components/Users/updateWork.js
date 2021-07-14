import React,{Fragment, useEffect, useState} from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Title,SimpleForm,FormDataConsumer,TextInput,SelectArrayInput,NumberInput,BooleanInput,SelectInput } from 'react-admin';
import axios from '../../config/Axios'

/* check initial value persistence when works are changed */

const ArrayWorks = (props)=>{
    const {work} = props
    if(work&&work.options){
        return work.options.params.map((param,index)=>{
            if(param.tierType===true){
                const choices = param.values.map((value,index)=>{
                    return (
                        {
                            _id:value._id,
                            label:value.label
                        }
                    )
                })
                return (
                    <Fragment key={param._id}>
                        <TextInput initialValue={param._id} source={`options.params[${index}]._id`} options={{disabled:true}} label='Param id'/>
                        <br></br>
                        <TextInput initialValue={param.title} source={`options.params[${index}].title`} options={{disabled:true}} label='Param title'/>
                        <br></br>
                        <BooleanInput defaultValue={param.tierType} source={`options.params[${index}].tierType`} disabled label='Tier type'/>
                        <br></br>
                        <SelectArrayInput source={`options.params[${index}].values`} choices={choices} optionText='label' optionValue='_id' label='Param values'/>
                        <br></br>
                    </Fragment>
                )
            }
            else{
                return (
                    <Fragment key={param._id}>
                        <TextInput initialValue={param._id} source={`options.params[${index}]._id`} options={{disabled:true}} label='Param id'/>
                        <br></br>
                        <TextInput initialValue={param.title} source={`options.params[${index}].title`} options={{disabled:true}} label='Param title'/>
                        <br></br>
                        <TextInput initialValue={param.values[0]._id} source={`options.params[${index}].values[${0}]._id`} options={{disabled:true}} label='Value id'/>
                        <br></br>
                        <NumberInput initialValue={param.values[0].min} source={`options.params[${index}].values[${0}].min`} label='Minimum'/>
                        <br></br>
                        <NumberInput initialValue={param.values[0].max} source={`options.params[${index}].values[${0}].max`} label='Maximum'/>
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
    const token = sessionStorage.getItem('token')
    switch(data.select){
        case 'update':
            data.options.userWork = props.match.params.id
            data.workId = data.options.workId
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
        case 'delete':
            axios.post(`/user/${props.match.params.id}/work`,{
                select:data.select,
                workId:data.options.workId
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
        break;
        default:
            console.log('Invalid option')
    }
}

const AddWork = (props) => {
    const [work,setWork] = useState({})

    useEffect(()=>{
        const token = sessionStorage.getItem('token')
        axios.get(`/works/${props.match.params.workId}`,{
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
    },[props.match.params.workId,setWork])

    if(work){
        return(
            <Card>
                <CardContent>
                    <Title title="Update Work"/>
                    <SimpleForm submitOnEnter={false} save={(data)=>Save(data,props)}>
                        <SelectInput initialValue='update' source="select" choices={[
                            { id: 'update', name: 'Update' },
                            { id: 'delete', name: 'Delete' }
                        ]} />
                         <FormDataConsumer>
                            {
                                (props)=>{
                                    if(props.formData&&props.formData.options){
                                        console.log(props.formData)
                                        props.formData.options.workId = work._id
                                        props.formData.options.workTitle = work.title
                                        props.formData.options._id = work.options._id
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
                        <BooleanInput initialValue={false} source={`verified`} label='Verified'/>
                    </SimpleForm>
                </CardContent>
            </Card>
        )
    }
    else{
        return (
            <Card>
                <CardContent>
                    <Title title="Update Work"/>
                </CardContent>
            </Card>
        )
    }
};

export default AddWork;