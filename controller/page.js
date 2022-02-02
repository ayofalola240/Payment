// async getHeader(){
//     const params = {
//         content_type: "application/json",
//         client_id: this.options.clientId,
//         http_method: this.options.method,
//         secret: this.options.secret,
//         url:this.options.url
// 	}
//     let resp
// 	try {
//            resp = await axios({
//            method: 'POST',
//            headers: {'Content-Type': 'application/json'},
//            url: "https://developer.interswitchng.com/console/generate_auth_headers.json",
//            data:  JSON.stringify(params)
//         });
//     } 
//     catch (err) {
//         console.log(err) 
//     }
// 	return resp;
// };

//  const resp = await this.getHeader()
//  if(!resp){
//      console.log("NO HEADER!")
//      return false
//  }
//  const {data} = resp
//  const {Authorization,Signature,Timestamp,Nonce,SignatureMethod} = data
//  const authorization = `${data.Authorization.split('=')[0]}=`
//  console.log(authorization)