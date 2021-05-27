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

const usersList = props => (
   <List {...props} filters={<UserFilter />}>
       <Datagrid rowClick="show">
           <TextField source="name" />
           <TextField source="email.email" label="Email"/>
           <MobileField source="mobile" label="Mobile"/>
           <BooleanField source="supplier" label="Supplier" />
           <TextField source="userType" label="Type" />
           <EditButton/>
       </Datagrid>
   </List>
)

export default usersList