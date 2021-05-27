import React from 'react';
import { List, Datagrid, TextField,EditButton } from 'react-admin';

const categoriesList = props => (
   <List {...props} >
       <Datagrid>
           <TextField source="title" />
           <TextField source="hscode" />
           <TextField source="type.title" label="Type"/>
           <EditButton/>
       </Datagrid>
   </List>
)

export default categoriesList