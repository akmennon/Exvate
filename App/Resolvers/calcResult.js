/* Calculates the total price of the work */
const valueCalc = require('./CalcResult/valueCalc')

/* Calculates the total time taken for the work */
const timeCalc = require('./CalcResult/timeCalc')

/* Function that calculates the output from the result */

const calcResult = (resultValue) =>{
    let output=[]/*[{workId:"",price:1,time:1,amount:1}]*/

    valueKeys=[]
    timeKeys=[]

    resultValue.calc.map((calcElement)=>{
        valueCalc(calcElement,resultValue,output)
        valueKeys = [...new Set([...valueKeys,...calcElement.keys])]
    })

    resultValue.time.calc.map((calcElement)=>{
        timeCalc(calcElement,resultValue,output)
        timeKeys = [...new Set([...timeKeys,...calcElement.keys])]
    })

    resultValue.values.map((value,index)=>{
        if(!valueKeys.includes(index)){
            output.price = output.price + value
        }
    })

    resultValue.time.values.map((time,index)=>{
        if(!timeKeys.includes(index)){
            output.time = output.time + time
        }
    })

    return output

}

module.exports = calcResult