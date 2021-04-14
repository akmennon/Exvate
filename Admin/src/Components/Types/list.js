import React from 'react';
import { List, Datagrid, TextField,EditButton } from 'react-admin';

const typesList = props => (
   <List {...props} >
       <Datagrid>
           <TextField source="title" />
           <TextField source="_id" label="id"/>
           <EditButton/>
       </Datagrid>
   </List>
)

export default typesList