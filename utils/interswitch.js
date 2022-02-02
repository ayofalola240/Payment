let Buffer = require('buffer/').Buffer;
let crypto = require('crypto');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

module.exports = class InterswitchPayment {
  constructor(options, env='') {
    // if(!env) env = "SANDBOX";
    // console.log(options)
    this.options = options
    // this.interswitch = new Interswitch(process.env.I_CLIENT_ID, process.env.I_SECRET, env);
  }

  async optionsCheck(options) {
      if (!options) {
          console.log("No option  parameter specified");
          return false
      }
      if (!options.clientId) {
        //   console.log("No clientId Specified");
          return false
      }
      if (!options.secret) {
          console.log("No secret specified");
          return false
      }
      if (!options.url) {
          console.log("No endpoint url");
          return false
      }
      return true;
  };

async _encodeUrl(url) {
    const encode = encodeURIComponent(url);
    // console.log(encode)
	return encode
};

async generateUUID() {
    const uuid = uuidv4().split('-').join('')
    // console.log(uuid)
	return uuid;
};

async getBase64(str){
	return new Buffer(str).toString('base64');
};

async signature(){
	if (!this.optionsCheck(this.options)) return false;
	let url = await this._encodeUrl(this.options.url);
	let secret = this.options.secret ? this.options.secret : '';
	let clientId = this.options.clientId ? this.options.clientId : '';
	let method = this.options.method? this.options.method : '';
	let timestamp =  Math.floor(Date.now() / 1000);
	let nonce = await this.generateUUID();
    let signatureContent =`${method}&${url}&${timestamp}&${nonce}&${clientId}&${secret}`
    let signature = crypto.createHash('sha1').update(signatureContent).digest('base64')
 
	return {
		signature,
		timestamp,
		nonce,
	};
}


async getHeader(){
	let signed = await this.signature();
    let base64 = await this.getBase64(process.env.I_CLIENT_ID)
    const auth = await this.options.accessToken ? `Bearer ${this.options.accessToken}` : `InterswitchAuth ${base64}`
	let headers = {
        "Access-Control-Allow-Origin" : "*",
        'Content-Type': 'application/json',
        Authorization:  auth,
        Signature: signed.signature,
        Timestamp: signed.timestamp,
        Nonce: signed.nonce,
        SignatureMethod: this.options.encryptedMethod 
	};
    // console.log(headers)
	return headers;
};

async getBiller(){
     const data = await this.getHeader() 
      console.log(data)
        try {
            const resp = await axios({
            method: this.options.method,
            headers: {
                "Access-Control-Allow-Origin" : "*",
                'Content-Type': 'application/json',
                Authorization: data.Authorization,
                Signature: data.Signature,
                Timestamp: data.Timestamp,
                Nonce: data.Nonce,
                SignatureMethod: data.SignatureMethod
            },
            url: this.options.url,
            });
            console.log(resp)
        } 
        catch (err) {
            console.log(err)
        // console.log(err.response.data) 
    }

};

}