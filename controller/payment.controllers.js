const catchAsync = require('../utils/catchAsync');
const Interswitch = require('../utils/interswitch')
const Etransact = require('../utils/etransact')


/////////////Inter-Switch///////////////
exports.getInterSwitchToken = catchAsync(async (req, res, next) => {
  const options = {
    clientId: process.env.I_CLIENT_ID,
    secret: process.env.I_SECRET,
    url:"https://sandbox.interswitchng.com/api/v2/quickteller/categorys",
    method: "GET",
    encryptedMethod:"SHA1"
  }
  const I = new Interswitch(options)
  await I.getBiller()
  
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
