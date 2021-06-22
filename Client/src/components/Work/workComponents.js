import React,{useEffect} from 'react'
import TierSlider from './tierSlider'
import RangeSlider from './rangeSlider'
import {connect} from 'react-redux'
import {subOrderInitial,resultInitial} from './workFns'
import {startsetOrder} from '../../action/orderAction'

/* 

    Pending :
        Dropdown and checkbox
        Redirect to this page after logging in
        Authentication for socket order
        checkbox for sliders to be implemented

*/

const HiddenComponent = ({work,workIndex,addValue,orderNumber}) =>{
    useEffect(()=>{
        work.params.map((param,paramIndex)=>{
            if(param.tierType){
                const initial = param.values.find((element)=>{ return element.initial===true})
                /* initial object for values */
                const value = {
                    value:initial.value,
                    time:initial.time,
                    index:paramIndex,
                    workId:work.workId,
                    workIndex:workIndex
                }
                addValue(value,param,orderNumber)
            }
            else{
                const value = {
                    value:param.values[0].value,
                    time:param.values[0].time,
                    index:paramIndex,
                    workId:work.workId,
                    workIndex:workIndex
                }
                addValue(value,param,orderNumber)
            }
            return null
        })
    },[work,workIndex,addValue,orderNumber])
    return null
}


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
            this.props.socket.emit('calculatePrice',allResult)
        }

        /* created order is sent for ordering  */
        else if(e.target.name==='order'&&this.props.user._id){

            const multiOrder = this.state.multiOrder.map((ele)=>{
                /* userId is saved to each element, since each is an order */
                const subOrders = ele.subOrders.map((element)=>{
                    element.userId=this.props.user._id
                    return element
                })

                return {order:subOrders[0],result:ele.result}
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
                prevState.multiOrder[orderNumber]={result:[],subOrders:[]}
                return {
                    multiOrder:prevState.multiOrder
                }
            })
        }
        /* ran for each component initially and on changes */

        /* Initiates the result (for calculation) */
        const result = resultInitial(values)
        /* Initiates the order structure and suborders (for ordering) */
        const order = subOrderInitial(values,this.props.user._id,params)

        /* Initiated order and result are saved to state respect. */
        this.setState((previousState)=>{
            let prevState = previousState.multiOrder[orderNumber]
            if(!prevState.result[values.workIndex]){
                prevState.result[values.workIndex] = result
                prevState.subOrders[values.workIndex] = order   
                return {
                    result:prevState.result,
                    subOrders:prevState.subOrders
                }
            }
            else{
                /* according to the index, order.variable's values are changed */
                prevState.subOrders[values.workIndex].values.variables[values.index]={value:values.value,title:params.title,unit:params.unit}

                /* time and value changes for the result are saved acc. to the index */
                prevState.result[values.workIndex].values[values.index]=values.value
                prevState.result[values.workIndex].time.values[values.index]=values.time 

                /* changed result and orders are saved */
                return {
                    result:prevState.result,
                    subOrders:prevState.subOrders
                }
            }
        })
    }

    /* Component which creates sliders etc from the passed params */

    makeElements = (params,Paramindex,workId,workIndex,orderNumber) =>{ 
        switch(params.optionType){
            case 'slider':
                if(params.tierType===true){ //To check the type of sliders
                    return (
                        <TierSlider paramIndex={Paramindex} workIndex={workIndex} params={params} workId={workId} handleValues={this.addValue} orderNumber={orderNumber} key={params._id} />
                    )
                }
                else{
                    return (
                        <RangeSlider paramIndex={Paramindex} workIndex={workIndex} params={params} workId={workId} handleValues={this.addValue} orderNumber={orderNumber} key={params._id} />
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
                        //Loop to render components of options of each work
                        return this.props.work.options.options.map((work,workIndex)=>{
                            if(!work.hidden){/* Error : rerender updates need to be controlled */
                                return (
                                    <div key={work._id}>
                                        <h1>{this.props.work.options.options.length===1?<span/>:work.workTitle}</h1>
                                        {   
                                            //Loop to render components such as sliders from each params
                                            work.params.map((param,paramIndex)=>{
                                                return this.makeElements(param,paramIndex,work.workId,workIndex,orderNumber)
                                            })
                                        }
                                    </div>
                                )
                            }
                            else{
                                return <HiddenComponent key={work._id} work={work} workIndex={workIndex} addValue={this.addValue} orderNumber={orderNumber}/>
                            }
                        })
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