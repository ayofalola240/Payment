const axios = require('axios');


module.exports = class Etransact {
  constructor(options) {
    this.options = options
  }

async orderRequest(){
    const terminal_id = 0000000001;
    const secrect_key = DEMO_KEY;

     const headers =await this.getHeader()
       try {
        const resp = await axios({
           method: "POST",
           headers:{
               
           },
           url: 'https://demo.etranzactng.com/webconnect/v3/caller.jsp',
        });
        console.log(resp)
    } 
    catch (err) {
        // console.log(err)
     console.log(err.response.data) 
   }
}
};

