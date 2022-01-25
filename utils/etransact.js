const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

module.exports = class Etransact {
  constructor(options) {
    this.options = options
  }

async orderRequest(){
    const terminal_id = "0000000001";
    const secret_key = "DEMO_KEY";
    const response_url = "https://demo240.herokuapp.com/payments/etransact"
    const trans_id = uuidv4().split('-').join('')
    const description = {ref: order_id}
    const amount = "5000"
    const stringToBeSigned = `${amount}+${terminal_id}+${trans_id}+${response_url}+${secret_key}`
    const checksum = crypto.createHash('md5').update(stringToBeSigned ).digest('hex');

    const body = {
       TERMINAL_ID : terminal_id,
       TRANSACTION_ID: trans_id,
       AMOUNT:amount,
       DESCRIPTION: description,
       RESPONSE_URL: response_url,
       LOGO_URL:"https://www.samplesite.com/webconnect/mylogo.gif",
       CURRENCY_CODE: "NGN",
       EMAIL: "ayofalola240@gmail.com",
       FULL_NAME:"Ayo Falola",
       CHECKSUM: checksum,
       PHONENO:"08083521434"
     }
     
       try {
        const resp = await axios({
           method: "POST",
           headers:{
              'Content-Type':'Application/www'
           },
           url: 'https://demo.etranzactng.com/webconnect/v3/caller.jsp',
           body
        });
        console.log(resp)
    } 
    catch (err) {
        console.log(err)
    //  console.log(err.response.data) 
   }
}
};

