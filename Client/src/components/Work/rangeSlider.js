import React from 'react'
import Slider from '@material-ui/core/Slider'

/* 

    PENDING :
        Time calculation to be changed - in result

*/

class RangeSlider extends React.Component{
    constructor(props){
        super(props)
        this.state={
            call:'',
            /* values are used and initiated */
            values:{
                initialValue:this.props.params.values[0].value,
                initialTime:this.props.params.values[0].time,
                value:this.props.params.values[0].value,
                time:this.props.params.values[0].time,
                index:this.props.paramIndex,
                workId:this.props.workId,
                workIndex:this.props.workIndex
            }
        }

        this.handleChange = this.handleChange.bind(this)
    }


    handleChange(e,value){
        this.setState((prevState)=>{
            prevState.values.value=Number(value)
            return {
                values:prevState.values
            }
        },()=>{
            this.props.handleValues(this.state.values,this.props.params,this.props.orderNumber)
        })
    }

    /* DidMount and DidUpdate used together to obtain the initial values of each component*/

        /* values and time from the slider is saved and send to calculate */
    componentDidUpdate(){
        if(!this.state.call){
            this.setState({call:true},()=>{
                this.props.handleValues(this.state.values,this.props.params,this.props.orderNumber)
            })
        }
    }

    componentDidMount(){
            this.props.handleValues(this.state.values,this.props.params,this.props.orderNumber)
        }

    render(){
        return(
            <div style={{width:300,marginLeft:30}}>
                <Slider
                    defaultValue={this.state.values.initialValue}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={100}
                    onChangeCommitted={this.handleChange}
                    /* min and max values are already present */
                    max={this.props.params.values[0].max}
                    min={this.props.params.values[0].min}
                />
            </div>
        )
    }
}

export default RangeSlider