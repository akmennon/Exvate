import React from 'react'
import TierSlider from './tierSlider'
import RangeSlider from './rangeSlider'
import {connect} from 'react-redux'
import {resultInitial} from './workFns'
import {startsetOrder} from '../../action/orderAction'
import calcResult from '../resolvers/calcResult'

/* 

    Pending :
        Dropdown and checkbox
        Redirect to this page after logging in
        checkbox for sliders to be implemented
        Time calculation

*/

/* Component which decodes the options to creates components ( sliders, dropdowns etc ) */

class WorkComponents extends React.Component{
    constructor(props){
        super(props)
        this.state={
            multiOrder:[],
            orders:1,
            totalPrice:'',
            status:true,
            errMessage:'',
            time:''
        }
    }

    /* Creates the entire result or order makes it to be sent to the server */

    handleClick = (e) =>{  

        /* The created result is calculated for the price from the work result */
        if(e.target.name==='price'){
            console.log(this.state.result)
            console.log(this.state.multiOrder)

            const result = Object.assign({},this.props.work.result)
            
            if(result){
                if(this.state.multiOrder.length===1){
                    let output
                    result.values = this.state.multiOrder[0].result.values
                    result.time.values = this.state.multiOrder[0].result.time.values
                    output = calcResult(result)
                    this.setState({totalPrice:output[0].price,time:output[0].time})
                }
                else{
                    if(this.state.multiOrder.length===0){
                        console.log('error')
                    }
                    let resultValue = {}

                    /* Method to calculate price for multiple orders [Single order calculation with a loop] */
                    this.state.multiOrder.map((order)=>{
                        let output

                        result.values = order.result.values
                        result.time.values = order.result.time.values
                
                        if(resultValue&&resultValue.price){
                            output = calcResult(result,output)
                            resultValue.price = resultValue.price + output[0].price
                            resultValue.time = resultValue.time + output[0].time
                        }
                        else{
                            output = calcResult(result,output)
                            resultValue.price = output[0].price
                            resultValue.time = output[0].time
                        }
                        /* Calculates the total price from the modified result object and saves it to the output argument */
                        
                        console.log(resultValue)
                        return null
                    })
                    this.setState({totalPrice:resultValue.price,time:resultValue.time})
                }

            }
            else{
                console.log('error')
            }
        }

        /* created order is sent for ordering  */
        else if((e.target.name==='order'||e.target.name==='sample')&&this.props.user._id){

            const multiOrder = e.target.name==='order'? this.state.multiOrder: {orderType:'sample',result:this.state.multiOrder[0].result}

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
                prevState.multiOrder[orderNumber]={result:{}}
                return {
                    multiOrder:prevState.multiOrder
                }
            })
        }
        /* ran for each component initially and on changes */

        /* Initiated order and result are saved to state respect. */
        this.setState((previousState)=>{
            let prevState = previousState.multiOrder[orderNumber]
            if(!prevState.result||!prevState.result.values){

                /* Initiates the result (for calculation) */
                prevState.result = resultInitial(values)

                return {
                    result:prevState.result
                }
            }
            else{

                /* time and value changes for the result are saved acc. to the index */
                prevState.result.values[values.index]=values.value
                prevState.result.time.values[values.index]=values.time 

                /* changed result and orders are saved */
                return {
                    result:prevState.result
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
                <p>{this.state.status?`${this.state.errMessage}`:<span/>}</p>
                <button onClick={this.handleClick} name='sample'>Request Sample</button>
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