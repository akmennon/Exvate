import React from 'react';
import { List, Datagrid, TextField, BooleanField } from 'react-admin';
import PostFilter from './filters'

const FinishedField = (props) =>{
    let record
    if(props.record.completionVerified.length!==0){
        record = {finished:true}
    }
    else{
        record = {finished:false}
    }
    return <BooleanField {...props} source='finished' record={record} label="Finished"/>
}

const orderList = props => (
   <List {...props} filters={<PostFilter />}>
       <Datagrid rowClick="show">
           <TextField source="workId.title" label="Work"/>
           <TextField source="userId.email.email" label="User"/>
           <TextField source="status" />
           <TextField source="paymentStatus.value" label="Payment Status"/>
           <TextField source="paymentStatus.hostPayment" label="Host Payment"/>
           <TextField source="incoterm" label="ICO"/>
           <BooleanField source="verified.value" label="Verified"/>
           <FinishedField label="Finished"/>
       </Datagrid>
   </List>
)

export default orderList