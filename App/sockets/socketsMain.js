/*-------------------- Socketio Server [called in index.js] --------------------*/

/* 

    PENDING:
        Time calculation

*/

/* io variable imported from servers.js */
const io = require('../../servers').io

/* Function which calculates the price and time from the inputs */
const calcResult = require('../Resolvers/calcResult')

const mongoose = require('mongoose')

/* Required model */
const Result = mongoose.model('Result')

/* Admin Namespace and its functions */

require('./adminSocket')

/* Main namespace connection */

io.on('connection',(socket)=>{
    console.log('Socket has been connected')
})

/*-------------------- Order Namespace [executed when user accesses a product page from the frontend] --------------------*/

io.of('/orderfn').on('connection',(socket)=>{
    let resultValue,order

    let output  //[{workId:"",price:1,time:1,amount:1}]

    /*-------------------- Result finder [executed for the frontend product page to obatin its result to calculate the price and time] --------------------*/
    socket.on('result',async (resultId)=>{
        try{
            const result = await Result.findOne({_id:resultId})
            resultValue = result.result
        }
        catch(err){
            console.log('Error fetching result ',err)
        }
    })

    /*-------------------- Price calculator [Calculates the price with the params from the found result using Calcresult fn] --------------------*/
    socket.on('calculatePrice',(result)=>{

        let multiOutput = []    //used to send back the result from calculation

        if(result.length==1){   //checks if there is only a single order

                result = result[0]  //input is send as an array (since there is a possibility of multiple orders)

                /* The inputs are saved to the found result from the database to calculate the values*/
                const tempValue = resultValue.map((elements)=>{

                    /* Saves the params to the relevant works in the result to calculate the price*/
                    let foundResult = result.find((element)=>{
                        return elements.workId==element.workId
                    })
        
                    elements.values = foundResult.values
                    elements.time.values = foundResult.time.values
        
                    return elements
                })
        
                /* Calculates the total price from the modified result object and saves it to the output argument */
                output = calcResult(tempValue,output)

                /* Sent back as an array */
                multiOutput = multiOutput.concat(output)
        }
        else{

            /* Method to calculate price for multiple orders [Single order calculation with a loop] */
            result.map((result)=>{

                const tempValue = resultValue.map((elements)=>{
                    let foundResult = result.find((element)=>{
                        return elements.workId==element.workId
                    })
        
                    elements.values = foundResult.values
                    elements.time.values = foundResult.time.values
        
                    return elements
                })
        
                output = calcResult(tempValue,output)
        
                console.log(output)

                multiOutput = multiOutput.concat(output)
            })
        }
        
        /* The total values are sent back to frontend */
        socket.emit('total',multiOutput)

    })
})

module.exports = io