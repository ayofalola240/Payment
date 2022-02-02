let Buffer = require('buffer/').Buffer;
let crypto = require('crypto');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

module.exports = class Request{

    /**
   * 
   * @param {String} options.path -  path
   * @param {String} options.accessToken resource access token
   * @param {String} options.method request method
   */

constructor(options) {
    this.apiCredentials = {
        clientId: process.env.I_CLIENT_ID,
        secret: process.env.I_SECRET,
        baseUrl: process.env.I_BASE_URL,
        terminalId: process.env.I_TERMINAL_ID
    }
    this.options = options
    this.url = this.apiCredentials.baseUrl + this.options.path
    this.headers = {
        "Access-Control-Allow-Origin" : "*",
        'Content-Type': 'application/json',
    }
    this.generateRequestHeaders =  this.generateRequestHeaders.bind(this)
  }

async sendRequest(){
      let res
      let headers = await this.generateRequestHeaders()
      let data = this.options.payload? this.options.payload: {}
    
      try {
        res =  await axios({
              method: this.options.method.toUpperCase(),
              url: this.url,
              headers,
              data
          })
      } catch (err) {
        throw err
      }
      return res
  }

async _encodeUrl(url) {
    const encode = encodeURIComponent(url);
	return encode
};

async generateUUID() {
    const uuid = uuidv4().split('-').join('')
	return uuid;
};

async getBase64(str){
	return new Buffer(str).toString('base64');
};

async signature(){
	let url = await this._encodeUrl(this.url);
	let secret = this.apiCredentials.secret ? this.apiCredentials.secret : '';
	let clientId = this.apiCredentials.clientId ? this.apiCredentials.clientId : '';
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
async generateRequestHeaders(){
    let signed = await this.signature();
    let base64 = await this.getBase64(this.apiCredentials.clientId)
    const auth = await this.options.accessToken ? `Bearer ${this.options.accessToken}` : `InterswitchAuth ${base64}`
	
    return Object.assign(this.headers,{
        Authorization:  auth,
        Signature: signed.signature,
        Timestamp: signed.timestamp,
        Nonce: signed.nonce,
        SignatureMethod: this.options.encryptedMethod,
        terminalId:this.apiCredentials.terminalId
    })
  }
}