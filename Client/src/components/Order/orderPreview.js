import React from 'react'
import Button from '@mui/material/Button'
import {connect, useSelector} from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

/* shows the preview of the order from the backend response */

function OrderPreview(props){
    const navigate = useNavigate()
    const params = useParams()
    const saved = useSelector(state=>({order:state.order,user:state.user,work:state.work}))

    const handleClick = () =>{//Orders with the given params
        navigate(`/orderAddress/${params.id}`)
    }

    console.log(saved.user)
    if(saved.order===undefined){
        navigate(`/work/${params.id}`,{replace:true})
    }
    else{
        console.log(saved.order)
        return(
            <div>
                {
                    saved.work?<h1>{saved.work.title}</h1>:<span/>
                }
                <Button onClick={handleClick}>Confirm</Button>
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return {
        order:state.order.newOrder,
        work:state.work,
        user:state.user
    }
}

export default connect(mapStateToProps)(OrderPreview)