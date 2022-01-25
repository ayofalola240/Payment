const LocalStorage = require('node-localstorage').LocalStorage
const Stylist = require('../models/stylist')
const axios = require('axios');
const Email = require('./email')
const { v4: uuidv4 } = require('uuid');

localStorage = new LocalStorage('./scratch');

module.exports = class Account {
  constructor(user) {
    this.user = user  
  }
async assignBankAccount() {	
    if (!this.user.account || (this.user.account && !this.user.account.accountNumber)){
        console.log("assigning account number");
        const account = await this.assignVirtualAccount();
        // console.log(account.assigned);
        if (account.assigned) {
            const newAccount = account.account;
            try{
                await Stylist.findByIdAndUpdate(this.user._id,{account: newAccount})
            }catch(err){
               console.log({ err: err.message });
            }
            //mail details to customer
            await new Email( this.user, '' ).sendAccountDetails(newAccount);    
        }
    }
}
async initiateTransfer(data){
    console.log('INITIATE TRANSFER!')
    const payload = {
        amount: data.withdrawalAmount,
        reference:uuidv4(),
        narration:"Withdraw Fund",
        currency: "NGN",
        destinationBankCode: data.bankCode,
        destinationAccountNumber: data.accountNumber,
        sourceAccountNumber: process.env.WALLET_ACCOUNT_NUMBER
    }
    const requestUrl = `${process.env.MONNIFY_BASE_URL}/api/v2/disbursements/single`
    try {
        const resp = await axios({
           method: 'POST',
           headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await this.getMonnifyToken()}`
           },
           url: requestUrl,
           timeout: 15000,
           data: payload
        });
        const {requestSuccessful, responseBody } = resp.data
        if (requestSuccessful){
            return { status: true, responseBody };
        }
        else{
            return { status: false, responseBody };
        }
    } 
    catch (err) {
         console.log(`err: ${err.message}`)
   }
}
async authorizeTransfer(data){
    console.log('AUTHORIZING TRANSFER!')
    const payload = {
        reference:data.reference,
        authorizationCode:data.authorizationCode
    }

    const requestUrl = `${process.env.MONNIFY_BASE_URL}/api/v2/disbursements/single/validate-otp`
       try {
        const resp = await axios({
           method: 'POST',
           headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await this.getMonnifyToken()}`
           },
           url: requestUrl,
           timeout: 15000,
           data: payload
        });
        // console.log(resp.data)
        const {requestSuccessful, responseBody } = resp.data
        if (requestSuccessful && (responseBody.status === "SUCCESS")){
            return { status: true, responseBody };
        }
        else{
            return { status: false, responseBody };
        }
    } 
    catch (err) {
         console.log(`err: ${err.message}`)
   }
}
async removeBankAccount() {
    if ( this.user.account && this.user.account.accountNumber){
        const accountReference = this.user.account.accountReference
        try{
             await axios.delete(
                `${process.env.MONNIFY_BASE_URL}/api/v1/bank-transfer/reserved-accounts/reference/${accountReference}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${await this.getMonnifyToken()}`,
                    },
                    timeout: 15000,
                }
            );
        return {removed: true}
        }catch(err){
            console.log(`err: ${err.message}`)
        }
    }
}
async getMonnifyToken() {
     let monnifyToken 
        try {
            if(localStorage.getItem("monnifyToken")){
                monnifyToken = JSON.parse(localStorage.getItem("monnifyToken")) 
            }
            if ( !monnifyToken ||Date.now() >= monnifyToken.expiresAt )  {
                const requestUrl =`${process.env.MONNIFY_BASE_URL}/api/v1/auth/login`
                let { data: res } = 
                await axios.post(requestUrl, "", 
                    {
                        headers: {
                            "Content-Type":"application/json",
                            Authorization: `Basic ${Buffer.from( process.env.I_CLIENT_ID + ":" + process.env.I_SECRET).toString("base64")}`,         
                        },
                    }
                );
                if ( res.requestSuccessful && res.responseMessage === "success")     
                 {
                    const token = {
                        accessToken:res.responseBody.accessToken,        
                        expiresAt:Date.now() +res.responseBody.expiresIn *1000,            
                    };

                    localStorage.setItem("monnifyToken", JSON.stringify(token));
                    return token.accessToken;
                } else return false;
            } else {
                console.log("old token");
                return monnifyToken.accessToken;
            }
        } catch (err) {
            console.log({ tokenErr: err.message });
        }
    }

    async assignVirtualAccount() {
        console.log("assigning account number - progressing" );
        const username = this.user.firstName + " " + this.user.lastName;
        try {
            const monnifyPayload = {
                accountName: username,
                accountReference: uuidv4(),
                currencyCode: "NGN",
                contractCode: process.env.MONNIFY_CONTRACT_CODE,
                customerName: username,
                customerEmail: this.user.email,
                getAllAvailableBanks: false,
                preferredBanks: ["035"]
            };
            let { data: res } = await axios.post(
                `${process.env.MONNIFY_BASE_URL}/api/v2/bank-transfer/reserved-accounts`,
                monnifyPayload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${await this.getMonnifyToken()}`,
                    },
                    timeout: 15000,
                }
            );
            if ( res.requestSuccessful && res.responseMessage === "success")     
             {
                // console.log( "account reserved",res.responseBody );    
                const {accountReference,customerEmail,customerName,accounts, status,createdOn} = res.responseBody
                const {bankName,bankCode, accountName,accountNumber} = accounts[0]
                const account = {
                    accountReference,        
                    customerEmail,  
                    customerName, 
                    accountNumber,  
                    accountName,    
                    bankName,
                    bankCode,
                    status,
                    createdOn,
                };
                return { assigned: true, account };
            } else return { assigned: false };
        } catch (err) {
            console.log(
                "assigning account failed",
                err.message
            );
            return { assigned: false };
        }
    }

};
