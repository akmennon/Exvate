
const timeCalc = (calcElement,resultElement,output) =>{

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

const multiply = (calcElement,resultElement,output) =>{
    let outputResult = output.find((value)=>{return value.workId === resultElement.workId})
    if(!outputResult){
        let endValue = {workId:resultElement.workId,price:1,time:1}
        calcElement.keys.forEach((key,index)=>{
            if(index===0){
                endValue.time =  resultElement.time.values[key]
            }else{
                endValue.time = endValue.time *  resultElement.time.values[key]
            }
        })
        output.push(endValue)
    }
    else{
        let time
        calcElement.keys.forEach((key,index)=>{
            if(index===0){
                time =  resultElement.time.values[key]
            }else{
                time = time *  resultElement.time.values[key]
            }
        })
        outputResult.time = outputResult.time + time
    }
}

const add = (calcElement,resultElement,output) =>{
    let outputResult = output.find((value)=>{return value.workId === resultElement.workId})
    if(!outputResult){
        let endValue = {workId:resultElement.workId,price:1,time:1}
        calcElement.keys.forEach((key,index)=>{
            if(index===0){
                endValue.time =  resultElement.time.values[key]
            }else{
                endValue.time = endValue.time +  resultElement.time.values[key]
            }
        })
        output.push(endValue)
    }
    else{
        let time
        calcElement.keys.forEach((key,index)=>{
            if(index===0){
                time =  resultElement.time.values[key]
            }else{
                time = time +  resultElement.time.values[key]
            }
        })
        outputResult.time = outputResult.time + time
    }
}

const subtract = (calcElement,resultElement,output) =>{
    let outputResult = output.find((value)=>{return value.workId === resultElement.workId})
    if(!outputResult){
        let endValue = {workId:resultElement.workId,price:1,time:1}
        calcElement.keys.forEach((key,index)=>{
            if(index===0){
                endValue.time =  resultElement.time.values[key]
            }else{
                endValue.time = endValue.time -  resultElement.time.values[key]
            }
        })
        output.push(endValue)
    }
    else{
        let time
        calcElement.keys.forEach((key,index)=>{
            if(index===0){
                time =  resultElement.time.values[key]
            }else{
                time = time -  resultElement.time.values[key]
            }
        })
        outputResult.time = outputResult.time + time
    }
}

const divide = (calcElement,resultElement,output) =>{
    let outputResult = output.find((value)=>{return value.workId === resultElement.workId})
    if(!outputResult){
        let endValue = {workId:resultElement.workId,price:1,time:1}
        calcElement.keys.forEach((key,index)=>{
            if(index===0){
                endValue.time =  resultElement.time.values[key]
            }else{
                endValue.time = endValue.time /  resultElement.time.values[key]
            }
        })
        output.push(endValue)
    }
    else{
        let time
        calcElement.keys.forEach((key,index)=>{
            if(index===0){
                time =  resultElement.time.values[key]
            }else{
                time = time /  resultElement.time.values[key]
            }
        })
        outputResult.time = outputResult.time + time
    }
}

module.exports = timeCalc