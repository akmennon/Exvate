import React from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router-dom'
import {Typography} from '@material-ui/core'

class Home extends React.Component{
    constructor(props){
        super(props)
        this.state={
            works:[]
        }
    }

    render(){
        return(
            <div>
                <Typography variant="h4">
                    Welcome - {(this.props.user.name)?this.props.user.name:'Guest'}
                </Typography>
                {
                    this.state.works.map((element)=>{
                    return <Link key={element._id} to={`/work/${element._id}`}>{element.title}</Link>
                    })
                }
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return {
        user:state.user
    }
}

export default connect(mapStateToProps)(Home)