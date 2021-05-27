import React,{useEffect,useState} from "react";
import { Create, SimpleForm, TextInput, FormDataConsumer,SelectInput} from 'react-admin';
import axios from '../../config/Axios'

const TypesInput = (props) =>{
    const [data,setData] = useState([])
    console.log(props)
    useEffect(()=>{
        const token = sessionStorage.getItem('token')
        axios.get('/types',{
            headers:{
                'x-admin':token
            }
        })
        .then((response)=>{
            setData(response.data)
        })
    },[])
    if(data){
        return <SelectInput source='type' choices={data} optionText="title" optionValue="_id" label="Type"/>
    }
}

const CategoriesCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="hscode" />
            <FormDataConsumer>
                {
                    (formProps)=>{
                        return <TypesInput form={formProps}/>
                    }
                }
            </FormDataConsumer>
        </SimpleForm>
    </Create>
);

export default CategoriesCreate