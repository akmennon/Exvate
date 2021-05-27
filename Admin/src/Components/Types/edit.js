import React from "react";
import { Edit, SimpleForm, TextInput} from 'react-admin';

const TypesEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="hscode" />
            <TextInput source="email" type="email"/>
            <TextInput source="password" type="password"/>
        </SimpleForm>
    </Edit>
);

export default TypesEdit