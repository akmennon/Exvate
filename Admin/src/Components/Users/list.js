import React from 'react';
import { List, Datagrid, TextField, BooleanField,EditButton } from 'react-admin';
import Clear from '@material-ui/icons/Clear'
import UserFilter from './filters'

const MobileField = ({ source, record=[] }) =>{
    if(record[source]===undefined){
        return <Clear/>
    }
    else{
        return <span>{record[source]}</span>
    }
}

const SuspensionBoolean = (props) =>{
    if(props.record.perms.user.suspended.value||props.record.perms.user.banned.value){
        props.record.suspended = true
    }
    else{
        props.record.suspended = false
    }
    return <BooleanField {...props} source='suspended'/>
}

const usersList = props => (
   <List {...props} filters={<UserFilter />}>
       <Datagrid rowClick="show">
           <TextField source="name" />
           <TextField source="email.email" label="Email"/>
           <MobileField source="mobile" label="Mobile"/>
           <BooleanField source="supplier" label="Supplier" />
           <TextField source="userType" label="Type" />
           <SuspensionBoolean label='Suspended'/>
           <EditButton/>
       </Datagrid>
   </List>
)

export default usersList