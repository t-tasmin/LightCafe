const express = require('express');
const http = require('http');

const restaurantMiddleware = (req, res, next) => {
console.log("++++++++++++++++================whhatttttt");
console.log('this order ===>', req.body)
  const order = req.body;
    if (order.telephone.length !== 10) {
        const templateVars = {
            script: 'Oops! Please resubmit your order and enter a valid phone number at checkout to finalise. We await you. Thank you!'
        }
        res.render('index', templateVars)
    } else {
        let phone = order.telephone;
        let name = order.cname
        let orderf = JSON.parse(order.order);
        let clientText = '';
        let restaurantText = '';
        console.log(orderf); //==================x
        const options = {
          host: 'localhost',
          port: 8080,
          path: '/restaurant',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(order.order)
          }
        };

        const httpreq = http.request(options, function (response) {
          response.setEncoding('utf8');
          response.on('data', function (chunk) {
            console.log("body: " + chunk);
          });
          response.on('end', function() {
            res.send('ok');
          })
        });
        httpreq.write(order.order);
        httpreq.end();
    }

    next();

}

module.exports = restaurantMiddleware;
