import React from 'react'
import axios from '../../config/axios'
import {connect} from 'react-redux'
import {setFinishedOrder} from '../../action/orderAction'
import CircularProgress from '@mui/material/CircularProgress';

/* display all the orders of a user */

class Orders extends React.Component {
    constructor(props){
        super(props)
        this.state={
            orders:[],
            status:'loading'
        }

        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount(){
        const token = localStorage.getItem('x-auth')
        if(token===undefined||token==='undefined'){
            this.props.history.push('/user/login')
        }
        axios.post('/user/orders',null,
        {
            headers:{
                'x-auth':token
            }
        })
            .then((response)=>{
                if(response.data.length===0){
                    this.setState({status:'none'})
                }
                else{
                    this.setState({orders:response.data})
                }
            })
            .catch((err)=>{
                console.log(err)
                this.setState({status:'failed'})
            })
    }

    handleClick(orderIndex){
        this.props.dispatch(setFinishedOrder(this.state.orders[orderIndex]))
        this.props.history.push(`/user/orderPage/${this.state.orders[orderIndex]._id}`)
    }

    render(){
        if(this.state.orders.length){
            return(
                <div>
                    {
                        this.state.orders.map((order,orderIndex)=>{
                            return (
                                <p key={order._id} onClick={()=>{this.handleClick(orderIndex)}} >{order.status}</p>
                            )
                        })
                    }
                </div>
            )
        }
        else if(this.state.status==='none'){
            return (
                <div>
                    You have not made any orders
                </div>
            )
        }
        else if(this.state.status==='loading'){
            return(
                <div>
                    <CircularProgress />
                </div>
            )
        }
        else{
            return(
                <div>
                    <h3>Error Fetching data.Please retry by refreshing the page</h3>
                </div>
            )
        }
    }
}

export default connect()(Orders)