/* Inititates the suborders */
export const orderInitial = (values,userId,params) =>{
    /* variables array created for variables array in order schema */
    let variables = []

    /* value from the components saved to variables array*/
    variables[values.index] = {
        title:params.title,
        value:values.value,
        unit:params.unit
    }

    /* workId and userId saved for the order strucutre since its required for every order */
    return {
        workId:values.workId,
        userId:userId,
        values:{
            variables:variables
        }
    }
}

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