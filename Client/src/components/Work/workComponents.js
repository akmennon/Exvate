import React, { useState } from 'react'
import TierSlider from './tierSlider'
import RangeSlider from './rangeSlider'
import {connect, useDispatch, useSelector} from 'react-redux'
import {resultInitial} from './workFns'
import {startsetOrder} from '../../action/orderAction'
import calcResult from '../resolvers/calcResult'
import { useNavigate } from 'react-router-dom'

/* 

    Pending :
        Dropdown and checkbox
        Redirect to this page after logging in
        checkbox for sliders to be implemented
        Time calculation

*/

/* Component which decodes the options to creates components ( sliders, dropdowns etc ) */

function WorkComponents (props) {

    const [state,setState] = useState({
        order:{},
        totalPrice:'',
        status:true,
        errMessage:'',
        time:''
    })
    const navigate = useNavigate()
    const user = useSelector(state=>state.user)
    const dispatch = useDispatch()

    /* Creates the entire result or order makes it to be sent to the server */

    const handleClick = (e) =>{  

        /* The created result is calculated for the price from the work result */
        if(e.target.name==='price'){
            console.log(state.order)

            const result = Object.assign({},props.work.result)
            
            if(result){
                
                let resultValue = {}

                let output

                result.values = state.order.result.values
                result.time.values = state.order.result.time.values
        
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

                setState(p=>({...p,totalPrice:resultValue.price,time:resultValue.time}))

            }
            else{
                console.log('error')
            }
        }

        /* created order is sent for ordering  */
        else if((e.target.name==='order'||e.target.name==='sample')&&user._id){

            const order = e.target.name==='order'? state.order: {orderType:'sample',result:state.order.result}

            const redirect = () =>{
                navigate(`/orderPreview/${props.work._id}`)
            }

            dispatch(startsetOrder(order,redirect))
            console.log(order)
        }

        /* redirect to login if no userId present in redux */
        else{
            navigate('/user/login')
        }
    }

    /* function which obtains the values from the components and creates an ordered result */
    const addValue = async (values,params) =>{
        if(state.order===undefined){
            setState((prevState)=>{
                prevState.order={result:{}}
                return {
                    ...prevState
                }
            })
        }
        /* ran for each component initially and on changes */

        /* Initiated order and result are saved to state respect. */
        setState((previousState)=>{
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

    const makeElements = (params,Paramindex,workId) =>{ 
        switch(params.optionType){
            case 'slider':
                if(params.tierType===true){ //To check the type of sliders
                    return (
                        <TierSlider paramIndex={Paramindex} params={params} workId={workId} handleValues={addValue} key={params._id} />
                    )
                }
                else{
                    return (
                        <RangeSlider paramIndex={Paramindex} params={params} workId={workId} handleValues={addValue} key={params._id} />
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

    return(
        <div>
            <div >
                <h1>{props.work.workTitle}</h1>
                {   
                    //Loop to render components such as sliders from each params
                    props.work.options.params.map((param,paramIndex)=>{
                        return makeElements(param,paramIndex,props.work._id)
                    })
                }
            </div>
            <p>{state.totalPrice?`Total Price - ${state.totalPrice}`:<span/>}</p>
            <p>{state.status?`${state.errMessage}`:<span/>}</p>
            {
                props.work.result.sampleAvailable?<button onClick={handleClick} name='sample'>Request Sample</button>:<span/>
            }
            <button onClick={handleClick} name='price'>Check Price</button>
            <button onClick={handleClick} name='order'>Order</button>
        </div>
    )
}

export default WorkComponents