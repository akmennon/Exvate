import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'

function LoadingScreen (props){

    setTimeout(()=>{
        props.setLoading(false)
    },8000)

    if(props.loading){
        return (
            <div>
                <CircularProgress />
            </div>
        )
    }
    else{
        return (
            <div>
                <p>Oops. Something went wrong, please try again</p>
            </div>
        )
    }
}

export default LoadingScreen