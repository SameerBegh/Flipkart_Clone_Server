import paytmchecksum from "../paytm/PaytmChecksum.js";
import { paymentMerchantKey } from "../index.js";
import formidable from "formidable";
import https from "https";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";


dotenv.config();
const PORT = process.env.PORT || 8000;
const MAINPORT = process.env.CALL_BACK


export const addpaymentGateway = async (request, response) => {
  const { amount } = request.body;
  const totalPrice = JSON.stringify(amount);
  try {
    let paytmParams = {};
    paytmParams["MID"] = process.env.PAYTM_MID;
    paytmParams["WEBSITE"] = process.env.PAYTM_WEBSITE;
    paytmParams["CHANNEL_ID"] = process.env.PAYTM_CHANNEL_ID;
    paytmParams["INDUSTRY_TYPE_ID"] = process.env.PAYTM_INDUSTRY_TYPE_ID;
    paytmParams["ORDER_ID"] = uuid();
    paytmParams["CUST_ID"] = process.env.PAYTM_CUS_ID;
    paytmParams["TXN_AMOUNT"] = totalPrice;
    paytmParams["CALLBACK_URL"] =`${PORT}/callback`;
    paytmParams["EMAIL"] = "flipkartdemo@gmail.com";
    paytmParams["MOBILE_NO"] = "1234567890";

    let paytmCheckSum = await paytmchecksum.generateSignature(
      paytmParams,
      paymentMerchantKey
    );
    let params = {
      ...paytmParams,
      CHECKSUMHASH: paytmCheckSum,
    };
    return response.status(200).json(params);
  } catch (error) {
    return response.status(500).json(error.message);
  }
};

export const paymentresponse = async (request, response) => {
  const form = new formidable.IncomingForm();
  let PaytmCheckSum = request.body.CHECKSUMHASH;
  delete request.body.CHECKSUMHASH;

  let isVerifySignature = paytmchecksum.verifySignature(
    request.body,
    paymentMerchantKey,
    PaytmCheckSum
  );
  if (isVerifySignature) {
    let paytmParams = {};
    paytmParams["MID"] = request.body.MID;
    paytmParams["ORDERID"] = request.body.ORDERID;

    paytmchecksum
      .generateSignature(paytmParams, paymentMerchantKey)
      .then(function (checksum) {
        paytmParams["CHECKSUMHASH"] = checksum;

        let post_data = JSON.stringify(paytmParams);

        let options = {
          hostname: "securegw-stage.paytm.in",
          port: 443,
          path: "/order/status",
          headers: {
            "Content-Type": "application/json",
            "content-Length": post_data.length,
          },
        };
        let res = "";
        let post_req = https.request(options, function (post_res) {
          post_res.on("data", function (chunk) {
            res += chunk;
          });
          post_res.on("end", function () {
            JSON.parse(res);
            response.redirect(`${MAINPORT}`);
          });
        });
        post_req.write(post_data);
        post_req.end();
      });
  } else {
    return response.json({ error: "Checksum Mismatched" });
  }
};
