import React from 'react'
import Slider from '@material-ui/core/Slider'

/* Slider with sets of values */

class TierSlider extends React.Component{
    constructor(props){
        super(props)
        this.state={
            call:'',
            /* finds the initial tier values */
            initial:this.props.params.values.find((element)=>{ return element.initial===true}),
            /* initial object for values */
            values:{
                value:0,
                time:0,
                index:this.props.paramIndex,
                workId:this.props.workId
            }
        }

        this.handleChange = this.handleChange.bind(this)
    }

    /* handleValues prop is the addValues prop from the work component*/

    handleChange(e,value){
        const mark = this.props.params.values.find((element) => { return element.value === value })
        this.setState((prevState)=>{
            prevState.values.value=value
            prevState.values.time=mark.time
            return {
                values:prevState.values
            }
        })
        this.props.handleValues(this.state.values,this.props.params,this.props.orderNumber)
    }

    /* DidMount and DidUpdate used together to obtain the initial values of each component*/

        /* values and time from the slider is saved and send to calculate */
    componentDidMount(){
                const values = this.state.values        
                values.value=this.state.initial.value
                values.time=this.state.initial.time
                this.props.handleValues(values,this.props.params,this.props.orderNumber)
        }

    componentDidUpdate(){
        if(!this.state.call){
            this.setState({call:true},()=>{
                const values = this.state.values
                values.value=this.state.initial.value
                values.time=this.state.initial.time
                this.props.handleValues(values,this.props.params,this.props.orderNumber)
            })
        }
    }

    render(){
        return(
                <div style={{width:300,marginLeft:30}}>
                    <Slider
                        defaultValue={this.state.initial.value}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        step={null}
                        marks={this.props.params.values}
                        onChangeCommitted={this.handleChange}
                        /* min and max values taken from array indexes (bugs) */
                        max={this.props.params.values[(this.props.params.values.length)-1].value}
                        min={this.props.params.values[0].value}
                    />
                </div>
        )
    }
}

export default TierSlider