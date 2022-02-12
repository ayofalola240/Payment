const Request = require('./Request');

/**
 * Retrieve billers based on the supplied search criteria
 * @return {Promise} return billers
 */
exports.getBillers = async (req, res, next) => {
  const options = {
    path: 'api/v2/quickteller/categorys',
    method: 'GET',
    encryptedMethod: 'SHA1',
  };
  const request = new Request(options);
  let response;
  try {
    response = await request.sendRequest();
    const data = response ? response.data : {};

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err) {
    console.log(err.response.data);
    next(err);
  }
};

/**
 * Retrieve billers based on the supplied search criteria
 * @param {Number} categoryId An ID of the category to be returned.
 * Please use a valid value returned from Get Categories API
 * @return {Promise} return billers by category
 */
exports.getBillersByCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const options = {
    path: `api/v2/quickteller/categorys/${categoryId}/billers`,
    method: 'GET',
    encryptedMethod: 'SHA1',
  };
  const request = new Request(options);
  let response;
  try {
    response = await request.sendRequest();
    const data = response ? response.data : {};

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err) {
    console.log(err.response.data);
    next(err);
  }
};

/**
 * Retrieve billers based on the supplied search criteria
 * @param {Number} billerId Unique per biller. Returned in GetBillers response
 * @return {Promise} return billers by category
 */
exports.getBillerPaymentItems = async (req, res, next) => {
  const billerId = req.params.billerId;
  const options = {
    path: `api/v2/quickteller/billers/${billerId}/paymentitems`,
    method: 'GET',
    encryptedMethod: 'SHA1',
  };
  const request = new Request(options);
  let response;
  try {
    response = await request.sendRequest();
    const data = response ? response.data : {};

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err) {
    console.log(err.response.data);
    next(err);
  }
};

/**
 * Notify the biller of the payment
 * @param {Object} requestPayload - request payload
 * @param {String} requestPayload.TerminalId - Terminal ID assigned by Interswitch
 * @param {String} requestPayload.paymentCode - Unique payment code retrieved from
 * GetBillerPaymentItems call
 * @param {String} requestPayload.customerId - Customer’s Unique Identifier
 * @param {String} [requestPayload.customerMobile] - Customer’s Mobile Number
 * @param {String} [requestPayload.customerEmail] - Customer's Email
 * @param {Number} requestPayload.amount - Amount Paid by customer. Amount should
 * be sent in lower denomination
 * @param {String} requestPayload.requestReference - Unique requestReference
 * generated on Client’s system and sent in DoTransfer request. 4 digit
 * requestreference prefix will be provided by Interswitch.
 * @return {Promise} return payment information
 */
exports.sendBillPaymentAdvice = async (req, res, next) => {
  const ref = '1194000023';
  let data = req.body;
  const requestPayload = { ...data, requestReference: ref };
  //   console.log(requestPayload);
  const options = {
    path: 'api/v2/quickteller/payments/advices',
    method: 'POST',
    encryptedMethod: 'SHA1',
    payload: requestPayload,
  };
  const request = new Request(options);
  let response;
  try {
    response = await request.sendRequest();
    const data = response ? response.data : {};

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err) {
    console.log(err.response.data);
    next(err);
  }
};
