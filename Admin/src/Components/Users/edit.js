import React from "react";
import {
    TabbedForm,
    FormTab,
    Edit,
    TextInput,
    BooleanInput,
    NumberInput,
    ArrayInput,
    SimpleFormIterator,
    SelectInput,
    minLength,
    maxLength,
    required,
    email
} from 'react-admin';
import {useFormState} from 'react-final-form'

const SupplierInput = props =>{
    const { values } = useFormState()

    if(values.userType==="Organizer"){
        return null
    }
    else{
        return(
            <BooleanInput source="supplier" defaultValue={false} {...props}/>
        )
    }
}

const WorkLengthInput = props =>{
    const { values } = useFormState()

    if(values.perms.supplier.multipleWorks.value===true){
        return <NumberInput source="perms.supplier.multipleWorks.number" label="Number of works allowed" {...props} min={0} max={0} validate={[required()]} />
    }
    else{
        return null
    }
}

const PermissionsTab = props =>{
    const { values } = useFormState()
    console.log(values)

    if(values.supplier===true){
        return (
            <FormTab label="Permission" {...props} >
                <BooleanInput source="perms.supplier.multipleWorks.value" label="Multiple works" defaultValue={false}/>
                <WorkLengthInput/>
            </FormTab>
        )
    }
    return <span/>
}

const UserEdit = (props) => {
    return (
        <Edit {...props}>
            <TabbedForm >
                <FormTab label="Profile">
                    <TextInput source="name" validate={[required(),minLength(3),maxLength(30)]}/>
                    <TextInput source="email.email" label="Email" type="email" validate={[required(),minLength(1),maxLength(40),email()]}/>
                    <TextInput source="mobile"/>
                </FormTab>
                <FormTab label="Location">
                    <ArrayInput source="address">
                        <SimpleFormIterator>
                            <TextInput source="building" label="Building" validate={[minLength(2),maxLength(30)]}/>
                            <TextInput source="street" label="Street" validate={[minLength(2),maxLength(30)]}/>
                            <TextInput source="city" label="City or District" validate={[minLength(2),maxLength(30)]}/>
                            <TextInput source="state" label="State" validate={[minLength(2),maxLength(30)]}/>
                            <TextInput source="country" label="Country" validate={[minLength(2),maxLength(30)]}/>
                            <TextInput source="pin" label="Pin or Zip" validate={[minLength(2),maxLength(30)]}/>
                        </SimpleFormIterator>
                    </ArrayInput>
                </FormTab>
                <FormTab label="User Type">
                    <SelectInput source="userType" choices={[
                            { id: 'User', type: 'User' },
                            { id: 'Company', type: 'Company' },
                            { id: 'Organizer', type: 'Organizer' },
                        ]} 
                        optionText="type" optionValue="id"
                    />
                    <SupplierInput />
                </FormTab>
                <PermissionsTab/>
            </TabbedForm>
        </Edit>
    )
}

export default UserEdit