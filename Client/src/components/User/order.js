import React from 'react'
import axios from '../../config/axios'

/* display all the orders of a user */

class Orders extends React.Component {
    constructor(props){
        super(props)
        this.state={
            orders:[]
        }
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
                console.log(response.data)
                this.setState({orders:response.data})
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    render(){
        return(
            <div>
                {
                    this.state.orders.map((order)=>{
                        return (
                            <p key={order._id}>{order.status}</p>
                        )
                    })
                }
            </div>
        )
    }
}

export default Orders