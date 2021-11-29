// This function will send a SMS to the given phone number using twillo

const sendSMS = function (phone_number, message){

var twilio = require('twilio');

// Find your account sid and auth token in your Twilio account Console.
var client = new twilio('AC6642a5ff5c418d4047d13dcd6dd90a38', 'f9b073f566885e555d6e77a01762d8f9');

// Send the text message.
client.messages.create({
  to: phone_number,
  from: '12058556664',
  body: message
});

};

sendSMS('9052135569', 'Your order is ready');