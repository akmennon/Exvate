import React from "react";
import { Create, SimpleForm, TextInput} from 'react-admin';

const TypesCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="email" type="email"/>
            <TextInput source="password" type="password"/>
        </SimpleForm>
    </Create>
);

export default TypesCreate