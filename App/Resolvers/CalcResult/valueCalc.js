
/* Selects which operation should be executed from the result */
const valueCalc = (calcElement,resultElement,output) =>{

    switch(calcElement.method){
        case 'multiply':
            multiply(calcElement,resultElement,output)
            break;
        case 'add':
            add(calcElement,resultElement,output)
            break;
        case 'subtract':
            subtract(calcElement,resultElement,output)
            break;
        case 'divide':
            divide(calcElement,resultElement,output)
            break;
        default:
            console.log('valueCalc switch error')
    }

}

/* multiplies the values based on the keys */
const multiply = (calcElement,resultElement,output) =>{
    /* calcElement - element in result.calc , resultElememt - result element */
    
    /* checks for the output element for each work */
    let outputResult = output.find((value)=>{return value.workId === resultElement.workId})
    if(!outputResult){

        /* Initiates a new element since none is present for the work*/
        let endValue = {workId:resultElement.workId,price:1,time:1}

        /* uses the keys in calc and does the respective calculation */
        calcElement.keys.forEach((key,index)=>{
            if(index===0){
                endValue.price =  resultElement.values[key]
            }else{
                endValue.price = endValue.price * resultElement.values[key]
            }
        })
        output.push(endValue)
    }

    /* PENDING - if more than one calculation operation should be done */
    else{
        let price
        calcElement.keys.forEach((key,index)=>{
            if(index===0){
                price =  resultElement.values[key]
            }else{
                price = price * resultElement.values[key]
            }
        })
        outputResult.price = outputResult.price + price
    }
}

const add = (calcElement,resultElement,output) =>{
    /* calcElement - element in result.calc , resultElememt - result element */
    
    /* checks for the output element for each work */
    let outputResult = output.find((value)=>{return value.workId === resultElement.workId})
    if(!outputResult){

        /* Initiates a new element since none is present for the work*/
        let endValue = {workId:resultElement.workId,price:1,time:1}

        /* uses the keys in calc and does the respective calculation */
        calcElement.keys.forEach((key,index)=>{
            if(index===0){
                endValue.price =  resultElement.values[key]
            }else{
                endValue.price = endValue.price + resultElement.values[key]
            }
        })
        output.push(endValue)
    }

    /* PENDING - if more than one calculation operation should be done */
    else{
        let price
        calcElement.keys.forEach((key,index)=>{
            if(index===0){
                price =  resultElement.values[key]
            }else{
                price = price + resultElement.values[key]
            }
        })
        outputResult.price = outputResult.price + price
    }
}

const subtract = (calcElement,resultElement,output) =>{
    /* calcElement - element in result.calc , resultElememt - result element */
    
    /* checks for the output element for each work */
    let outputResult = output.find((value)=>{return value.workId === resultElement.workId})
    if(!outputResult){

        /* Initiates a new element since none is present for the work*/
        let endValue = {workId:resultElement.workId,price:1,time:1}

        /* uses the keys in calc and does the respective calculation */
        calcElement.keys.forEach((key,index)=>{
            if(index===0){
                endValue.price =  resultElement.values[key]
            }else{
                endValue.price = endValue.price - resultElement.values[key]
            }
        })
        output.push(endValue)
    }

    /* PENDING - if more than one calculation operation should be done */
    else{
        let price
        calcElement.keys.forEach((key,index)=>{
            if(index===0){
                price =  resultElement.values[key]
            }else{
                price = price - resultElement.values[key]
            }
        })
        outputResult.price = outputResult.price + price
    }
}

const divide = (calcElement,resultElement,output) =>{
    /* calcElement - element in result.calc , resultElememt - result element */
    
    /* checks for the output element for each work */
    let outputResult = output.find((value)=>{return value.workId === resultElement.workId})
    if(!outputResult){

        /* Initiates a new element since none is present for the work*/
        let endValue = {workId:resultElement.workId,price:1,time:1}

        /* uses the keys in calc and does the respective calculation */
        calcElement.keys.forEach((key,index)=>{
            if(index===0){
                endValue.price =  resultElement.values[key]
            }else{
                endValue.price = endValue.price / resultElement.values[key]
            }
        })
        output.push(endValue)
    }

    /* PENDING - if more than one calculation operation should be done */
    else{
        let price
        calcElement.keys.forEach((key,index)=>{
            if(index===0){
                price =  resultElement.values[key]
            }else{
                price = price / resultElement.values[key]
            }
        })
        outputResult.price = outputResult.price + price
    }
}

module.exports = valueCalc