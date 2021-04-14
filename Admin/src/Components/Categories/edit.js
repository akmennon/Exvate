import React from "react";
import { Edit, SimpleForm, TextInput} from 'react-admin';

const CategoriesEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="title" />
        </SimpleForm>
    </Edit>
);

export default CategoriesEdit