const nodemailer = require('nodemailer')

/* function to send mail with a given mail data */

const sendMail = (mailData) =>{
    let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'kajaymenon@hotmail.com', // generated ethereal user
          pass: process.argv[2] // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
        }
      })
    
      // send mail with defined transport object
    return transporter.sendMail(mailData)
            .then((info)=>{
                console.log("Message sent: %s", info.messageId);
                return Promise.resolve(info)
            })
            .catch((err)=>{
                return Promise.reject(err)
            })

}

module.exports = sendMail