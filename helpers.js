const { ModelBuildPage } = require("twilio/lib/rest/autopilot/v1/assistant/modelBuild");

// This function will send a SMS to the given phone number using twillo
require("dotenv").config();


const sendSMS = (phone_number, message) => {

  let twilio = require('twilio');

  // account sid and auth token in your Twilio account Console.
  let client = new twilio(process.env.ACCOUNTSID, process.env.AUTH);

  // Send the text message.
  client.messages.create({
    to: phone_number,
    from: '+12058556664', // change to your twilio number
    body: message
  });

};

//sendSMS('9052135569', 'Your order is ready'); //-------------------------------x

module.exports = { sendSMS };
