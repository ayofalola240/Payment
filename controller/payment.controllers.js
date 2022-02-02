const catchAsync = require('../utils/catchAsync');
// const InterswitchPayment= require('../utils/interswitch')
const Request = require('../Interswitch/Request')
const Etransact = require('../utils/etransact');



/////////////Inter-Switch///////////////
exports.getInterSwitchToken = catchAsync(async (req, res, next) => {
  const options = {
    url:"https://sandbox.interswitchng.com/api/v2/quickteller/categorys",
    method: "GET",
    encryptedMethod:"SHA1"
  }
  const apiCredentials ={
    clientId: process.env.I_CLIENT_ID,
    secret: process.env.I_SECRET,
  }
  const getBillers = new Request(apiCredentials,options)
  try {
    const res = await getBillers.sendRequest()
    console.log(res.data)
  } catch (err) {
    console.log(err)
  }

  // const I = new InterswitchPayment(options)
  // await I.getBiller()
  
      res.status(200).json({
        status:"success",
      })
})

exports.etransactRequest = catchAsync(async (req, res, next) => {   
  const E = new Etransact()
  await E.orderRequest()

      res.status(200).json({
        status:"success",
      })
})


exports.etransactWebhook = catchAsync(async (req, res, next) => {   
    console.log(res.body)
      res.status(200).json({
        status:"success",
      })
})
