

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  //**************************GET ROUTE***************************/
  router.get("/:a", (req, res) => {
    let orderVar = JSON.parse(req.params.a);
    res.render("order_checkout", orderVar);
    //const time = '1:30 PM'
    //res.render("last",{time});
  });


  
 //**************************POST ROUTE***************************/
  router.post("/", (req, res) => {
    
    
  });


  return router;
};