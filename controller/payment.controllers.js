const catchAsync = require('../utils/catchAsync');
const Interswitch = require('../utils/interswitch')


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
  const data = await I.getBiller()
  // console.log(data)
      res.status(200).json({
        status:"success",
      })
})

exports.webhook = catchAsync(async (req, res, next) => {
  console.log(req.body)
      res.status(200).json({
        status:"success",
      })
})
