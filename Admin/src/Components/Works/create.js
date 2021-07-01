import React,{ useState,useEffect } from "react";
import {
    TabbedForm,
    FormTab,
    Create,
    TextInput,
    BooleanInput,
    ArrayInput,
    SimpleFormIterator,
    SelectInput,
    minLength,
    maxLength,
    required,
    NumberInput,
    minValue,
    maxValue,
    Toolbar,
    SaveButton,
    FormDataConsumer,
    CheckboxGroupInput
} from 'react-admin';
import axios from "../../config/Axios";
import get from "lodash/get"

const SelectorInput = React.memo((props) =>{
    console.log('rendered')
    const [data,setData] = useState([])
    const res = props.res
    useEffect(()=>{
        const token = sessionStorage.getItem('token')
        axios.get(`/${res}`,{
            headers:{
                'x-admin':token
            }
        })
        .then((response)=>{
            setData(response.data)
        })
    },[res])
    return(
        <SelectInput source={props.source} label={props.label} choices={data} optionText="title" optionValue="_id"/>
    )
},(prevProps,nextProps)=>{
    if(prevProps.formData&&nextProps.formData){
        return prevProps.formData[prevProps.source]!==nextProps.formData[nextProps.source]?false:true
    }
    else{
        return prevProps.formData||nextProps.formData?false:true
    }
})

const WorkCreateToolbar = props => {
    return(
        <Toolbar {...props}>
            <SaveButton submitOnEnter={false} />
        </Toolbar>
    )
}

const InitialInput = (props) =>{
    const valueIndex = props.id.indexOf('value')
    const paramPath = props.id.slice(0,valueIndex-1)
    const param = get(props.formData,paramPath)
    if(param){
        if(param.values[0]!==undefined){
            if(param.values.find((val)=>{return val&&val.initial})){
                if(props.scopedFormData&&props.scopedFormData.initial){
                    return <BooleanInput source={props.getSource("initial")} label="Initial?" defaultValue={false}/>
                }
                else{
                    return <span/>
                }
            }
            else{
                return <BooleanInput source={props.getSource("initial")} label="Initial?" defaultValue={false}/>
            }
        }
        else{
            return <BooleanInput source={props.getSource("initial")} label="Initial?" defaultValue={false}/>
        }
    }
    else{
        return <span/>
    }
}

const ValueInput = React.memo((props) =>{
    console.log('valueInput')
    if(props.scopedFormData){
        if(props.scopedFormData.tierType===true){
            return(
                <ArrayInput label="Values" source={props.getSource("values")}>
                    <SimpleFormIterator>
                        <NumberInput source="value" label="Value" validate={[minValue(1),maxValue(10000000)]}/>
                        <NumberInput source="time" label="Time" validate={[minValue(1),maxValue(10000000)]}/>
                        <TextInput source="label" label="Value label" validate={[required(),minLength(2),maxLength(30)]}/>
                        <TextInput source="desc" label="Value description" validate={[required(),minLength(2),maxLength(30)]}/>
                        <FormDataConsumer>
                            {
                                (props)=>{
                                    return <InitialInput {...props} source={props.getSource()}/>
                                }
                            }
                        </FormDataConsumer>
                    </SimpleFormIterator>
                </ArrayInput>
            )
        }
        else{
            return(
                <ArrayInput label="Values" source={props.getSource("values")}>
                    <SimpleFormIterator>
                        <NumberInput source="min" label="Minimum value" validate={[minValue(1),maxValue(100000)]}/>
                        <NumberInput source="max" label="Maximum value" validate={[minValue(2),maxValue(10000000)]}/>
                        <NumberInput source="value" label="Initial Value" validate={[minValue(1),maxValue(10000000)]}/>
                        <NumberInput source="time" label="Time" validate={[minValue(1),maxValue(10000000)]}/>
                        <BooleanInput source="amount" label="Amount?" defaultValue={false}/>
                    </SimpleFormIterator>
                </ArrayInput>
            )
        }
    }
    else{
        return <span/>
    }
},(prevProps,nextProps)=>{
    if(prevProps.scopedFormData !== nextProps.scopedFormData){
        return false
    }
    else{
        return true
    }
})//done

const CalcKeysInput = React.memo((props) =>{
    if(props.formData.options!==undefined&&props.formData.options.params){
        const option = props.formData.options
        const keys = option.params.map((param,index)=>{
            if(param===undefined){
                return {
                    title:'PENDING',
                    id:index
                }
            }
            else if(param.title===undefined){
                return {
                    title:'PENDING',
                    id:index
                }
            }
            else{
                return {
                    title:param.title,
                    id:index
                }
            }
        })
        return(
            <CheckboxGroupInput source={props.getSource('keys')} choices={keys} optionText='title' optionValue='id' label="Options for Calculation"/>
        )
    }
    else{
        return null
    }
},(prevProps,nextProps)=>{
    console.log(nextProps.scopedFormData)
    if(prevProps.scopedFormData&&nextProps.scopedFormData){
        return prevProps.scopedFormData !== nextProps.scopedFormData ? false : true
    }
    else{
        return prevProps.scopedFormData || nextProps.scopedFormData ? false : true
    }
})//done

const WorkCreate = (props) => {
    return (
        <Create {...props} toolbar={<WorkCreateToolbar/>}>
            <TabbedForm >
                <FormTab label="Details">
                    <TextInput source="title" validate={[required(),minLength(3),maxLength(30)]}/>
                    <FormDataConsumer>
                        {
                            (props)=>{
                                return <SelectorInput res="types" source="type" label="Type" {...props} />
                            }
                        }
                    </FormDataConsumer>
                    <FormDataConsumer>
                        {
                            (props)=>{
                                return <SelectorInput res="categories" source="category" label="Category" {...props} />
                            }
                        }
                    </FormDataConsumer>
                </FormTab>
                <FormTab label="Options">
                    <ArrayInput source="options.params" label="Params" >
                        <SimpleFormIterator>
                            <SelectInput source="optionType" label="Option Type" choices={[{type:"slider"}]} optionText="type" optionValue="type"/>
                            <TextInput source="title" label="Option Title" validate={[required(),minLength(2),maxLength(30)]}/>
                            <TextInput source="desc" label="Option description" validate={[required(),minLength(2),maxLength(30)]}/>
                            <TextInput source="unit" label="Unit" validate={[required(),minLength(2),maxLength(30)]}/>
                            <BooleanInput source="tierType" label="Tier Type?" defaultValue={false}/>
                            <FormDataConsumer>
                                {
                                    (props)=>{
                                        return <ValueInput {...props} source={props.getSource('')}/>
                                    }
                                }
                            </FormDataConsumer>
                        </SimpleFormIterator>
                    </ArrayInput>
                </FormTab>
                <FormTab label="Result">
                    <ArrayInput source="result.time.calc" label="Time Calc">
                        <SimpleFormIterator>
                            <SelectInput source="method" label="Calculation method" choices={[
                                {method:'multiply'}
                            ]} optionText="method" optionValue="method"/>
                            <FormDataConsumer>
                                    {
                                        (props)=>{
                                            return <CalcKeysInput {...props} source={props.getSource('keys')}/>
                                        }
                                    }
                            </FormDataConsumer>
                        </SimpleFormIterator>
                    </ArrayInput>
                    <ArrayInput source="result.calc" label="Value Calc">
                        <SimpleFormIterator>
                            <SelectInput source="method" label="Calculation method" choices={[
                                {method:'multiply'},{method:'add'},{method:'subtract'},{method:'divide'}
                            ]} optionText="method" optionValue="method"/>
                            <FormDataConsumer>
                                    {
                                        (props)=>{
                                            return <CalcKeysInput {...props} source={props.getSource('keys')}/>
                                        }
                                    }
                            </FormDataConsumer>
                        </SimpleFormIterator>
                    </ArrayInput>
                </FormTab>
            </TabbedForm>
        </Create>
    )
}

export default WorkCreate