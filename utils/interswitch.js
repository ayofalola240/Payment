let Buffer = require('buffer/').Buffer;
let crypto = require('crypto');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

module.exports = class Interswitch {
  constructor(options) {
    this.options = options
  }

  async optionsCheck(options) {
      // console.log(options);
      if (!options) {
          console.log("No option  parameter specified");
          return false
      }
      if (!options.clientId) {
          console.log("No clientId Specified");
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

async signature(){
	if (!this.optionsCheck(this.options)) return false;
	let url = await this._encodeUrl(this.options.url);
	let secret = this.options.secret ? this.options.secret : '';
	let clientId = this.options.clientId ? this.options.clientId : '';
	let method = this.options.method? this.options.method : '';
	let timeStamp =  Math.round(Date.now() / 1000);
	let nonce = await this.generateUUID();
    // console.log(nonce)
    // let nonce = '9954cf6ca0264efbab9eae422ca11671';
    let baseStringToBeSigned = method + "&" + url + "&" + timeStamp + "&" + nonce + "&" + clientId + "&" + secret;
	// console.log(baseStringToBeSigned)
    const hash = Buffer.from(crypto.createHash("sha1").update(baseStringToBeSigned, 'utf-8').digest("hex")).toString('base64')
     
	return {
		hash,
		timeStamp,
		nonce,
	};
}
async getBase64(str){
	return new Buffer(str).toString('base64');
};

async getHeader(){
	let signed = await this.signature();
    let base64 = Buffer.from(process.env.I_CLIENT_ID).toString('base64')
    const auth = await this.options.accessToken ? `Bearer ${this.options.accessToken}` : `InterswitchAuth ${base64}`
	let headers = {
    'Content-Type': 'application/json',
        Authorization:  auth,
        Signature: signed.hash,
        Timestamp: signed.timeStamp,
        Nonce: signed.nonce,
        SignatureMethod: this.options.encryptedMethod 
	};
    console.log(headers)
	return headers;
};

async getBiller(){
     const headers =await this.getHeader()
       try {
        const resp = await axios({
           method: this.options.method,
           headers: headers,
           url: this.options.url,
        });
        console.log(resp)
    } 
    catch (err) {
        // console.log(err)
     console.log(err.response.data) 
   }
}
};

