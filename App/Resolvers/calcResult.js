/* Calculates the total price of the work */
const valueCalc = require('./CalcResult/valueCalc')

/* Calculates the total time taken for the work */
const timeCalc = require('./CalcResult/timeCalc')

/* Function that calculates the output from the result */

const calcResult = (result) =>{
    let output=[]/*[{workId:"",price:1,time:1,amount:1}]*/

    result.map((element,resIndex)=>{

        /* checks preValues (if values should be obtained from previous work) 
            Eg - number of designs difference on manufacturing increasing price
        */
        if(element.preValues.length===0){
            valueKeys=[]
            timeKeys=[]

            element.calc.map((calcElement)=>{
                valueCalc(calcElement,element,output)
                valueKeys = [...new Set([...valueKeys,...calcElement.keys])]
            })

            element.time.calc.map((calcElement)=>{
                timeCalc(calcElement,element,output)
                timeKeys = [...new Set([...timeKeys,...calcElement.keys])]
            })

            element.values.map((value,index)=>{
                if(!valueKeys.includes(index)){
                    output[resIndex].price = output[resIndex].price + value
                }
            })

            element.time.values.map((time,index)=>{
                if(!timeKeys.includes(index)){
                    output[resIndex].time = output[resIndex].time + time
                }
            })

            return element
        }
        else{
            valueKeys=[]
            timeKeys=[]

            /* Saves the values from the previous result work */
            element.preValues.map((prev)=>{
                
                /* finds the required result from the workId */
                let foundResult = result.find(work => { return work.workId == prev.workId })

                /* time and values are saved to the current result */
                element.values.push(foundResult.values[prev.prevKey])
                element.time.values.push(foundResult.time.values[prev.prevKey])
            })


            element.calc.map((calcElement)=>{
                valueCalc(calcElement,element,output)
                valueKeys = [...new Set([...valueKeys,...calcElement.keys])]
            })

            element.time.calc.map((calcElement)=>{
                timeCalc(calcElement,element,output)
                timeKeys = [...new Set([...timeKeys,...calcElement.keys])]
            })

            element.values.map((value,index)=>{
                if(!valueKeys.includes(index)){
                    output[resIndex].price = output[resIndex].price + value
                }
            })

            element.time.values.map((time,index)=>{
                if(!timeKeys.includes(index)){
                    output[resIndex].time = output[resIndex].time + time
                }
            })
        }

        return element
    })

    return output

}

module.exports = calcResult