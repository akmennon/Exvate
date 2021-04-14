import React from "react";
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
    email
} from 'react-admin';
import {useFormState} from 'react-final-form'

const HostInput = props =>{
    const { values } = useFormState()

    if(values.userType==="Organizer"){
        return null
    }
    else{
        return(
            <BooleanInput source="host" defaultValue={false} {...props}/>
        )
    }
}

const UserCreate = (props) => {
    return (
        <Create {...props}>
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
                    <HostInput />
                </FormTab>
                <FormTab label="Permission">
                    <BooleanInput source="perms.host.multipleWorks.value" label="Multiple works" defaultValue={false}/>
                    <BooleanInput source="perms.host.multiWork.value" label="Multi work" defaultValue={false}/>
                </FormTab>
            </TabbedForm>
        </Create>
    )
}

export default UserCreate