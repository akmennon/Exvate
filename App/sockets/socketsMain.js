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
    let resultValue

    let output  //[{workId:"",price:1,time:1,amount:1}]

    /*-------------------- Result finder [executed for the frontend product page to obatin its result to calculate the price and time] --------------------*/
    socket.on('result',async (resultId)=>{
        try{
            const result = await Result.findOne({_id:resultId,})
            resultValue = result
        }
        catch(err){
            console.log('Error fetching result ',err)
        }
    })

    /*-------------------- Price calculator [Calculates the price with the params from the found result using Calcresult fn] --------------------*/
    socket.on('calculatePrice',(result)=>{

        let multiOutput = []    //used to send back the result from calculation

        if(resultValue.workId){
            if(result.length==1){   //checks if there is only a single order

                /* Saves the params to the relevant works in the result to calculate the price*/
                if(resultValue.workId.toString()!=result[0].workId){
                    socket.emit('errorResult',{status:false,statusCode:403,message:'Input error'})
                }
    
                resultValue.values = result[0].values
                resultValue.time.values = result[0].time.values
        
                /* Calculates the total price from the modified result object and saves it to the output argument */
                output = calcResult(resultValue)

                /* Sent back as an array */
                multiOutput = multiOutput.concat(output)
            }
            else{
                if(result.length==0){
                    socket.emit('errorResult',{status:false,statusCode:403,message:'Input error'})
                }
                /* Method to calculate price for multiple orders [Single order calculation with a loop] */
                result.map((result)=>{

                    /* Saves the params to the relevant works in the result to calculate the price*/
                    if(resultValue.workId!=result.workId){
                        socket.emit('errorResult',{status:false,statusCode:403,message:'Input error'})
                    }
        
                    resultValue.values = result.values
                    resultValue.time.values = result.time.values
            
                    /* Calculates the total price from the modified result object and saves it to the output argument */
                    output = calcResult(resultValue,output)

                    /* Sent back as an array */
                    multiOutput = multiOutput.concat(output)
                })
            }
        }
        else{
            socket.emit('errorResult',{status:false,statusCode:403,message:'Refresh'})
        }
        
        /* The total values are sent back to frontend */
        socket.emit('total',multiOutput)

    })
})

module.exports = io