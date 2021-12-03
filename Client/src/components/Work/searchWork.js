import React, { useEffect, useState } from 'react'
import axios from '../../config/axios'
import Pagination from '@mui/material/Pagination';

const searchWorks = (query,pageCount=1,setData,setLoading,setTotal) =>{
    const token = localStorage.getItem('token')
    axios.post(`/works/search`,{query,pageCount},{
        headers:{
            'x-auth':token
        }
    })
    .then((response)=>{
        const totalPages = Math.ceil(Number(response.headers.total)/15)
        setTotal(totalPages)
        setData(response.data)
        setLoading(false)
    })
    .catch((err)=>{
        setLoading(false)
    })
}

export default function SearchWork (props){
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(true)
    const [total,setTotal] = useState(1)
    const [pageCount,setPageCount] = useState(1)

    useEffect(()=>{
        searchWorks(props.match.params.value,pageCount,setData,setLoading,setTotal)
    },[props.match.params.value,pageCount])

    if(loading){
        return(
            <div>
                <h3>Loading</h3>
            </div>
        )
    }
    else{
        if(!data.length){
            return(
                <div>
                    <h3>No product match</h3>
                </div>
            )
        }
        else{
            return(
                <div>
                    {
                        data.map((element)=>{
                            return(
                                <div key={element._id} onClick={()=>props.history.push(`/work/${element._id}`)}>
                                    <div style={{width:600,height:300}}>
                                        <img src={element.imagePath} height={100} width={100} alt='inventory'/>
                                        <h3>{element.title}</h3>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <Pagination count={total} page={pageCount} onChange={(e,val)=>{setPageCount(val)}} />
                </div>
            )
        }
    }
}