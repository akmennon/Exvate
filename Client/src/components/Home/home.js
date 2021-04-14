import React from 'react'
import axios from '../../config/axios'
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

    componentDidMount(){
            axios.get('/works/all')
            .then((response)=>{
                console.log(response)
                this.setState((prevState)=>{
                    return {
                        works: prevState.works.concat(response.data)
                    }
                })
            })
            .catch((err)=>{
                console.log(err)
            })
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