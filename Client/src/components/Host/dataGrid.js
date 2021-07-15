import React,{useState,useEffect} from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import axios from '../../config/axios'
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'

/* Pending : Accept order */

const useStyles = makeStyles((theme)=>({
    noRows:{
        display:'flex',
        flexGrow:1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    },
    actionsColumn:{
        display:"flex",
        flexDirection:'row'
    }
})
)

function DataTable(props) {
    const [data,setData] = useState([])
    const classes = useStyles()

    useEffect(()=>{
        if(props.user._id){
            const token = localStorage.getItem('x-auth')
            axios.get(`/supplier/${props.user._id}/workOrders`,{
                headers:{
                    'x-auth':token
                }
            })
            .then((response)=>{
                response.data = response.data.map((ele)=>{
                    ele.id = ele._id
                    return ele
                })
                console.log(response.data)
                setData(response.data)
            })
            .catch((e)=>{
                console.log(e)
            })
        }
    },[props.user._id,setData])

    const handleClick = (event,{id}) =>{
        const token = localStorage.getItem('x-auth')
        const ee = event
        switch(ee.target.textContent){
            case 'Complete':
                axios.get(`/host/orders/${id}/complete`,
                {
                    headers:{
                        'x-auth':token
                    }
                })
                .then((response)=>{
                    console.log(response.data)
                })
                .catch((e)=>{
                    console.log(e)
                })
            break;
            case 'Cancel':
                axios.get(`/host/orders/${id}/cancel`,
                {
                    headers:{
                        'x-auth':token
                    }
                })
                .then((response)=>{
                    console.log(response.data)
                })
                .catch((e)=>{
                    console.log(e)
                })
            break;
            default:
                console.log('Error')
        }
    }

    const columns = [
        { field: 'workId', headerName: 'Work', width: 130, sortable:false,
        valueGetter: (params) => params.value.title},
        { field: 'status', headerName: 'Status', width: 130 },
        { field: 'price', headerName: 'Price', type: 'number', width: 130,
        valueGetter: (params) => {
            if(params.row.paymentStatus.hostAmount){
                return params.row.paymentStatus.hostAmount
            }
            else{
                return 0
            }
        }},
        { field: 'time', headerName: 'Time', type: 'number', width: 130,
        valueGetter: (params) => params.row.values.time},
        { field: 'verified', headerName: 'Verified', type:'boolean', width: 130,
        valueGetter: (params) => params.value.value},
        {
          field: 'actions',
          headerName: 'Actions',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 300,
          renderCell: (params) =>
            {
                console.log(params)
                if(params.row.status!=='Completed'&&params.row.status!=='Transit'&&params.row.status!=='Finished'&&params.row.status!=='Cancelled'&&params.row.status!=='Failed'&&params.row.status!=='Active'){
                    return (
                        <div className={classes.actionsColumn}>
                            <Button variant='outlined' name='Complete' onClick={(e)=>handleClick(e,{id:params.row._id})}>Complete</Button>
                            <Button variant='outlined' name='Cancel' onClick={(e)=>handleClick(e,{id:params.row._id})}>Cancel</Button>
                        </div>
                    )
                }
            }    
        }
        /*{
          field: 'age',
          headerName: 'Age',
          type: 'number',
          width: 90,
        },
        {
          field: 'fullName',
          headerName: 'Full name',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
          valueGetter: (params) =>
            `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
        },*/
    ];

    const noRows = () =>{
        return(
            <div className={classes.noRows}>
                <p>No orders</p>
            </div>
        )
    }

    return (
        <Card>
            <CardContent>
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid rows={data} columns={columns} pageSize={5} disableSelectionOnClick={true} components={{ noRowsOverlay: noRows}} />
                </div>
            </CardContent>
        </Card>
    );
}

const mapStateToProps = (state) =>{
    return {
        user:state.user
    }
}

export default connect(mapStateToProps)(DataTable)