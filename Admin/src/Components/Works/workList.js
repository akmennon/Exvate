import React from 'react';
import { List, Datagrid, TextField, EditButton } from 'react-admin';
import WorkFilter from './filters'

const workList = props => (
   <List {...props} filters={<WorkFilter/>}>
       <Datagrid rowClick='show' >
           <TextField source="title" />
           <TextField source="category.title" label="Category"/>
           <TextField source="type.title" label="Type"/>
           <EditButton/>
       </Datagrid>
   </List>
)

export default workList