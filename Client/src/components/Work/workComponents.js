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
            order:{},
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
            console.log(this.state.order)

            const result = Object.assign({},this.props.work.result)
            
            if(result){
                
                let resultValue = {}

                let output

                result.values = this.state.order.result.values
                result.time.values = this.state.order.result.time.values
        
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

                this.setState({totalPrice:resultValue.price,time:resultValue.time})

            }
            else{
                console.log('error')
            }
        }

        /* created order is sent for ordering  */
        else if((e.target.name==='order'||e.target.name==='sample')&&this.props.user._id){

            const order = e.target.name==='order'? this.state.order: {orderType:'sample',result:this.state.order.result}

            const redirect = () =>{
                this.props.parent.history.push(`/orderPreview/${this.props.work._id}`)
            }

            this.props.dispatch(startsetOrder(order,redirect))
            console.log(this.props.order)
        }

        /* redirect to login if no userId present in redux */
        else{
            this.props.parent.history.push('/user/login')
        }
    }

    /* function which obtains the values from the components and creates an ordered result */
    addValue = async (values,params) =>{
        if(this.state.order===undefined){
            this.setState((prevState)=>{
                prevState.order={result:{}}
                return {
                    ...prevState
                }
            })
        }
        /* ran for each component initially and on changes */

        /* Initiated order and result are saved to state respect. */
        this.setState((previousState)=>{
            let prevState = previousState.order
            if(!prevState.result||!prevState.result.values){

                /* Initiates the result (for calculation) */
                prevState.result = resultInitial(values)

                return {
                    ...previousState
                }
            }
            else{

                /* time and value changes for the result are saved acc. to the index */
                prevState.result.values[values.index]=values.value
                prevState.result.time.values[values.index]=values.time 

                /* changed result and orders are saved */
                return {
                    ...previousState
                }
            }
        })
    }

    /* Component which creates sliders etc from the passed params */

    makeElements = (params,Paramindex,workId) =>{ 
        switch(params.optionType){
            case 'slider':
                if(params.tierType===true){ //To check the type of sliders
                    return (
                        <TierSlider paramIndex={Paramindex} params={params} workId={workId} handleValues={this.addValue} key={params._id} />
                    )
                }
                else{
                    return (
                        <RangeSlider paramIndex={Paramindex} params={params} workId={workId} handleValues={this.addValue} key={params._id} />
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
                <div >
                    <h1>{this.props.work.workTitle}</h1>
                    {   
                        //Loop to render components such as sliders from each params
                        this.props.work.options.params.map((param,paramIndex)=>{
                            return this.makeElements(param,paramIndex,this.props.work._id)
                        })
                    }
                </div>
                <p>{this.state.totalPrice?`Total Price - ${this.state.totalPrice}`:<span/>}</p>
                <p>{this.state.status?`${this.state.errMessage}`:<span/>}</p>
                {
                    this.props.work.result.sampleAvailable?<button onClick={this.handleClick} name='sample'>Request Sample</button>:<span/>
                }
                <button onClick={this.handleClick} name='price'>Check Price</button>
                <button onClick={this.handleClick} name='order'>Order</button>
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