const sgMail = require('@sendgrid/mail')

/* function to send mail with a given mail data */

const sendMail = (mailData) =>{
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  return sgMail
    .send(mailData)
    .then(() => {
      console.log('Email sent')
      return Promise.resolve('Mail Sent')
    })
    .catch((error) => {
      console.error(error)
      Promise.reject(error)
    })

}

module.exports = sendMail