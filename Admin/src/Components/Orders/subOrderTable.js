import React,{useState,useEffect} from 'react';
import { DataGrid } from '@material-ui/data-grid';
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
    const classes = useStyles()
    const [subOrders,setSubOrders] = useState([])
    
    useEffect(()=>{
        const newSubOrders = props.subOrders.map((ele)=>{
            ele.id = ele._id
            return ele
        })
        setSubOrders(newSubOrders)
    },[props.subOrders])

    const columns = [
        { field: 'workId', headerName: 'Work', width: 200, sortable:false,
        valueGetter: (params) => {console.log(params); return params.row.workId.title}},
        { field: 'status', headerName: 'Status', width: 130 },
        { field: 'price', headerName: 'Price', type: 'number', width: 130,
        valueGetter: (params) => params.row.values.price},
        { field: 'time', headerName: 'Time', type: 'number', width: 130,
        valueGetter: (params) => params.row.values.time},
        { field: 'completionVerified', headerName: 'Finished', type:'boolean', width: 130,
        valueFormatter: (params) => params.row.completionVerified.length!==0?'true':'false'},
        { field: 'verified', headerName: 'Verified', type:'boolean', width: 130,
        valueGetter: (params) => params.row.verified.value},
        { field: 'sample', headerName: 'Sampling', type: 'text', width: 130,
        valueGetter: (params) => params.row.sample.sampleStatus},
        {
          field: 'actions',
          headerName: 'Actions',
          description: 'This column has a value getter and is not sortable.',
          disableClickEventBubbling: true,
          sortable: false,
          width: 300,
          renderCell: (params) =>
            {
                return params.row.verified.value?
                (
                    <div>
                        <Button variant='outlined' color='primary' onClick={()=>props.history.push(`/orders/hosts/${params.row._id}`)}>Edit</Button>
                        {
                            params.row.status==='Active'?
                            <Button className={classes.rowButton} variant='outlined' color='primary' onClick={()=>{props.setCred(e=>({...e,orderId:params.row._id}));props.setOpen(true)}}>Complete</Button>:<div/>
                        }
                    </div>
                ):
                <Button variant='outlined' color='primary' onClick={()=>props.history.push(`/orders/hosts/${params.row._id}`)}>Verify</Button>
            }    
        }
    ];

    const noRows = () =>{
        return(
            <div className={classes.noRows}>
                <p>No subOrders</p>
            </div>
        )
    }

    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid rows={subOrders} columns={columns} pageSize={5} disableSelectionOnClick={true} components={{ noRowsOverlay: noRows}} onRowClick={(params)=>props.history.push(`/orders/${params.row._id}/show`)}/>
        </div>
    );
}

export default DataTable