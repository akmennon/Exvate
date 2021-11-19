import React from 'react'
import WorkComponents from './workComponents'
import axios from '../../config/axios'
import {setWork} from '../../action/workAction'
import {connect} from 'react-redux'

/* The work parent page which contains the work components */

class Work extends React.Component{ 
    constructor(props){
        super(props)
        this.state={
            work:''
        }
    }

    /* The work details - complete with options and result populated */

    componentDidMount(){  
        axios.get(`/works/${this.props.match.params.id}`)
            .then((response)=>{
                console.log(response.data)
                this.props.dispatch(setWork(response.data))
                this.setState({work:response.data})
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    render(){
        if(!this.state.work){   //loading 
            return(
                <div>
                    <h1>Loading</h1>
                </div>
            )
        }
        else{
            return( //Work component is executed after api call
                <div>
                    <h1>{this.state.work.title}</h1>
                    <img src={this.state.work.imagePath} alt={this.state.title} style={{width:400,height:300}}/>
                    <WorkComponents parent={this.props} work={this.state.work}/>
                </div>
            )
        }
    }
}

export default connect()(Work)