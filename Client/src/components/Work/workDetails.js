import React, { useEffect, useState } from 'react'
import WorkComponents from './workComponents'
import axios from '../../config/axios'
import {setWork} from '../../action/workAction'
import {useDispatch} from 'react-redux'
import LoadingError from '../../config/loadingError'

/* The work parent page which contains the work components */

function Work (props){ 
    const [workData,setWorkData] = useState([])
    const [loading,setLoading] = useState(true)

    const dispatch = useDispatch()

    /* The work details - complete with options and result populated */

    useEffect(()=>{
        setWorkData([])
        setLoading(true)
        axios.get(`/works/${props.match.params.id}`)
            .then((response)=>{
                dispatch(setWork(response.data))
                setWorkData(response.data)
                setLoading(false)
            })
            .catch((err)=>{
                setLoading(false)
                console.log(err)
            })
    },[props.match.params.id])

    if(!workData||workData.length===0){   //loading 
        return <LoadingError loading={loading} setLoading={setLoading} />
    }
    else{
        console.log(workData)
        return( //Work component is executed after api call
            <div>
                <h1>{workData.title}</h1>
                <img src={workData.imagePath} alt={workData.title} style={{width:400,height:300}}/>
                <WorkComponents parent={props} work={workData}/>
            </div>
        )
    }
}

export default Work