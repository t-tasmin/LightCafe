

const express = require('express');
const router  = express.Router();
const orderVar = require('./menus')

module.exports = (db) => {

  //**************************GET ROUTE***************************/
  router.get("/", (req, res) => {
    //res.render("order_checkout",orderVar);
    const time = '1:30 PM'
    res.render("last",{time});
  });

 //**************************POST ROUTE***************************/
  router.post("/", (req, res) => {
    
    
  });


  return router;
};