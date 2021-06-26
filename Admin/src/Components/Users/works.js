import React,{Fragment}from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { Title, useQuery, Loading } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme)=>({
    column:{
        'display':'flex',
        'flexDirection':'column',
        'alignItems':'center'
    },
    content:{
        'display':'flex',
        'flexDirection':'row',
        'justifyContent':'space-between'
    },
    header:{
        'padding':5
    },
    subtitle:{
        'marginTop':50,
        'marginLeft':30
    },
    action:{
        'display':'flex',
        'flexDirection':'column',
        'justifyContent':'center'
    }
}))

const UpdateWork = (props) => {
    const { data, loading, error } = useQuery({ 
        type: 'getOne',
        resource: 'users',
        payload: { id: props.match.params.id }
    })
    const classes = useStyles()

    if (loading) return <Loading />;
    if (error) return null;
    if (!data) return null;
    console.log(data)

    if(!data.work.workDetails[0]||data.work.workDetails[0].workId===undefined){
        return(
            <Card>
                <Title title="User Works" />
                <CardContent>
                    <Button variant='outlined' color='primary' onClick={()=>props.history.push(`/users/${props.match.params.id}/addWork`)}>Add Work</Button>
                    <Typography variant='subtitle1' className={classes.subtitle}>No works added</Typography>
                </CardContent>
            </Card>
        )
    }
    else{
        return(
            <Card>
                <Title title="User works" />
                <CardHeader action={<Button variant='outlined' color='primary' onClick={()=>props.history.push(`/users/${props.match.params.id}/addWork`)}>Add Work</Button>} />
                <CardContent>
                    {
                        data.work.workDetails.map((element)=>{
                            return(
                                <Card key={element.options.options[0].workId}>
                                    <CardContent className={classes.content}>
                                        <div className={classes.column}>
                                            <Typography>Title</Typography>
                                            <Typography>{element.options.options[0].workTitle}</Typography>
                                        </div>

                                        {
                                            element.options.options[0].params.map((param)=>{
                                                if(param.tierType===true){
                                                    if(param.values.length>1){
                                                        let label='',values='',time='';
                                                        param.values.map((value)=>{
                                                            label = label + ` ${value.label}`
                                                            values = values + ` ${value.value}`
                                                            time = time + ` ${value.time}`
                                                            return null
                                                        })
                                                        return(
                                                            <Fragment key={param._id}>
                                                                <div className={classes.column}>
                                                                    <Typography>{param.title}</Typography>
                                                                    <Typography>{label}</Typography>
                                                                </div>
    
                                                                <div className={classes.column}>
                                                                    <Typography>Price</Typography>
                                                                    <Typography>{values}</Typography>
                                                                </div>
    
                                                                <div className={classes.column}>
                                                                    <Typography>Time</Typography>
                                                                    <Typography>{time}</Typography>
                                                                </div>
                                                            </Fragment>
                                                        )
                                                    }
                                                    else{
                                                        return(
                                                            <Fragment key={param._id}>
                                                                <div className={classes.column}>
                                                                    <Typography>{param.title}</Typography>
                                                                    <Typography>{param.values[0].label}</Typography>
                                                                </div>
    
                                                                <div className={classes.column}>
                                                                    <Typography>Price</Typography>
                                                                    <Typography>{param.values[0].value}</Typography>
                                                                </div>
    
                                                                <div className={classes.column}>
                                                                    <Typography>Time</Typography>
                                                                    <Typography>{param.values[0].time}</Typography>
                                                                </div>
                                                            </Fragment>
                                                        )
                                                    }
                                                }
                                                else{
                                                    return(
                                                        <Fragment key={param._id}>
                                                            <div className={classes.column}>
                                                                <Typography>Label</Typography>
                                                                <Typography>{param.title}</Typography>
                                                            </div>

                                                            <div className={classes.column}>
                                                                <Typography>Maximum</Typography>
                                                                <Typography>{param.values[0].max}</Typography>
                                                            </div>

                                                            <div className={classes.column}>
                                                                <Typography>Minimum</Typography>
                                                                <Typography>{param.values[0].min}</Typography>
                                                            </div>
                                                        </Fragment>
                                                    )
                                                }
                                            })
                                        }
                                        <Button variant='outlined' color='primary' onClick={()=>props.history.push(`/users/${props.match.params.id}/updatework/${element.options.options[0].workId}`)}>Update</Button>
                                    </CardContent>
                                </Card>
                            )
                        })
                    }
                </CardContent>
            </Card>
        )
    }
}

export default UpdateWork;