/* Initiates a result (for socket calculation) */
export const resultInitial = (values) =>{ //values from components (slider etc)
    let valueArray = []
    let timeArray = []

    /* values.index is the param's index from the components */
    valueArray[values.index] = values.value 
    timeArray[values.index]  = values.time
    
    return {
        workId:values.workId,
        values:valueArray,
        time:{
            values:timeArray
        }
    }
}