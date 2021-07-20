import React,{useState,useEffect,Fragment} from 'react';
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

const RenderCell = (props) =>{
    if(props.order.supplier.assigned.includes(props.newParams.row._id)){
        return (
            <Fragment>
                <Button variant='outlined' color='primary' onClick={()=>{props.supplierButton(props.newParams.row._id,'remove',props)}}>Remove</Button>
                <Button variant='outlined' color='primary' onClick={()=>{props.supplierButton(props.newParams.row._id,'payment',props)}}>Make Payment</Button>
            </Fragment>
        )
    }
    else{
        return <Button variant='outlined' color='primary' onClick={()=>{props.supplierButton(props.newParams.row._id,'assign',props)}}>Select</Button>
    }
}

const FinishButton = (props) =>{
    return <Button variant='outlined' color='primary' onClick={()=>{props.supplierButton(props.newParams.row._id,'finish',props)}}>Payment Finished</Button>
}

function DataTable(props) {
    const classes = useStyles()
    const [suppliers,setSuppliers] = useState([])
    const [payment,setPayment] = useState('')

    console.log(props)
    
    useEffect(()=>{
        const newSuppliers = props.suppliers.map((ele)=>{
            ele.id = ele._id
            return ele
        })
        setSuppliers(newSuppliers)
        setPayment(props.order.paymentStatus.supplierPayment)
    },[props.suppliers,props.order.paymentStatus.supplierPayment])

    const paymentCell = (params) =>{
        if(props.order.supplier.assigned[0]===params.row._id){
            if(props.order.paymentStatus.supplierPayment==='Completed'||props.order.paymentStatus.supplierPayment==='Contract'||props.order.paymentStatus.supplierPayment==='Finished'){
                switch(props.order.paymentStatus.supplierPayment){
                    case 'Completed':
                        return 'Completed'
                    case 'Contract':
                        return 'Contract'
                    case 'Finished':
                        return 'Finished'
                    default:
                        console.log('error')
                }
            }
            else{
                return "Pending"
            }
        }
        else{
            return "N/A"
        }
    }

    const columns = [
        { field: 'name', headerName: 'Name', width: 200, sortable:false,
        valueGetter: (params) => {console.log(params); return params.row.name}},
        { field: 'email', headerName: 'Email', width: 200,
        valueGetter: (params) => params.row.email.email},
        { field: 'mobile', headerName: 'Mobile', type: 'number', width: 130,
        valueGetter: (params) => params.row.mobile},
        { field: 'work', headerName: 'Work orders', width: 130,
        valueFormatter: (params) => params.row.work.workOrder.length===0?'None':`${params.row.work.workOrder.length} Assigned`},
        { field: 'supplier', headerName: 'Refused', type:'boolean', width: 130,
        valueGetter: (params) => props.order.supplier.removed.includes(params.row._id)?true:false},
        { field: 'payment', headerName: 'Payment', type:'text', width: 130,
        valueGetter: (params) => paymentCell(params)},
        {
          field: 'actions',
          headerName: 'Actions',
          description: 'This column has a value getter and is not sortable.',
          disableClickEventBubbling: true,
          sortable: false,
          width: 300,
          renderCell: (params) =>
            {
                return payment==='Completed'||payment==='Contract'||payment==='Finished'?(props.order.supplier.assigned.includes(params.row._id)?(payment!=='Finished'?<FinishButton newParams={params} {...props}/>:null):null):<RenderCell newParams={params} {...props}/>
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
            <DataGrid rows={suppliers} columns={columns} pageSize={5} disableSelectionOnClick={true} components={{ noRowsOverlay: noRows}} onRowClick={(params)=>props.history.push(`/users/${params.row._id}/show`)}/>
        </div>
    );
}

export default DataTable