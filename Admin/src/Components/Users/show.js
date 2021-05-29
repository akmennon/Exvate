import React from "react";
import { Show, SimpleShowLayout, TextField, EditButton, TopToolbar, BooleanField} from 'react-admin';
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles({
    topBar:{
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
    }
})

const UserShowActions = (props) => {
    const classes = useStyles()
    console.log(props)
    return (
    <TopToolbar className={classes.topBar}>
        <div>
            <Button variant="outlined" color="primary" onClick={()=>props.history.push(`/users/${props.match.params.id}/works`)}>Update Work</Button>
            <Button variant="outlined" color="primary" onClick={()=>props.history.push(`/users/${props.match.params.id}/orders`)}>Orders</Button>
            <Button variant="outlined" color="primary" onClick={()=>props.history.push(`/users/${props.match.params.id}/createOrder`)}>Create Order</Button>
        </div>
        <EditButton basePath={props.basePath} record={props.data} />
    </TopToolbar>
)};

const UserShow = (props) => {
    return (
    <Show actions={<UserShowActions {...props} />} {...props}>
        <SimpleShowLayout>
            <TextField source="name" label='Name'/>
            <TextField source="email.email" label='Email' />
            <TextField source='mobile' label='Mobile' />
            <BooleanField source='email.confirmed.value' label='Email Verified' emptyText="false"/>
            <TextField source='supplier' label='Supplier' />
        </SimpleShowLayout>
    </Show>
)};

export default UserShow