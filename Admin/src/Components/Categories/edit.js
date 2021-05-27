import React,{useState,useEffect} from "react";
import axios from '../../config/Axios'
import { Edit, SimpleForm, TextInput, SelectInput, FormDataConsumer} from 'react-admin';

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

const CategoriesEdit = (props) => (
    <Edit {...props}>
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
    </Edit>
);

export default CategoriesEdit