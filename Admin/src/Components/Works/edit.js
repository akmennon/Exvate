import React,{ useState,useEffect,Fragment } from "react";
import {
    TabbedForm,
    FormTab,
    Edit,
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
    CheckboxGroupInput,
    AutocompleteInput
} from 'react-admin';
import axios from "../../config/Axios";
import get from "lodash/get"

const SelectorInput = React.memo((props) =>{
    const [data,setData] = useState([])
    const res = props.res
    console.log(props)
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
        <SelectInput source={props.source} label={props.label} choices={data} optionText="title" optionValue="_id" />
    )
},(prevProps,nextProps)=>{
    if(prevProps.formData&&nextProps.formData){
        return prevProps.formData[prevProps.source]!==nextProps.formData[nextProps.source]?false:true
    }
    else{
        return prevProps.formData||nextProps.formData?false:true
    }
})

const MultiWorkInput = React.memo((props) =>{
    console.log('multiWorkInput')
    const [data,setData] = useState([])
    useEffect(()=>{
        const token = sessionStorage.getItem('token')
        axios.get('/works',{
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

    if(props.formData.options.options.length>1){
        let value
        return(
            <Fragment>
                <AutocompleteInput choices={data} source={props.getSource("workId")} optionText="title" optionValue="_id" suggestionLimit={4} shouldRenderSuggestions={(input) => { return input.trim().length > 2 }} />
                {
                    props.scopedFormData?
                    (props.scopedFormData.workId?
                        (function(){
                            value = data.find((work)=>{
                                return work._id === props.scopedFormData.workId
                            })
                            if(!value){
                                return <span/>
                            }
                            return <TextInput source={props.getSource("workTitle")} initialValue={value.title}/>
                        })():
                        <span/>):
                    <span/>
                }
            </Fragment>
        )
    }
    else{
        return <span/>
    }
},(prevProps,nextProps)=>{
    if(prevProps.formData.options){
        return nextProps.formData.options?false:true
    }
    if(prevProps.formData.options.options.length!==nextProps.formData.options.options.length){
        return false
    }
    else if(prevProps.scopedFormData !== nextProps.scopedFormData){
        if(prevProps.scopedFormData&&nextProps.scopedFormData){
            if(prevProps.scopedFormData.workId&&nextProps.scopedFormData.workId){
                return prevProps.scopedFormData.workId!==nextProps.scopedFormData.workId?false:true
            }else{
                return prevProps.scopedFormData.workId||nextProps.scopedFormData.workId?false:true
            }
        }
        else{
            return false
        }
    }
    else{
        return true
    }
})//done

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
    let result = Number(props.id.charAt(14)) //finds the result index //this index based checking can break if two results are added for one option
    if(props.formData.options!==undefined&&props.formData.options.options[result]!==undefined&&props.formData.options.options[result].params&&props.formData.result.result[result]){
        const option = props.formData.options.options.find((option)=>{return option.workId===props.formData.result.result[result].workId})
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
        let pathIndex = ''
        if(props.id.indexOf('time')===-1){
            pathIndex = props.id.indexOf('calc')
        }
        else{
            pathIndex = props.id.indexOf('time')
        }
        const path = props.id.slice(0,pathIndex-1)
        const scopedData = get(props.formData,path)
        if(scopedData&&scopedData.preValues!==undefined){
            scopedData.preValues.map((preValue,index)=>{
                keys.push({
                    id:keys.length,
                    title:`Pre Value ${index}`
                })
                return null
            })
            return(
                <CheckboxGroupInput source={props.getSource('keys')} choices={keys} optionText='title' optionValue='id' label="Options for Calculation"/>
            )
        }
        else{
            return(
                <CheckboxGroupInput source={props.getSource('keys')} choices={keys} optionText='title' optionValue='id' label="Options for Calculation"/>
            )
        }
    }
    else{
        return null
    }
},(prevProps,nextProps)=>{
    if(prevProps.scopedFormData&&nextProps.scopedFormData){
        return prevProps.scopedFormData !== nextProps.scopedFormData ? false : true
    }
    else{
        return prevProps.scopedFormData || nextProps.scopedFormData ? false : true
    }
})//done

const PrevInputWork = React.memo((props) =>{
    console.log('prevInputWork')
    if(props.formData.options!==undefined&&props.formData.options.options[0]!==undefined&&props.formData.options.options.length>1){
        const pathIndex = props.id.indexOf('preValues')
        const path = props.id.slice(0,pathIndex-1)
        const scopedData = get(props.formData,path)
        const works = props.formData.options.options.flatMap((workOptions)=>{
            if(workOptions){
                if(workOptions.workId!==scopedData.workId){
                    return [{
                        id:workOptions.workId,
                        title:workOptions.workTitle
                    }]
                }
                else{
                    return[]
                }
            }
            else{
                return [{
                    id:'Id',
                    title:'ADD OR REMOVE OPTIONS'
                }]
            }
        })
        return <SelectInput source={props.getSource("workId")} choices={works} optionValue="id" optionText="title" label="Previous work import"/>
    }
    else{
        return <span/>
    }
},(prevProps,nextProps)=>{
    if(prevProps.scopedFormData !== nextProps.scopedFormData){
        if(prevProps.scopedFormData&&nextProps.scopedFormData){
            return prevProps.scopedFormData.workId !== nextProps.scopedFormData.workId?false:true
        }
        else{
            return prevProps.scopedFormData||nextProps.scopedFormData?false:true
        }
    }
    else{
        return true
    }
})//done

const PrevInputKeys = React.memo((props) =>{
    if(props.formData.options!==undefined&&props.formData.options.options[0]!==undefined&&props.formData.options.options.length>1){
        if(props.scopedFormData){
            if(props.scopedFormData.workId){
                const workId = props.scopedFormData.workId
                const foundWork = props.formData.options.options.find((option)=>{
                    return option.workId === workId
                })
                if(foundWork.params){
                    const keys = foundWork.params.map((param,index)=>{
                        return {
                            id:index,
                            title:param.title
                        }
                    })
                    return <SelectInput source={props.getSource('prevKey')} choices={keys} optionText="title" optionValue="id" label="Work params to import"/>
                }
                else{
                    return <span/>
                }
            }
            else{
                return <span/>
            }
        }
        else{
            return <span/>
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

const ResultWorkInput = (props) =>{
    console.log('resultWorkInput')
    if(props.formData.options!==undefined&&props.formData.options.options[0]!==undefined&&props.formData.options.options.length>1){
        const works = props.formData.options.options.flatMap((option)=>{
            if(props.formData.result.result.length!==0){
                if(props.formData.result.result.length>1){
                    const found = props.formData.result.result.find((result)=>{
                        if(result){
                            if(option.workId===result.workId){
                                return true
                            }
                            else{
                                return false
                            }
                        }
                        else{
                            return false
                        }
                    })
                    if(found){
                        if(props.scopedFormData){
                            if(found.workId===props.scopedFormData.workId){
                                return [{
                                    id:option.workId,
                                    title:option.workTitle
                                }]
                            }
                            else{
                                return[]
                            }
                        }
                        else{
                            return[]
                        }
                    }
                    else{
                        return [{
                            id:option.workId,
                            title:option.workTitle
                        }]
                    }
                }
                else{
                    if(option===undefined){
                        return [{
                            id:'id',
                            title:'Add or remove option'
                        }]
                    }
                    return [{
                        id:option.workId,
                        title:option.workTitle
                    }]
                }
            }
            else{
                return []
            }
        })
        return <SelectInput source={props.getSource('workId')} choices={works} optionText="title" optionValue="id" />
    }
    else{
        return <span/>
    }
}

const WorkEdit = (props) => {
    const transform = (data) =>{
        data.category = data.category._id
        data.type = data.type._id
        return data
    }

    return (
        <Edit {...props} toolbar={<WorkCreateToolbar/>} transform={transform}>
            <TabbedForm >
                <FormTab label="Details">
                    <TextInput source="title" validate={[required(),minLength(3),maxLength(30)]}/>
                    <FormDataConsumer>
                        {
                            (props)=>{
                                return <SelectorInput res="types" source="type._id" label="Type" {...props} />
                            }
                        }
                    </FormDataConsumer>
                    <FormDataConsumer>
                        {
                            (props)=>{
                                return <SelectorInput res="categories" source="category._id" label="Category" {...props} />
                            }
                        }
                    </FormDataConsumer>
                </FormTab>
                <FormTab label="Options">
                    <ArrayInput source="options.options" label="Options">
                        <SimpleFormIterator>
                            <BooleanInput source='hidden' label='Hidden' />
                            <FormDataConsumer>
                                {
                                    (props)=>{
                                        return <MultiWorkInput {...props} source={props.getSource()}/>
                                    }
                                }
                            </FormDataConsumer>
                            <ArrayInput source="params" label="Params" >
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
                        </SimpleFormIterator>
                    </ArrayInput>
                </FormTab>
                <FormTab label="Result">
                    <ArrayInput source="result.result" label="Result">
                        <SimpleFormIterator>
                            <FormDataConsumer>
                                {
                                    (props)=>{
                                        return <ResultWorkInput {...props} source={props.getSource()} />
                                    }
                                }
                            </FormDataConsumer>
                            <ArrayInput source="preValues" label="Pre Work values">
                                <SimpleFormIterator>
                                    <FormDataConsumer>
                                        {
                                            (props)=>{
                                                return <PrevInputWork {...props} source={props.getSource()} />
                                            }
                                        }
                                    </FormDataConsumer>
                                    <FormDataConsumer>
                                        {
                                            (props)=>{
                                                return <PrevInputKeys {...props} source={props.getSource()}/>
                                            }
                                        }
                                    </FormDataConsumer>
                                </SimpleFormIterator>
                            </ArrayInput>
                            <ArrayInput source="time.calc" label="Time Calc">
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
                            <ArrayInput source="calc" label="Value Calc">
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
                        </SimpleFormIterator>
                    </ArrayInput>
                </FormTab>
            </TabbedForm>
        </Edit>
    )
}

export default WorkEdit