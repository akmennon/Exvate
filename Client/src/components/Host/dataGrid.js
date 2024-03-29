import React,{useState,useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import axios from '../../config/axios'
import { connect, useSelector } from 'react-redux';
import Button from '@mui/material/Button'
import {makeStyles} from '@mui/styles'

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
    const [page,setPage] = useState(1)
    const [total,setTotal] = useState(0)
    const user = useSelector(state=>state.user)
    const classes = useStyles()

    useEffect(()=>{
        if(user._id){
            const token = localStorage.getItem('x-auth')
            const user = localStorage.getItem('user')
            axios.get(`/supplier/${user._id}/workOrders`,{
                headers:{
                    'x-auth':token,
                    'page':page,
                    'userId':user
                }
            })
            .then((response)=>{
                response.data = response.data.map((ele)=>{
                    ele.id = ele._id
                    return ele
                })
                console.log(response.data)
                setTotal(response.total)
                setData(response.data)
            })
            .catch((e)=>{
                console.log(e)
            })
        }
    },[page])

    const handleClick = (event,{id}) =>{
        const token = localStorage.getItem('x-auth')
        const user = localStorage.getItem('user')
        const ee = event
        switch(ee.target.textContent){
            case 'Complete':
                axios.get(`/supplier/orders/${id}/complete`,
                {
                    headers:{
                        'x-auth':token,
                        'userId':user
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
                axios.post(`/supplier/orders/${id}/cancel`,{},
                {
                    headers:{
                        'x-auth':token,
                        'userId':user
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
            if(params.row.paymentStatus.supplierAmount){
                return params.row.paymentStatus.supplierAmount
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
                    <DataGrid rows={data} columns={columns} disableSelectionOnClick={true} components={{ noRowsOverlay: noRows}} onPageChange={(e)=>{setPage(e+1)}} pageSize={20} paginationMode='server' rowCount={total}/>
                </div>
            </CardContent>
        </Card>
    );
}

export default DataTable