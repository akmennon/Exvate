import React from 'react'
import Typography from '@mui/material/Typography'
import {useSelector} from 'react-redux'

function Home(props){
    const user = useSelector(state=>state.user)
    return(
        <div>
            <Typography variant="h4">
                Welcome - {(user.name)?user.name:'Guest'}
            </Typography>
        </div>
    )
}

export default Home