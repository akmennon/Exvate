import React from 'react'
import TierSlider from './tierSlider'
import RangeSlider from './rangeSlider'
import {connect} from 'react-redux'
import {orderInitial,resultInitial} from './workFns'
import {startsetOrder} from '../../action/orderAction'

/* 

    Pending :
        Dropdown and checkbox
        Redirect to this page after logging in
        Authentication for socket order
        checkbox for sliders to be implemented

*/

/* Component which decodes the options to creates components ( sliders, dropdowns etc ) */

class WorkComponents extends React.Component{
    constructor(props){
        super(props)
        this.state={
            multiOrder:[],
            orders:1,
            totalPrice:''
        }
    }

    /* Creates the entire result or order makes it to be sent to the server */

    handleClick = (e) =>{  

        /* created result is sent for calculation */
        if(e.target.name==='price'){
            console.log(this.state.result)
            const allResult = this.state.multiOrder.map((ele)=>{
                return ele.result
            })
            console.log(this.state.multiOrder)
            this.props.socket.emit('calculatePrice',allResult)
        }

        /* created order is sent for ordering  */
        else if(e.target.name==='order'&&this.props.user._id){

            const multiOrder = this.state.multiOrder.map((ele)=>{
                /* userId is saved to each element, since each is an order */
                ele.subOrders.userId=this.props.user._id
                return {order:ele.subOrders,result:ele.result}
            })

            const redirect = () =>{
                this.props.parent.history.push(`/orderPreview/${this.props.work._id}`)
            }

            this.props.dispatch(startsetOrder(multiOrder,redirect))
            console.log(this.props.order)
        }

        /* redirect to login if no userId present in redux */
        else{
            this.props.parent.history.push('/user/login')
        }
    }

    /* function which obtains the values from the components and creates an ordered result */
    addValue = async (values,params,orderNumber) =>{
        if(this.state.multiOrder[orderNumber]===undefined){
            this.setState((prevState)=>{
                prevState.multiOrder[orderNumber]={result:{},subOrders:{}}
                return {
                    multiOrder:prevState.multiOrder
                }
            })
        }
        /* ran for each component initially and on changes */

        /* Initiates the result (for calculation) */
        const result = resultInitial(values)
        /* Initiates the order structure and suborders (for ordering) */
        const order = orderInitial(values,this.props.user._id,params)

        /* Initiated order and result are saved to state respect. */
        this.setState((previousState)=>{
            let prevState = previousState.multiOrder[orderNumber]
            if(!prevState.result||!prevState.result.values){
                prevState.result = result
                prevState.subOrders = order   
                return {
                    result:prevState.result,
                    subOrders:prevState.subOrders
                }
            }
            else{
                /* according to the index, order.variable's values are changed */
                prevState.subOrders.values.variables[values.index]={value:values.value,title:params.title,unit:params.unit}

                /* time and value changes for the result are saved acc. to the index */
                prevState.result.values[values.index]=values.value
                prevState.result.time.values[values.index]=values.time 

                /* changed result and orders are saved */
                return {
                    result:prevState.result,
                    subOrders:prevState.subOrders
                }
            }
        })
    }

    /* Component which creates sliders etc from the passed params */

    makeElements = (params,Paramindex,workId,orderNumber) =>{ 
        switch(params.optionType){
            case 'slider':
                if(params.tierType===true){ //To check the type of sliders
                    return (
                        <TierSlider paramIndex={Paramindex} params={params} workId={workId} handleValues={this.addValue} orderNumber={orderNumber} key={params._id} />
                    )
                }
                else{
                    return (
                        <RangeSlider paramIndex={Paramindex} params={params} workId={workId} handleValues={this.addValue} orderNumber={orderNumber} key={params._id} />
                    )
                }
            case 'checkbox':
                return (
                    <li>Checkbox in progress</li>
                )
            case 'dropdown':
                return (
                    <li>Dropdown in progress</li>
                )
            default:
                console.log('makeElements, fix single work')
        }
    }

    /* sockets */
    componentDidMount(){

        /* socket to find the initial price of the work */
        this.props.socket.on('total',(results)=>{   
            let total = 0
            results.map((result)=>{
                return total = total + result.price
            })
            this.setState({totalPrice:total})
        })

    }

    /* closes the socket on unmount */
    componentWillUnmount(){
        this.props.socket.close()
    }

    render(){
        return(
            <div>
                {   
                    [...Array(this.state.orders)].map((x,orderNumber)=>{
                        console.log(this.props.work)
                        //Loop to render components of options of each work
                        return (
                            <div key={orderNumber}>
                                <h1>{this.props.work.workTitle}</h1>
                                {   
                                    //Loop to render components such as sliders from each params
                                    this.props.work.options.params.map((param,paramIndex)=>{
                                        if(paramIndex===0){
                                            return <div key={paramIndex}> 
                                                        <h3>Order {orderNumber+1}</h3>
                                                        {
                                                            this.makeElements(param,paramIndex,this.props.work._id,orderNumber)
                                                        }
                                                    </div>
                                        }
                                        else{
                                            return this.makeElements(param,paramIndex,this.props.work._id,orderNumber)
                                        }
                                    })
                                }
                            </div>
                        )
                    })
                }
                <p>{this.state.totalPrice?`Total Price - ${this.state.totalPrice}`:<span/>}</p>
                <button onClick={this.handleClick} name='price'>Check Price</button>
                <button onClick={this.handleClick} name='order'>Order</button>
                <button onClick={()=>this.setState((prevState)=> {return {orders:prevState.orders+1}})} name='Add'>Add</button>
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return {
        user:state.user,
        order:state.order
    }
}

export default connect(mapStateToProps)(WorkComponents)