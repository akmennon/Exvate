import React from 'react'
import { Show, SimpleShowLayout, TextField, BooleanField,useQuery, ArrayField,Datagrid,Loading,NumberField,EditButton} from 'react-admin';

const ParamValues = (props) =>{
    console.log(props)
    if(props.record.tierType){
        return(
            <ArrayField source="values" {...props}>
                <Datagrid>
                    <TextField source="label" label="Label" />
                    <TextField source="desc" label="Desc" />
                    <BooleanField source="initial" label="Initial" />
                    <NumberField source="value" label="Value" />
                    <NumberField source="time" label="Time" />
                </Datagrid>
            </ArrayField>
        )
    }
    else{
        return(
            <ArrayField source="values" {...props}>
                <Datagrid>
                    <BooleanField source="amount" label="Amount" />
                    <NumberField source="min" label="Minimum" />
                    <NumberField source="max" label="Maximum" />
                    <NumberField source="value" label="Initial" />
                    <NumberField source="time" label="Time" />
                </Datagrid>
            </ArrayField>
        )
    }
}

const Array = (props) =>{
    if(props.record.options.options.length>1){
        return (
            <ArrayField {...props} source="options.options">
                <Datagrid rowClick={(e)=>{const val = JSON.parse(e);props.history.push(`/works/${val.workId}/show`)}}>
                    <TextField source='workTitle' label='Work Title'/>
                    <TextField source='hidden' label='Hidden'/>
                </Datagrid>
            </ArrayField>
        )
    }
    else{
        const newProps = props
        newProps.record.options.options[0].hidden = newProps.record.options.options[0].hidden.toString()
        console.log(newProps)
        return(
            <SimpleShowLayout {...newProps} >
                <TextField source="options.options[0].hidden" label="Hidden"/>
                <ArrayField {...newProps} source="options.options[0].params" label="Params">
                    <Datagrid expand={<ParamValues/>}>
                        <TextField source='title' label='Title'/>
                        <BooleanField source='tierType' label='Tier Type'/>
                        <TextField source='desc' label='Description'/>
                        <TextField source='optionType' label='Option'/>
                    </Datagrid>
                </ArrayField>
            </SimpleShowLayout>
        )
    }
}

const WorkShow = (props) => {
    const { data, loading, error } = useQuery({ 
        type: 'getOne',
        resource: props.resource,
        payload: { id: props.id }
    });

    if (loading) return <Loading />;
    if (error){console.log(error)};
    if (!data) return null;
    
    const newProps = {...props,record:data}
    
    return (
    <Show {...newProps} actions={<EditButton {...newProps} />}>
        <SimpleShowLayout>
            <TextField source="title" label='Title'/>
            <TextField source="category.title" label='Category'/>
            <TextField source="type.title" label='Type'/>
            <Array history={props.history} {...newProps}/>
        </SimpleShowLayout>
    </Show>
)};

export default WorkShow